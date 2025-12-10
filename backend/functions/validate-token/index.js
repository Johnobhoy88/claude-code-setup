// backend/functions/validate-token/index.js
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ddb = new DynamoDBClient({});
const TABLE = process.env.TOKENS_TABLE || 'highlandai_tokens';

export const handler = async (event) => {
  console.log('Validate token request received:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || '{}');
    const token = body.token;

    if (!token) {
      return response(400, { valid: false, error: 'Token is required' });
    }

    const item = await ddb.send(
      new GetItemCommand({
        TableName: TABLE,
        Key: { token: { S: token } },
      })
    );

    if (!item.Item) {
      return response(404, { valid: false, error: 'Invalid token' });
    }

    const record = unmarshall(item.Item);
    const now = Date.now();
    const expiresAt = record.expiresAt ? new Date(record.expiresAt).getTime() : 0;

    if (expiresAt && now > expiresAt) {
      return response(400, { valid: false, error: 'Token has expired' });
    }

    if (record.tier === 'onetime' && record.used) {
      return response(400, { valid: false, error: 'Token has already been used' });
    }

    // Optionally mark used for one-time tokens here or let analyze do it.
    return response(200, {
      valid: true,
      email: record.email,
      tier: record.tier,
      expiresAt: record.expiresAt,
      profileId: record.profileId,
    });
  } catch (error) {
    console.error('Error validating token:', error);
    return response(500, { valid: false, error: 'Internal server error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
