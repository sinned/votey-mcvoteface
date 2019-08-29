module.exports = async function(controller) {
  
  const mongoose = require('mongoose');
  const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug:false}).slack;
  const ImagesModel = mongoose.model('Images');
  const _ = require('lodash');
  
  controller.hears('vote', 'direct_message', async function(bot, message) {
    bot.reply(message, 'Getting data..');
    bot.reply(message, {
        attachments: await getVoteAttachments()
    });
  });
  
  // receive an interactive message, and reply with a message that will replace the original
  controller.on('interactive_message_callback', async function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    console.log('vote action', message);
    var votedFor = message.actions[0].value;
    var voteId = message.callback_id;
    var votedImageUrl = votedFor === 'A' ? message.original_message.attachments[0].image_url : message.original_message.attachments[1].image_url;
    console.log('votedImageUrl', votedImageUrl);
    bot.replyInteractive(message, {
      attachments: [{
        title: `You voted for ${votedFor}`,
        thumb_url: votedImageUrl
      }]
    });
    bot.reply(message, {
        attachments: await getVoteAttachments()
    });

  });
  
  async function getVoteImages() {
    // const images = await ImagesModel.find({}).exec();
    const images = await ImagesModel.aggregate([ 
      // { $match: { experiment: 10 } },
      { $sample: { size: 2 } } 
    ]).exec();
    console.log('images',images);
    return images;
  }

  async function getVoteAttachments() {
    var images = await getVoteImages();
    var attachments;
    if (images) {
      var callback_id = images ? `vote-${images[0]._id}-${images[1]._id}` : 'no-id';
      attachments = [
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
    }
    return attachments;
  }

};
