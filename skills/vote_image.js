module.exports = function(controller) {
  
  var dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug:true}).slack;

  controller.hears(['vote'], 'direct_message,direct_mention', function(bot, message) {   
    bot.reply(message, getVoteContent());
  });
  
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('block_actions', function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    bot.reply(message, 'Thanks for your vote!');
    bot.reply(message, getVoteContent());
  });
  
  controller.hears('interactive', 'direct_message', function(bot, message) {
    bot.reply(message, {
        attachments:[
            {
                title: 'Do you want to interact with my buttons?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                        "name":"no",
                        "text": "No",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }
        ]
    });
});
  
  function getImages() {
    var images = [
      'https://api.slack.com/img/blocks/bkb_template_images/goldengate.png',
      'https://api.slack.com/img/blocks/bkb_template_images/beagle.png"'
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
          "image_url": images[0],
          "alt_text": "Image A"
        },
        {
          "type": "image",
          "title": {
            "type": "plain_text",
            "text": "Image B",
            "emoji": true
          },
          "image_url": images[1],
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
    return content;
  }


};
