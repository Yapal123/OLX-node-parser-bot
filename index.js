const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const http = require('http');
const fs = require('fs');
const vgmUrl =
  "https://www.olx.ua/nedvizhimost/kvartiry-komnaty/arenda-kvartir-komnat/kvartira/donetsk/?search%5Bfilter_float_number_of_rooms%3Afrom%5D=2&search%5Bfilter_float_number_of_rooms%3Ato%5D=2&search%5Bdistrict_id%5D=23";
const appartaments = require('./test.json');
const telegramBot = require('node-telegram-bot-api');
const botToken = '1709145377:AAEeX_iAGKbyui5_gKDmjDDuak6lr5TpYAw';
const bot = new telegramBot(botToken,{polling:true});
bot.onText(/бот, ищи хаты/, (msg, match) => {

	const chatId = msg.chat.id

	bot.sendMessage(chatId, 'Заебали вы кожаные мешки нахуй, сами нихуя не можете, мне за вас отдуваться надо блять. Ладно, приступаю к поиску ебать');
/**
 * Yeah, `setInterval`, because I was lazy to wrap this app in docker container and configure cronjobs. 
 * But, dear contributor, if you want - its up  to you!
 */
  setInterval(()=>{
    got(vgmUrl)
    .then((response) => {
      const dom = new JSDOM(response.body);
      dom.window.document
        .querySelectorAll(".offer-wrapper")
        .forEach((element) => {
          let link = element.querySelector("h3").querySelector("a").getAttribute("href");
          if (!link.includes('promoted') && !appartaments.includes(link)) {

            appartaments.push(
              link
            );
            console.log(link)
            bot.sendMessage(chatId, link);
          }else{
            return;
          }
          
        });
        fs.writeFileSync ("test.json", JSON.stringify(appartaments), function(err) {
          if (err) throw err;
          console.log('complete');
        });
    })
    .catch((err) => {
      console.log(err);
    });
    console.log('minute left')
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