"use strict";

let Parser = require("rss-parser");
let parser = new Parser();
const mongoose = require("mongoose");
const Images = mongoose.model("Images");

class GetImage {
  async get(req) {
    const imageId = req.params.imageId; // eg 5d899c50bc351d67709d4b70
    const image = await Images.findById(imageId).exec();

    return {
      image
    };
  }
}

module.exports = new GetImage();
