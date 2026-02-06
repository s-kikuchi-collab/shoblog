const line = require("@line/bot-sdk");

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const clientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const middleware = line.middleware(config);
const client = new line.messagingApi.MessagingApiClient(clientConfig);

async function replyText(replyToken, text) {
  return client.replyMessage({
    replyToken,
    messages: [{ type: "text", text }],
  });
}

async function getProfile(userId) {
  try {
    const profile = await client.getProfile(userId);
    return profile.displayName || "不明";
  } catch {
    return "不明";
  }
}

module.exports = { middleware, client, replyText, getProfile };
