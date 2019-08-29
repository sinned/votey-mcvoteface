module.exports = function(controller) {
  
  const mongoose = require('mongoose');
  const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug:false}).slack;
  const ImagesModel = mongoose.model('Images');
  
  controller.hears('vote', 'direct_message', async function(bot, message) {
    bot.reply(message, {
        attachments: await getVoteAttachments()
    });
  });
  
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('interactive_message_callback', async function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    var votedFor = message.actions[0].value;
    bot.replyInteractive(message, `You voted for ${votedFor}`);
    bot.reply(message, {
        attachments: await getVoteAttachments()
    });

  });
  
  async function getAllImages() {
    const images = await ImagesModel.find({}).exec();
    console.log('getAllImages', images);
    return images;
  }
  
  getVoteImages() {
    
    return images;
  }
  

  async function getVoteAttachments() {
    var images = await getVoteImages();
    var callback_id = `vote-${images[0].id}-${images[1].id}`;
    console.log('the image url is',images[0].image_url);
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
