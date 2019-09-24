module.exports = function(controller) {
  const mongoose = require("mongoose");
  const dashbot = process.env.DASHBOT_API_KEY
    ? require("dashbot")(process.env.DASHBOT_API_KEY, {
        debug: false
      }).slack
    : false;
  const Images = mongoose.model("Images");
  const VoteLogs = mongoose.model("VoteLogs");
  const _ = require("lodash");

  controller.hears(["^blockblock"], "direct_message", async function(
    bot,
    message
  ) {
    bot.reply(message, await getVoteContent());
  });

  // receive an interactive message, and reply with a message that will replace the original
  controller.on("block_actions", async function(bot, message) {
    if (dashbot) {
      dashbot.logIncoming(bot.identity, bot.team_info, message);
    }
    var userId = message.user;
    var userName = _.get(message, "raw_message.user.name");
    var teamId = message.team.id;
    var voteTimestamp = _.get(_.first(message.actions), "action_ts");
    var votedFor = _.get(_.first(message.actions), "value");
    var votedForText = _.get(_.first(message.actions), "text.text");
    var votedForName = votedForText;
    var blocks = _.get(message, "message.blocks");
    var actions = _.get(_.last(blocks), "elements");
    var triggerId = _.get(message, "trigger_id");

    console.log("votedFor (Block)", votedFor, triggerId);

    // figure out votedAgains. some lazy assumptions being made here.
    var votedAgainst;
    if (_.first(actions).value === votedFor) {
      votedAgainst = actions[1].value;
    } else {
      votedAgainst = actions[0].value;
    }

    if (votedFor) {
      var voteId = message.callback_id;
      var votedImageUrl =
        votedForText === "Image A"
          ? message.message.blocks[0].image_url
          : message.message.blocks[1].image_url;
      bot.replyInteractive(message, {
        attachments: [
          {
            title: `${userName} voted for ${votedForName}`,
            thumb_url: votedImageUrl
          }
        ]
      });
      const imageToUpdate = await Images.findOne({ _id: votedFor });
      imageToUpdate.votes = imageToUpdate.votes ? imageToUpdate.votes + 1 : 1;
      await imageToUpdate.save();
      var vote = {
        userId,
        userName,
        teamId,
        voteTimestamp,
        votedForName,
        votedFor,
        votedAgainst,
        triggerId
      };
      const newVoteLog = new VoteLogs(vote);
      await newVoteLog.save();
      bot.reply(message, await getVoteContent());
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
  async function getVoteContent() {
    const images = await getVoteImages();
    const content = {
      blocks: [
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Image A",
            emoji: true
          },
          image_url: images[0].image_url,
          alt_text: images[0].name
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Image B",
            emoji: true
          },
          image_url: images[1].image_url,
          alt_text: images[1].name
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Vote for an Image:"
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Image A"
              },
              style: "primary",
              value: images[0]._id
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Image B"
              },
              style: "primary",
              value: images[1]._id
            }
          ]
        }
      ]
    };
    return content;
  }
};
