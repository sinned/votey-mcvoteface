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
  

  function getVoteAttachments() {
    var images = getImages();
    var callback_id = `vote-${images[0].id}-${images[1].id}`;
    var attachments = [
          { 
            title: 'Image A',
            image_url: images[0].image_url
          },
          {
            title: 'Image B',
            image_url: images[1].image_url
          }, 
          {
              title: 'Vote for an Image:',
              callback_id,
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
