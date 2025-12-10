// backend/functions/checkout/index.js
import crypto from 'crypto';
import Stripe from 'stripe';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

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
    publishableKey: payload.publishable_key,
  };
  if (!cachedStripeSecrets.secretKey) throw new Error('Stripe secret_key missing');
  return cachedStripeSecrets;
}

export const handler = async (event) => {
  console.log('Received checkout request:', JSON.stringify(event, null, 2));

  try {
    const stripeSecrets = await loadStripeSecrets();
    const stripeClient = new Stripe(stripeSecrets.secretKey);

    const body = JSON.parse(event.body || '{}');
    const { email, tier = 'onetime', profile } = body;

    if (!email) {
      return response(400, { error: 'Email is required' });
    }

    const normalizedTier = tier === 'monthly' ? 'monthly' : 'onetime';
    const amount = normalizedTier === 'monthly' ? 999 : 299; // cents
    const frontendUrl = (process.env.FRONTEND_URL || 'https://highlandai.com').replace(/\/+$/, '');

    // Persist profile to DynamoDB for later analysis
    let profileId = null;
    if (profile) {
      profileId = crypto.randomUUID();
      await ddb.send(
        new PutItemCommand({
          TableName: TABLE,
          Item: {
            token: { S: `profile-${profileId}` },
            profileId: { S: profileId },
            profileJson: { S: JSON.stringify(profile).slice(0, 3800) }, // Dynamo item size safety
            createdAt: { S: new Date().toISOString() },
          },
        })
      );
    }

    const metadata = {
      tier: normalizedTier,
      email,
      ...(profileId ? { profileId } : {}),
    };

    const session = await stripeClient.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name:
                  normalizedTier === 'monthly'
                    ? 'Highland AI Monthly Subscription'
                    : 'Highland AI Claude Code Setup',
                description:
                  normalizedTier === 'monthly'
                    ? 'Up to 15 Claude Code setups per month'
                    : 'Professional Claude Code configuration for your project (one-time)',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: normalizedTier === 'monthly' ? 'subscription' : 'payment',
        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/pricing`,
        metadata,
      },
      {
        idempotencyKey: `checkout-${email}-${normalizedTier}-${Date.now()}-${crypto.randomUUID()}`,
      }
    );

    return response(200, {
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return response(500, { error: error.message || 'Internal server error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
