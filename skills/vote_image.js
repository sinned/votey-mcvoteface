module.exports = function(controller) {
  
  const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug:true}).slack;
  
  controller.hears('vote', 'direct_message', function(bot, message) {
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
      'https://api.slack.com/img/blocks/bkb_template_images/beagle.png'
    ];
    return images;
  }
  

  function getVoteAttachments() {
    var attachments = [
          { 
            title: 'Image A',
            image_url: 'https://api.slack.com/img/blocks/bkb_template_images/beagle.png'
          },
          {
            title: 'Image B',
            image_url: 'https://api.slack.com/img/blocks/bkb_template_images/goldengate.png'
          }, 
          {
              title: 'Vote for an Image:',
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
