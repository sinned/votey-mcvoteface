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
  
  // when someone votes
  controller.on('interactive_message_callback', async function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    console.log('vote action', message);
    var userId = message.user;
    var teamId = message.team.id;
    var voteTimestamp = message.action_ts;
    var votedForName = _.get(_.first(message.actions), 'name');
    var votedFor = _.get(_.first(message.actions), 'value');
    if (votedFor) {
      var voteId = message.callback_id;
      var votedImageUrl = votedForName === 'Image A' ? message.original_message.attachments[0].image_url : message.original_message.attachments[1].image_url;
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
    }    

  });
  
  async function getVoteImages() {
    // const images = await ImagesModel.find({}).exec();
    const images = await ImagesModel.aggregate([ 
      // { $match: { experiment: 10 } },
      { $sample: { size: 2 } } 
    ]).exec();
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
                        "value": images[0]._id,
                        "type": "button",
                    },
                    {
                        "name":"Image B",
                        "text": "Image B",
                        "value": images[1]._id,
                        "type": "button",
                    }
                ]
            }
          ];
    }
    return attachments;
  }

};
