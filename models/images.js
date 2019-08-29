'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImagesSchema = new Schema({
  name: {
    type: String
  },
  image_url: {
    type: String
  }
});

mongoose.model('Images', ImagesSchema);
console.log('Loading Images Model.');
