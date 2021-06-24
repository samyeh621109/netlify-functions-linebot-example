'use strict'

require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const serverless = require('serverless-http'); //追加
const app = express();

const config = {
    channelSecret: '1ca33b7f25ac5621c99b1b9930d1f620',
    channelAccessToken:'v63eO0pn/0PN7ItE31RG7/alzsf96eol5s/KLpOFySD72+egcgRCVbOiIt8ONpf1I2Qyg0Lv+dU9JgThZo5S7eCI+k0nUf1wRhsnz11au/7fXQv95xLoZYwUBas8HPuBO/SMy9c+C0Tj/Ny3RebjQgdB04t89/1O/w1cDnyilFU='
};

const router = express.Router(); //ルーティング用に追加
router.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
router.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken,{
      type: 'text',
      text: event.message.text
    });
}

app.use('/.netlify/functions/server', router); //ルーティング追加
module.exports = app; //追加
module.exports.handler = serverless(app); //追加
