module.exports = function(controller) {

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
  
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('block_actions', function(bot, message) {
    bot.reply(message, 'got a block action');
  });

};
