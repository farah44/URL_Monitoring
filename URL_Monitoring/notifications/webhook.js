const axios = require('axios');

const sendWebhookNotification = async (webhookUrl, data) => {
    const url = data.website;
    const urlStatus = data.statusMessage;
    const statusCode = data.statusCode;
    await axios.post(webhookUrl, {
        url,
        urlStatus,
        statusCode,
    });
};

module.exports = sendWebhookNotification;