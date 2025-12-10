// backend/functions/get-token/index.js
import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ddb = new DynamoDBClient({});
const TABLE = process.env.TOKENS_TABLE || 'highlandai_tokens';

export const handler = async (event) => {
  console.log('Received get-token request:', JSON.stringify(event, null, 2));

  try {
    const sessionId = event.queryStringParameters?.session_id;

    if (!sessionId) {
      return response(400, { error: 'session_id is required' });
    }

    // Query DynamoDB for token by stripeSessionId
    // Since stripeSessionId is not the primary key, we need to scan with a filter
    // In production, you'd want a GSI on stripeSessionId
    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: 'stripeSessionId = :sessionId',
        ExpressionAttributeValues: {
          ':sessionId': { S: sessionId },
        },
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      // Token might not be created yet (webhook delay)
      return response(404, {
        error: 'Token not found yet. It may take a few moments to process your payment.',
        pending: true,
      });
    }

    const item = unmarshall(result.Items[0]);

    return response(200, {
      token: item.token,
      email: item.email,
      tier: item.tier,
      expiresAt: item.expiresAt,
      used: item.used || false,
    });
  } catch (error) {
    console.error('Get token error:', error);
    return response(500, { error: error.message || 'Internal server error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(body),
  };
}
