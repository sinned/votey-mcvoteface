module.exports = async function(controller) {
  const mongoose = require("mongoose");
  const Images = mongoose.model("Images");
  const VoteLogs = mongoose.model("VoteLogs");
  const _ = require("lodash");

  controller.hears(
    ["scoreboard", "^top"],
    "direct_message, direct_mention",
    async function(bot, message) {
      bot.reply(message, "Getting Scoreboard..");
      var images = await getImagesByVotes();
      images = _.slice(images, 0, 5);
      var winners = _.map(images, (image, i) => {
        let counter = i + 1;
        let placeText = counter;
        switch (counter) {
          case 1:
            placeText = ":first_place_medal:";
            break;
          case 2:
            placeText = ":second_place_medal:";
            break;
          case 3:
            placeText = ":third_place_medal:";
            break;
          default:
            placeText = placeText + "";
        }
        return {
          type: "section",
          text: {
            type: "mrkdwn",
            text: placeText + ": *" + image.name + "*"
          },
          accessory: {
            type: "image",
            image_url: image.image_url,
            alt_text: image.name
          }
        };
      });
      var blocks = _.concat(
        [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Latest Scoreboard*"
            }
          },
          { type: "divider" }
        ],
        winners
      );
      var blockMessage = {
        blocks: blocks
      };
      bot.reply(message, blockMessage);
    }
  );

  controller.hears("leader", "direct_message, direct_mention", async function(
    bot,
    message
  ) {
    bot.reply(message, "Getting Current Leader..");
    var images = await getImagesByVotes();
    var winnerImage = _.first(images);
    bot.reply(message, {
      text: "The Current Leader is...",
      attachments: [
        {
          title: ":first_place_medal: " + winnerImage.name,
          thumb_url: winnerImage.image_url
        }
      ]
    });
  });

  async function getImagesByVotes() {
    // const images = await Images.find({}).exec();
    const voteimages = await Images.find()
      .sort({ votes: -1 })
      .exec();
    return voteimages;
  }
};
