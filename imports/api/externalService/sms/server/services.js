import logging from "../../../logging";
import {settings} from "../../../../settings";
import {fetch} from "meteor/fetch";
import {Enum} from "../../../../utils/enum";
import {SmsRecord, SmsSendStatus, SmsTemplate, SmsTemplateType, SmsTemplateWay} from "../colletctions";
import {set} from "../../../cache";
import {randomNum} from "../../../../utils/funcs";
import SimpleSchema from "simpl-schema";

const logger = logging.getLogger(module.id);
const urlencode = require('urlencode')

const countryCode = new Enum({
    '86': 'zh',
    '84': 'vi'
})

const smsErrCode = new Enum({
    "0": "短信發送成功",
    "-1": "參數不全",
    "-2": "服務空間不支持，聯係空間商",
    "30": "密碼錯誤",
    "40": "賬戶不存在",
    "41": "餘額不足",
    "42": "賬戶已過期",
    "43": "IP地址限制",
    "50": "内容含有敏感字",
    "51": "手機號碼錯誤",
})

const voiceSmsErrCode = new Enum({
    "0": "请求成功",
    "1": "应用不可用或key错误",
    "2": "参数错误或为空",
    "3": "余额不足",
    "4": "内容为空或包含非法关键词",
    "5": "内容过长",
    "6": "号码有误",
    "9": "IP非法",
    "20": "url不存在",
    "21": "显示号码有误",
    "22": "路由未开通",
    "23": "国码有误",
    "88": "请求失败",
    "99": "系统错误"
})

const _get_lang = function (iddCode) {
    return countryCode[iddCode] ? countryCode[iddCode] : 'en'
}

const _send_request = async function (url, params = null, method = 'GET') {
    try {
        let requestInit = {
            method: method,
        }
        if (method === 'POST') {
            requestInit.body = params
        }
        let resp = await fetch(url, requestInit)
        return resp.json()
    } catch (err) {
        logger.error(`sms send error, error: ${err}`)
    }
}

const _build_message = async function (code, codeType, iddCode) {
    let template = await getSmsTemplate(codeType, iddCode)
    return template.content.replace('{code}', code)
}

const _build_url = async function (mobile, message, iddCode) {
    let url = settings.smsBao.host
    if (!iddCode || iddCode === '86') {
        url += '/sms';
    } else {
        url += '/wsms';
        mobile = "+" + iddCode + mobile
    }
    url += `?u=${settings.smsBao.username}&p=${settings.smsBao.password}&m=${urlencode(mobile)}&c=${urlencode(message, 'utf-8')}`
    return url
}

const _send_sms = async function (mobile, message, iddCode) {
    const url = await _build_url(mobile, message, iddCode)
    const resp = await _send_request(url)
    if (resp !== 0) {
        logger.error(`sms send failed, mobile:+${iddCode} ${mobile}, reason:${smsErrCode[resp]}`)
    }
    return resp
}

const _send_voice_sms = async function (mobile, message, iddCode) {
    const url = settings.smsVoice.voiceSms.api
    let params = new URLSearchParams()
    params.append('appkey', settings.smsVoice.voiceSms.appKey)
    params.append('secretkey', settings.smsVoice.voiceSms.secretkey)
    params.append('phone', mobile)
    params.append('country_code', iddCode)
    params.append('content', message)
    params.append('lang', _get_lang(iddCode))
    const resp = await _send_request(url, params, 'POST')
    if (resp.code !== '0') {
        logger.error(`voice sms send failed, mobile:+${iddCode} ${mobile}, reason:${voiceSmsErrCode[resp.code]}`)
    }
    return parseInt(resp.code)
}

