module.exports = function(controller) {
  
  const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug:true}).slack;
  
   controller.hears(['blockblock'], 'direct_message,direct_mention', function(bot, message) {   
     console.log('blockblock');
     bot.reply(message, getVoteContent());
  });
  
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('block_actions', function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    var votedFor = message.actions[0].value;
    bot.replyInteractive(message, `You voted for ${votedFor}`);
    bot.reply(message, getVoteContent());
  });
  
  
  function getImages() {
    var images = [
      {
        id: '1',
        image_url: 'https://api.slack.com/img/blocks/bkb_template_images/goldengate.png'
      },
      {
        id: '2',
        image_url: 'https://api.slack.com/img/blocks/bkb_template_images/beagle.png'
      }      
    ];
    return images;
  }
  function getVoteContent() {
   const images = getImages();
   const content = {
       blocks: [
         {
         "type": "image",
         "title": {
           "type": "plain_text",
           "text": "Image A",
           "emoji": true
         },
         "image_url": images[0].image_url,
         "alt_text": "Image A"
       },
       {
         "type": "image",
         "title": {
           "type": "plain_text",
           "text": "Image B",
           "emoji": true
         },
         "image_url": images[1].image_url,
         "alt_text": "Image B"
       },
       {
         "type": "section",
         "text": {
           "type": "mrkdwn",
           "text": "Which Image do you prefer?"
         }
       },
       {
         "type": "actions",
         "elements": [
           {
             "type": "button",
             "text": {
               "type": "plain_text",
               "emoji": true,
               "text": "Image A"
             },
             "style": "primary",
             "value": "A"
           },
           {
             "type": "button",
             "text": {
               "type": "plain_text",
               "emoji": true,
               "text": "Image B"
             },
             "style": "primary",
             "value": "B"
           }
         ]
       }
     ]
   };
   return content;
 }


};
