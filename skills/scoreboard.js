module.exports = async function(controller) {
  const mongoose = require("mongoose");
  const dashbot = require("dashbot")(process.env.DASHBOT_API_KEY, {
    debug: false
  }).slack;
  const Images = mongoose.model("Images");
  const VoteLogs = mongoose.model("VoteLogs");
  const _ = require("lodash");

  controller.hears(
    "scoreboard",
    "direct_message, direct_mention",
    async function(bot, message) {
      bot.reply(message, "Getting Scoreboard..");
      var images = await getImagesByVotes();
      images = _.slice(images, 0, 3);
      var attachments = _.map(images, (image, i) => {
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
        }
        return {
          title: placeText + ": " + image.name,
          thumb_url: image.image_url
        };
      });
      bot.reply(message, {
        text: "Scoreboard",
        attachments
      });
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
