module.exports = async function(controller) {
  
  const mongoose = require('mongoose');
  const dashbot = require('dashbot')(process.env.DASHBOT_API_KEY, {debug:false}).slack;
  const Images = mongoose.model('Images');
  const VoteLogs = mongoose.model('VoteLogs');
  const _ = require('lodash');
  
  controller.hears('vote', 'direct_message, direct_mention', async function(bot, message) {
    bot.reply(message, 'Getting data..');
    bot.reply(message, {
        attachments: await getVoteAttachments()
    });
  });
  
  // when someone votes
  controller.on('interactive_message_callback', async function(bot, message) {
    dashbot.logIncoming(bot.identity, bot.team_info, message);
    var userId = message.user;
    var userName = _.get(message, 'raw_message.user.name');
    var teamId = message.team.id;
    var voteTimestamp = message.action_ts;
    var votedForName = _.get(_.first(message.actions), 'name');
    var votedFor = _.get(_.first(message.actions), 'value');
    var actions = _.get(message, 'original_message.attachments[2].actions');
    
    // figure out votedAgains. some lazy assumptions being made here.
    var votedAgainst;
    if (actions[0].value === votedFor) {
      votedAgainst = actions[1].value;
    } else {
      votedAgainst = actions[0].value;
    }
    
    if (votedFor) {
      var voteId = message.callback_id;
      var votedImageUrl = votedForName === 'Image A' ? message.original_message.attachments[0].image_url : message.original_message.attachments[1].image_url;
      bot.replyInteractive(message, {
        attachments: [{
          title: `${userName} voted for ${votedForName}`,
          thumb_url: votedImageUrl
        }]
      });
      bot.reply(message, {
          attachments: await getVoteAttachments()
      });
      var vote = {
        userId,
        userName,
        teamId,
        voteTimestamp,
        votedForName,
        votedFor,
        votedAgainst
      };
      console.log('vote is', vote);
      const imageToUpdate = await Images.findOne({_id: votedFor});
      imageToUpdate.votes = imageToUpdate.votes ? imageToUpdate.votes + 1 : 1;
      await imageToUpdate.save();
      console.log('imageToUpdate', imageToUpdate);
      const newVoteLog = new VoteLogs(vote);
      newVoteLog.save();      
    }    

  });
  
  async function getVoteImages() {
    // const images = await Images.find({}).exec();
    const voteimages = await Images.aggregate([ 
      // { $match: { experiment: 10 } },
      { $sample: { size: 2 } } 
    ]).exec();
    return voteimages;
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
