const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

async function getMessageLogs() {
    try {
      const messages = await client.messages.list({ limit: 50 });
      messages.sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));
      return messages;
    } catch (error) {
      console.error('Error fetching message logs:', error);
      throw error;
    }
  }

module.exports = { getMessageLogs };
