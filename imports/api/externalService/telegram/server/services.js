import {getHotUpdateConf} from "../../../hotUpdateConf/services";
import {formatString} from "../../../../utils/funcs";
import {fetch, Headers} from "meteor/fetch";

const sendNotify = async function(msgObj, msgType) {
    const teleConf = await getHotUpdateConf('telegramConfig')
    if (teleConf && teleConf.switch) {
        let message = teleConf.name + '消息類型錯誤,請檢查tg配置'
        if (teleConf.message[msgType]) {
            message = formatString(teleConf.name + teleConf.message[msgType], msgObj)
        }
        _send_message(teleConf.botId, teleConf.chatId, message)
    }
}

const _telegram_url = function (bot_id, chat_id) {
    return `https://api.telegram.org/${bot_id}/sendMessage?chat_id=${chat_id}&parse_mode=Markdown`;
}

const _send_message = async function(bot_id, chat_id, message) {
    let params = {text: message};
    try {
        let headers = {
            'Content-Type': 'application/json',
        };

        let requestInit = {
            method: 'POST',
            headers: new Headers(headers),
            body: JSON.stringify(params)
        }
        let resp = await fetch(_telegram_url(bot_id, chat_id), requestInit)
        const response = await resp.json()
        console.log(response.content, 'Telegram send message result');
    } catch (err) {
        console.log(err, 'Telegram send message error');
    }
};

export {sendNotify}
