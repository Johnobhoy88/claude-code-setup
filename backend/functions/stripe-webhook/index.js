// backend/functions/stripe-webhook/index.js
import crypto from 'crypto';
import Stripe from 'stripe';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const secretsClient = new SecretsManagerClient({});
const ddb = new DynamoDBClient({});
const STRIPE_SECRET_ARN = process.env.STRIPE_SECRET_ARN;
const TABLE = process.env.TOKENS_TABLE || 'highlandai_tokens';

let cachedStripeSecrets = null;

async function loadStripeSecrets() {
  if (cachedStripeSecrets) return cachedStripeSecrets;
  if (!STRIPE_SECRET_ARN) throw new Error('STRIPE_SECRET_ARN not set');
  const res = await secretsClient.send(new GetSecretValueCommand({ SecretId: STRIPE_SECRET_ARN }));
  const payload = res.SecretString ? JSON.parse(res.SecretString) : {};
  cachedStripeSecrets = {
    secretKey: payload.secret_key,
    webhookSecret: payload.webhook_secret,
  };
  if (!cachedStripeSecrets.secretKey || !cachedStripeSecrets.webhookSecret) {
    throw new Error('Stripe secrets missing');
  }
  return cachedStripeSecrets;
}

function getRawBody(event) {
  if (event.isBase64Encoded) {
    return Buffer.from(event.body || '', 'base64').toString('utf8');
  }
  return event.body || '';
}

export const handler = async (event) => {
  console.log('Received Stripe webhook event');

  try {
    const stripeSecrets = await loadStripeSecrets();
    const stripeClient = new Stripe(stripeSecrets.secretKey);

    const signature =
      event.headers?.['stripe-signature'] ||
      event.headers?.['Stripe-Signature'] ||
      event.headers?.['STRIPE-SIGNATURE'];

    const rawBody = getRawBody(event);
    const stripeEvent = stripeClient.webhooks.constructEvent(rawBody, signature, stripeSecrets.webhookSecret);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      if (session.payment_status !== 'paid') {
        return response(200, { received: true });
      }

      const email = session.customer_details?.email || session.customer_email;
      const tier = session.metadata?.tier === 'monthly' ? 'monthly' : 'onetime';
      const profileId = session.metadata?.profileId;
      const stripeSessionId = session.id;

      // Avoid duplicate tokens for the same session
      const existing = await ddb.send(
        new GetItemCommand({
          TableName: TABLE,
          Key: { token: { S: stripeSessionId } },
        })
      );
      if (existing.Item) {
        console.log(`Token already exists for session ${stripeSessionId}`);
        return response(200, { received: true });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + (tier === 'monthly' ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();

      await ddb.send(
        new PutItemCommand({
          TableName: TABLE,
          Item: {
            token: { S: token },
            email: { S: email },
            tier: { S: tier },
            used: { BOOL: false },
            expiresAt: { S: expiresAt },
            stripeSessionId: { S: stripeSessionId },
            profileId: profileId ? { S: profileId } : undefined,
            createdAt: { S: new Date().toISOString() },
          },
        })
      );

      console.log(`Token generated for ${email} (tier: ${tier})`);
    }

    return response(200, { received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return response(400, { error: err.message || 'Webhook processing failed' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
