"use strict";

module.exports = async function(controller) {
  const mongoose = require("mongoose");
  const dashbot = process.env.DASHBOT_API_KEY
    ? require("dashbot")(process.env.DASHBOT_API_KEY, {
        debug: false
      }).slack
    : false;
  const Images = mongoose.model("Images");
  const VoteLogs = mongoose.model("VoteLogs");
  const _ = require("lodash");

  controller.hears(
    ["^reloadimages", "^reload images"],
    "direct_message",
    async function(bot, message) {
      bot.reply(message, "Loading new images..");
    }
  );

  controller.hears("^vote", "direct_message", async function(bot, message) {
    bot.reply(message, "Getting images..");
    bot.reply(message, {
      attachments: await getVoteAttachments()
    });
  });

  controller.hears("^sample", "direct_message", async function(bot, message) {
    bot.reply(message, "Getting images...");
    bot.reply(message, {
      attachments: await getVoteAttachments(2)
    });
  });

  // when someone votes
  controller.on("interactive_message_callback", async function(bot, message) {
    if (dashbot) {
      dashbot.logIncoming(bot.identity, bot.team_info, message);
    }
    var userId = message.user;
    var userName = _.get(message, "raw_message.user.name");
    var teamId = message.team.id;
    var voteTimestamp = message.action_ts;
    var votedForName = _.get(_.first(message.actions), "name");
    var votedFor = _.get(_.first(message.actions), "value");
    var actions = _.get(message, "original_message.attachments[2].actions");
    var triggerId = _.get(message, "trigger_id");
    console.log("votedFor", votedFor, triggerId);

    // figure out votedAgains. some lazy assumptions being made here.
    var votedAgainst;
    if (actions[0].value === votedFor) {
      votedAgainst = actions[1].value;
    } else {
      votedAgainst = actions[0].value;
    }

    if (votedFor) {
      var voteId = message.callback_id;
      var votedImageUrl =
        votedForName === "Image A"
          ? message.original_message.attachments[0].image_url
          : message.original_message.attachments[1].image_url;
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
      bot.reply(message, {
        attachments: await getVoteAttachments()
      });
    }
  });

  async function getVoteImages() {
    // const images = await Images.find({}).exec();
    let voteimages = await Images.find().exec();
    voteimages = _.shuffle(voteimages);
    voteimages = voteimages.slice(0, 2);
    console.log("getVoteImages", voteimages);
    return voteimages;
  }

  async function getVoteImagesBySample() {
    console.log("getVoteImagesBySample");
    // const images = await Images.find({}).exec();
    const voteimages = await Images.aggregate([
      // { $match: { experiment: 10 } },
      { $sample: { size: 2 } }
    ]).exec();
    return voteimages;
  }

  async function getVoteAttachments(sample = false) {
    if (sample) {
      var images = await getVoteImagesBySample();
    } else {
      var images = await getVoteImages();
    }

    var attachments;
    if (images.length > 0) {
      var callback_id = images
        ? `vote-${images[0]._id}-${images[1]._id}`
        : "no-id";
      attachments = [
        {
          title: "Image A",
          image_url: images[0].image_url,
          footer: images[0].name
        },
        {
          title: "Image B",
          image_url: images[1].image_url,
          footer: images[1].name
        },
        {
          title: "Vote for an Image:",
          callback_id,
          attachment_type: "default",
          actions: [
            {
              name: "Image A",
              text: "Image A",
              value: images[0]._id,
              type: "button"
            },
            {
              name: "Image B",
              text: "Image B",
              value: images[1]._id,
              type: "button"
            }
          ]
        }
      ];
    } else {
      // no images
      attachments = [
        {
          text: "No Images Found"
        }
      ];
    }
    return attachments;
  }
};
