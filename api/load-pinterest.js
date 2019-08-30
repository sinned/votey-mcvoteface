'use strict';

let Parser = require('rss-parser');
let parser = new Parser();
const mongoose = require('mongoose');
const Images = mongoose.model('Images');

class LoadFromPinterest {
  async load(req) {
    console.log('LOADING PINTEREST FROM API');
    const pinterestRssUrl = 'https://www.pinterest.com/choijoy/home-inspiration.rss';
    let feed = await parser.parseURL(pinterestRssUrl);
 
    feed.items.forEach(item => {
      let description = item.content;
      if (description) {
        let regex = /(<img[^>]+src=")([^">]+)"/;
        var foundImgSrc = description.match(regex);     
        console.log('foundImgSrc', foundImgSrc[2]);  
        if (foundImgSrc[2]) {
          var newImage = new Images(
            {
              experiment: feed.title,
              image_url: foundImgSrc[2],
              name: item.title
            }
          );
          newImage.save();
        }
      }
    });

    let values;
    return {
      'loaded': true
    };
  }
}

module.exports = new LoadFromPinterest();