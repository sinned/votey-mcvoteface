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
        attachments:getVoteAttachments()
    });
});
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('interactive_message_callback', function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    var votedFor = message.actions[0].value;
    // bot.replyInteractive(message, `You voted for ${votedFor}`);
    bot.reply(message, {
        attachments: getVoteAttachments()
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

  function getVoteAttachments() {
    var attachments = [
            {
                title: 'Vote for an Image:',
                image_url: 'https://api.slack.com/img/blocks/bkb_template_images/goldengate.png',
                callback_id: 'vote-123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Image A",
                        "text": "Image A",
                        "value": "A",
                        "type": "button",
                    },
                    {
                        "name":"Image B",
                        "text": "Image B",
                        "value": "B",
                        "type": "button",
                    }
                ]
            }
        ];
    return attachments;
  }

};
