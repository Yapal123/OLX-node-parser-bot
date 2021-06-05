const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const http = require('http');
const fs = require('fs');
require('dotenv').config();


const vgmUrl = process.env.OLX_URL;
/**
 * Getting array with OLX items to compare with new parsed items
 */
const beginningMessage = process.env.BEGINNING_MESSAGE;
const appartaments = require('./test.json');
const telegramBot = require('node-telegram-bot-api');
const botToken = process.env.TELEGRAM_TOKEN;
const bot = new telegramBot(botToken,{polling:true});


bot.onText(/бот, ищи хаты/, (msg, match) => {

	const chatId = msg.chat.id

	bot.sendMessage(chatId, beginningMessage);
/**
 * Yeah, `setInterval`, because I was lazy to wrap this app in docker container and configure cronjobs. 
 * But, dear contributor, if you want - its up to you!
 */
  setInterval(()=>{
    got(vgmUrl)
    .then((response) => {
      const dom = new JSDOM(response.body);
      dom.window.document
        .querySelectorAll(".offer-wrapper")
        .forEach((element) => {
          /**
           * Getting olx item
           */
          let link = element.querySelector("h3").querySelector("a").getAttribute("href");

          if (!link.includes('promoted') && !appartaments.includes(link)) {
            /**
             * If item not promoted and its new (not includes in appartaments array) - pushing it to appartaments
             */
            appartaments.push(
              link
            );
            console.log(link)

            bot.sendMessage(chatId, link);

          }else{
            return;
          }
          
        });
        /**
         * Rewriting appartaments to file for next OLX-items comparing
         */
        fs.writeFileSync ("test.json", JSON.stringify(appartaments), function(err) {
          if (err) throw err;
          console.log('complete');
        });
    })
    .catch((err) => {
      console.log(err);
    });
    console.log('a minute has passed')
  },60000);
})

  

  http.createServer(function (request, response) {
      // Send the HTTP header 
      // HTTP Status: 200 : OK
      // Content Type: text/plain
      response.writeHead(200, {'Content-Type': 'text/plain'});
      
      // Send the response body as "Hello World"
      response.end('Hello World\n');
   }).listen(3000);
   
   // Console will print the message
   console.log('Server running at http://127.0.0.1:3000/');