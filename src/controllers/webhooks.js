const webhooks = {};
// Services
const webhooksService = require('../services/webhooks.service');
const searchWords = require('../services/search-words.service');

// Constanst
const FB_MSG_APP_HUB_VERIFY_TOKEN = process.env.FB_MSG_APP_HUB_VERIFY_TOKEN;
const COMPARE_TEXT_SCORE = process.env.COMPARE_TEXT_SCORE;

webhooks.challenge = (req, res) => {
    if (req.query['hub.verify_token'] == FB_MSG_APP_HUB_VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    }
    res.status(401).json({'mgs': 'You are not authorized to enter here'});
}

webhooks.message = (req, res) => {
    if (req.body.object == 'page') {
        let entry = req.body.entry;

        entry.forEach(element => {
            element.messaging.forEach(element => {
                if (element.message) {
                    const msgData = webhooksService.receiveMessage(element);
                    evaluateMessage(msgData.senderID, msgData.messageText);
                }
            });
        });
    }
    res.status(200).json({'msg': 'message received'});
}

function evaluateMessage(senderID, message) {
    let messageData;
    words = searchWords.compareWord(message);

    if (words[0].score == 0 || words[0].score <= parseInt(COMPARE_TEXT_SCORE)){
        messageData = webhooksService.buildMessageDataText(senderID, `Estoy aprendiendo, aun no puedo interpretar: '${message}' para responderte`);
        webhooksService.callSendMessageAPI(messageData);
        return
    }
    if (searchWords.isContain(words[0].word, 'hola')) {
        messageData = webhooksService.buildMessageDataText(senderID, 'Hola, Bienvenido a Smart Bot!');
    } else if (searchWords.isContain(words[0].word, 'gato')) {
        messageData = webhooksService.buildMessageDataImage(senderID, 'http://i.imgur.com/SOFXhd6.jpg');
    } else if (searchWords.isContain(words[0].word, 'info')) {
        messageData = webhooksService.buildMessageTemplate(senderID, renderElementTemplate(), 'generic');
    }
    webhooksService.callSendMessageAPI(messageData);
}

function renderElementTemplate() {
    return [{
        title: 'José Romero',
        subtitle: 'Desarrollador de Softiware en Smart Bot',
        item_url: 'https://www.linkedin.com/in/jgromero7/',
        image_url: 'https://media.licdn.com/dms/image/C4E03AQFRH8xqoSwm_A/profile-displayphoto-shrink_200_200/0?e=1574294400&v=beta&t=2SwmmIqNyBdrwWTqR5icBi_lBlSNUbW1t6HUt4BNR7Q',
        buttons: [ renderButtonTemplate() ]
    }]
}

function renderButtonTemplate() {
    return {
        type: 'web_url',
        url: 'https://github.com/jgromero7',
        title: 'GITHUB',
    }
}

module.exports = webhooks;