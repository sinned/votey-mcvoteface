"use strict";

const mongoose = require("mongoose");
const _ = require("lodash");

class VoteImage {
  constructor() {
    this.name = "giphy";
    this.typeName = "reverseGiphy";
  }

  async init(bot, message) {
    return {
      question: await this.getQuestion()
    };
  }

  async start(bot, message, gameSession) {
    bot.reply(message, {
      dashbotTemplateId: "reverseGiphy.start",
      text: "Starting a Gamemonk GIF Game.",
      attachments: [
        {
          fallback: "Powered by Giphy",
          image_url:
            "https://i.dashbot.io/img/Giphy_Poweredby_100px-White_VertText.png"
        }
      ]
    });
    return bot.reply(message, {
      dashbotTemplateId:
        "reverseGiphy.image." + gameSession.gameData.question.answer,
      attachments: [
        {
          pretext:
            "You can say `more` to get another image of the same phrase or `tell me` to get the answer.",
          fallback: "Category:" + gameSession.gameData.question.hint,
          text: `*${gameSession.gameData.question.hint}*`,
          image_url: await this.getGiphyUrl(gameSession.gameData.question), //jscs: ignore
          mrkdwn_in: ["pretext"] //jscs: ignore
        }
      ]
    });
  }

  async receiveAnswer(bot, message, gameSession) {
    const oldQuestion = gameSession.gameData.question;
    if (message.text === "more") {
      return bot.reply(message, {
        dashbotTemplateId:
          "reverseGiphy.image." + gameSession.gameData.question.answer,
        attachments: [
          {
            fallback: "The image.",
            text: `*${gameSession.gameData.question.hint}*`,
            image_url: await this.getGiphyUrl(oldQuestion), //jscs: ignore
            mrkdwn_in: ["pretext", "text"] //jscs: ignore
          }
        ]
      });
    } else if (
      message.text.toLowerCase() === "tell me" ||
      message.text.toLowerCase() === "next" ||
      message.text.toLowerCase() === "tellme"
    ) {
      gameSession.gameData.question = await this.getQuestion();
      gameSession.markModified("gameData");
      await gameSession.save();
      bot.reply(message, {
        dashbotTemplateId: "reverseGiphy.tellme",
        text: `The answer was *${oldQuestion.answer}*. `
      });
      return bot.reply(message, {
        dashbotTemplateId:
          "reverseGiphy.image." + gameSession.gameData.question.answer,
        attachments: [
          {
            pretext: `Now try this one:`,
            fallback: "The image.",
            text: `*${gameSession.gameData.question.hint}*`,
            image_url: await this.getGiphyUrl(gameSession.gameData.question), //jscs: ignore
            footer: "Category:" + gameSession.gameData.question.hint,
            mrkdwn_in: ["pretext", "text"] //jscs: ignore
          }
        ]
      });
    }
    const cleanText = Canonical.clean(message.text);
    const synonymMatch = _.some(
      oldQuestion.synonyms,
      text => Canonical.clean(text) === cleanText
    );
    if (synonymMatch || cleanText === Canonical.clean(oldQuestion.answer)) {
      gameSession.gameData.question = await this.getQuestion();
      if (!gameSession.gameData.answers) {
        gameSession.gameData.answers = [];
      }
      gameSession.gameData.answers.push({
        userId: message.user,
        text: message.text
      });
      gameSession.markModified("gameData");
      await gameSession.save();
      bot.reply(message, {
        dashbotTemplateId: "reverseGiphy.correct",
        text: `*${oldQuestion.answer}* was correct! 1 point for <@${
          message.user
        }>.`
      });
      return bot.reply(message, {
        dashbotTemplateId:
          "reverseGiphy.image." + gameSession.gameData.question.answer,
        attachments: [
          {
            pretext: `Now try this one:`,
            fallback: "The image.",
            text: `*${gameSession.gameData.question.hint}*`,
            image_url: await this.getGiphyUrl(gameSession.gameData.question), //jscs: ignore
            mrkdwn_in: ["pretext", "text"] //jscs: ignore
          }
        ]
      });
    }
  }

  finish(bot, gameSession) {
    const scores = {};
    _.each(gameSession.gameData.answers, answer => {
      scores[answer.userId] = scores[answer.userId]
        ? scores[answer.userId] + 1
        : 1;
    });
    let allScores = [];
    _.each(scores, (score, userId) => {
      allScores.push({
        userId: userId,
        score: score
      });
    });
    allScores = _.sortBy(allScores, item => -1 * item.score);
    let finalText = `Time is up. The last answer was *${
      gameSession.gameData.question.answer
    }*\n`;
    _.each(allScores, (score, i) => {
      finalText += `${i + 1}) <@${score.userId}>\t${score.score} points\n`;
    });
    return bot.say({
      dashbotTemplateId: "reverseGiphy.timesUp",
      channel: gameSession.channelId,
      text: finalText
    });
  }

  async getQuestion() {
    const questions = await ReverseGiphyQuestion.find().exec();
    const question = Random.fromArray(questions);
    // console.log(`the answer is ${question.answer}`);
    return question.toObject();
  }

  async getGiphyUrl(question) {
    let phrase = question.answer;
    if (question.search) {
      phrase = question.search;
    }
    phrase = phrase.toLowerCase().replace(" ", "-");
    const results = await giphy.search({
      q: phrase,
      rating: "g"
    });
    // jscs: enable requireCamelCaseOrUpperCaseIdentifiers
    let error = {};
    if (results && results.data) {
      const image = Random.fromArray(results.data);
      if (image) {
        if (parseInt(image.images.fixed_height.size) < 2000000) {
          return image.images.fixed_height.url;
        } else if (
          parseInt(image.images.fixed_height_downsampled.size) < 2000000
        ) {
          return image.images.fixed_height_downsampled.url;
        } else if (parseInt(image.images.fixed_height_small.size) < 2000000) {
          return image.images.fixed_height_small.url;
        } else {
          return image.images.fixed_height_still.url;
        }
      }
    }

    // try giphy tag search instead
    const results2 = await giphy.random({
      tag: phrase,
      rating: "g",
      fmt: "json"
    });
    let image2 = _.get(results2, "data.image_url");
    return image2 || "https://media.giphy.com/media/CdhxVrdRN4YFi/giphy.gif"; // stand by
  }
}

module.exports = VoteImage;
