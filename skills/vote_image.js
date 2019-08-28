module.exports = function(controller) {
  
  var dashbot = require('dashbot')(process.env.DASHBOT_API_KEY).slack;

  controller.hears(['vote'], 'direct_message,direct_mention', function(bot, message) {
    const content = {
        blocks: [
          {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "Example Image",
            "emoji": true
          },
          "image_url": "https://api.slack.com/img/blocks/bkb_template_images/goldengate.png",
          "alt_text": "Example Image"
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "image1",
            "emoji": true
          },
          "image_url": "https://api.slack.com/img/blocks/bkb_template_images/beagle.png",
          "alt_text": "image1"
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
              "value": "click_me_123"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Image B"
              },
              "style": "primary",
              "value": "click_me_123"
            }
          ]
        }
      ]
    };
    bot.reply(message, content);
  });
  
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('block_actions', function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    bot.replyInteractive(message, 'Thanks for your vote!');
    console.log('interactive message incoming', bot.identity, bot.team_info);
  });

};
