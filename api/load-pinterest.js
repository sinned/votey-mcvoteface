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
    let feedTitle = feed.title;
    feed.items.forEach(item => {
      let content = item.content;
      if (content) {
        
        let regex = /(<img[^>]+src=")([^">]+)"/;
        var foundImgMatches = content.match(regex);  
        var imgsrc = foundImgMatches[2];
        if (imgsrc) {
          console.log('loading', imgsrc);
          var imageJson = {
              experiment: feedTitle,
              image_url: imgsrc,
              name: item.title
            };

          Images.find(imageJson, (err, docs) => {
            console.log('docs', docs);
            if docs.length === 0 {
                var newImage = new Images(
                {
                  experiment: feedTitle,
                  image_url: imgsrc,
                  name: item.title
                }
                newImage.save();
            } else {
              console.log(' -- already have this image');
            }
          );
          });
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