const _send_email = async function (email, code) {
    process.env.MAIL_URL = settings.email.mail_url;
    let html = `<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Verify your email address</title>
  <style type="text/css" rel="stylesheet" media="all">
    *:not(br):not(tr):not(html) {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      line-height: 1.4;
      background-color: #F5F7F9;
      color: #839197;
      -webkit-text-size-adjust: none;
    }
    a {
      color: #414EF9;
    }

    /* Layout ------------------------------ */
    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #F5F7F9;
    }
    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Masthead ----------------------- */
    .email-masthead {
      padding: 25px 0;
      text-align: center;
    }
    .email-masthead_logo {
      max-width: 400px;
      border: 0;
    }
    .email-masthead_name {
      font-size: 16px;
      font-weight: bold;
      color: #839197;
      text-decoration: none;
      text-shadow: 0 1px 0 white;
    }

    /* Body ------------------------------ */
    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      border-top: 1px solid #E7EAEC;
      border-bottom: 1px solid #E7EAEC;
      background-color: #FFFFFF;
    }
    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
    }
    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      text-align: center;
    }
    .email-footer p {
      color: #839197;
    }
    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      text-align: center;
    }
    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #E7EAEC;
    }
    .content-cell {
      padding: 35px;
    }
    .align-right {
      text-align: right;
    }

    /* Type ------------------------------ */
    h1 {
      margin-top: 0;
      color: #292E31;
      font-size: 19px;
      font-weight: bold;
      text-align: left;
    }
    h2 {
      margin-top: 0;
      color: #292E31;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    h3 {
      margin-top: 0;
      color: #292E31;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }
    p {
      margin-top: 0;
      color: #839197;
      font-size: 16px;
      line-height: 1.5em;
      text-align: left;
    }
    p.sub {
      font-size: 12px;
    }
    p.center {
      text-align: center;
    }

    /* Buttons ------------------------------ */
    .button {
      display: inline-block;
      width: 200px;
      background-color: #414EF9;
      border-radius: 3px;
      color: #ffffff;
      font-size: 15px;
      line-height: 45px;
      text-align: center;
      text-decoration: none;
      -webkit-text-size-adjust: none;
      mso-hide: all;
    }
    .button--green {
      background-color: #28DB67;
    }
    .button--red {
      background-color: #FF3665;
    }
    .button--blue {
      background-color: #414EF9;
    }

    /*Media Queries ------------------------------ */
    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }
    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
          <!-- Logo -->
          <tr>
            <td class="email-masthead">
              <a class="email-masthead_name">${settings.email.subject}</a>
            </td>
          </tr>
          <!-- Email Body -->
          <tr>
            <td class="email-body" width="100%">
              <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0">
                <!-- Body content -->
                <tr>
                  <td class="content-cell">
                    <h1>Verify your email address</h1>
                    <p>Thanks for using ${settings.email.subject} ! We're excited to have you as an early user.</p>
                    <p>Your verification code is : ${code}</p>

                    <!-- Action -->
                    <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div>
                            <span class="button button--blue bold" style="font-size: 30px;font-weight: 600;">${code}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p>Thanks,<br>Team ${settings.email.subject}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-cell">
                    <p class="sub center">
                      LULU Market.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    try {
        await Email.send({to: email, from: settings.email.user, subject: settings.email.subject, html: html});
    } catch (e) {
        logger.error(`sms send failed, email:${email}, reason:${e}`)
        return e.toString()
    }
    return 0
}

const sendCode = async function (username, codeType, iddCode) {
    let code = '123456'
    let message = 'local-test:123456'
    let resp = 0
    let errorMessage = ''

    if (settings.sms.switch) {
        code = randomNum()
        message = await _build_message(code, codeType, iddCode)
        if (username.match(SimpleSchema.RegEx.Email)) {
            resp = await _send_email(username, code)
            errorMessage = resp
        }
        if (username.match(SimpleSchema.RegEx.Phone)) {
            if (settings.smsVoice.voiceSms.open_country.indexOf(iddCode) > -1) {
                resp = await _send_voice_sms(username, message, iddCode)
                errorMessage = voiceSmsErrCode[resp]
            } else {
                resp = await _send_sms(username, message, iddCode)
                errorMessage = smsErrCode[resp]
            }
        }
    }
    await addSmsRecord(username, message, code, codeType, resp, errorMessage)

    set(username + '_' + codeType, code, settings.sms.expireTime)
    return resp === 0
}

const getSmsTemplate = async function (codeType, iddCode) {
    let template
    let lang = _get_lang(iddCode)
    if (settings.smsVoice.voiceSms.open_country.indexOf(iddCode) === -1) {
        template = SmsTemplate.findOne({type: codeType, way: SmsTemplateWay.TXT, lang: lang})
        if (!template) {
            template = SmsTemplate.findOne({type: codeType, way: SmsTemplateWay.TXT, lang: 'en'})
        }
    } else {
        template = SmsTemplate.findOne({type: codeType, way: SmsTemplateWay.VOICE, lang: lang})
        if (!template) {
            template = SmsTemplate.findOne({type: codeType, way: SmsTemplateWay.VOICE, lang: 'en'})
        }
    }
    return template
}

const addSmsRecord = async function (username, message, code, codeType, resp, errorMessage) {
    let record = {
        username: username,
        message: message,
        code: code,
        codeType: codeType,
        errorMessage: errorMessage,
        status: resp === 0 ? SmsSendStatus.Success : SmsSendStatus.Failed,
        createdAt: new Date()
    }
    await SmsRecord.rawCollection().insert(record)
}

export {sendCode}