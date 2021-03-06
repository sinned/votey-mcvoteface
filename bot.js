/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This is a simple Slack bot built with Botkit and Dashbot.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Load process.env values from .env file
require("dotenv").config();

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log("Error: Specify clientId clientSecret and PORT in environment");
  process.exit(1);
}

var Botkit = require("botkit");
var debug = require("debug")("botkit:main");
var mongoStorage = require("botkit-storage-mongo")({
  mongoUri: process.env.MONGODB_URI,
  tables: ["images", "votes"]
});
var mongoose = require("mongoose");

// startup the mongoose connection
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log("Mongoose Connected!");
  // load the models in the models dir
  var modelsNormalizedPath = require("path").join(__dirname, "models");
  require("fs")
    .readdirSync(modelsNormalizedPath)
    .forEach(function(file) {
      require("./models/" + file);
    });

  // Create the Botkit controller, which controls all instances of the bot.
  var controller = Botkit.slackbot({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    clientSigningSecret: process.env.clientSigningSecret,
    verificationToken: process.env.verificationToken,
    // debug: true,
    scopes: ["bot"],
    storage: mongoStorage
    //json_file_store: __dirname + '/.db/' // store user data in a simple JSON format
  });

  controller.startTicking();

  // Set up an Express-powered webserver to expose oauth and webhook endpoints
  var webserver = require(__dirname + "/components/express_webserver.js")(
    controller
  );

  // Add the api routes.
  require("./api/routes")(webserver);

  // Set up a simple storage backend for keeping a record of customers
  // who sign up for the app via the oauth
  require(__dirname + "/components/user_registration.js")(controller);

  // Send an onboarding message when a new team joins
  require(__dirname + "/components/onboarding.js")(controller);

  // Enable Dashbot.io plugin
  if (process.env.DASHBOT_API_KEY) {
    const dashbot = require("dashbot")(process.env.DASHBOT_API_KEY, {
      debug: false
    }).slack;
    controller.middleware.receive.use(dashbot.receive);
    controller.middleware.send.use(dashbot.send);
    controller.log.info(
      "Thanks for using Dashbot. Visit https://www.dashbot.io/ to see your bot analytics in real time."
    );
  } else {
    controller.log.info(
      "No DASHBOT_API_KEY specified. For free turnkey analytics for your bot, go to https://www.dashbot.io/ to get your key."
    );
  }

  // Add all the skills in the /skills Directory
  var normalizedPath = require("path").join(__dirname, "skills");
  require("fs")
    .readdirSync(normalizedPath)
    .forEach(function(file) {
      require("./skills/" + file)(controller);
    });
});
