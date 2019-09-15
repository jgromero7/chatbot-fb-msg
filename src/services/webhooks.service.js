webhooksService = {};
const request = require('request');

// Constants
const FB_MSG_APP_URL_SEND = process.env.FB_MSG_APP_URL_SEND;
const FB_MSG_APP_ACCESS_TOKEN = process.env.FB_MSG_APP_ACCESS_TOKEN;

webhooksService.receiveMessage = (element) => {
    let senderID = element.sender.id;
    let messageText = element.message.text;
    return {senderID, messageText};
}

webhooksService.buildMessageDataText = (recipientID, message) => {
    let messageData = {
        recipient: { id: recipientID },
        message: { text: message }
    }
    return messageData;
}

webhooksService.buildMessageDataImage = (recipientID, urlImage) => {
    return messageData = {
        recipient: { id: recipientID },
        message: {
            attachment: {
                type: 'image',
                payload: { url: urlImage }
            }
        }
    }
}

webhooksService.buildMessageTemplate = (recipientID, elementTemplate = [],  payloadTemplateType = 'generic') => {
    return messageData = {
        recipient: { id: recipientID },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: payloadTemplateType,
                    elements: elementTemplate
                }
            }
        }
    }
}

webhooksService.callSendMessageAPI = (messageData) => {
    request({
        uri: FB_MSG_APP_URL_SEND,
        qs: {access_token : FB_MSG_APP_ACCESS_TOKEN},
        method: 'POST',
        json: messageData
    }, function(error, response, data) {
        if (error) {
            console.log(error);
            return false;
        }

        if (data.error) {
            console.log(data.error.message);
            return false;
        }

        return true;
    });
}

module.exports  = webhooksService;