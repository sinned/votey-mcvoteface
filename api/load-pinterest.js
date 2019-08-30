'use strict';

let Parser = require('rss-parser');
let parser = new Parser();
const mongoose = require('mongoose');
const Images = mongoose.model('Images');

class LoadFromPinterest {
  async load(req) {
    const pinterestRssUrl = req.query.url ? req.query.url : 'https://www.pinterest.com/choijoy/home-inspiration.rss';
    console.log('\n--LOADING PINTEREST FROM API', pinterestRssUrl);
    let loadedItems = 0;
    
    let feed = await parser.parseURL(pinterestRssUrl);
    let feedTitle = feed.title;
    feed.items.forEach(item => {
      let content = item.content;
      if (content) {
        
        let regex = /(<img[^>]+src=")([^">]+)"/;
        let foundImgMatches = content.match(regex);  
        let imgsrc = foundImgMatches[2];
        if (imgsrc) {
          console.log('loading', imgsrc);
          var imageJson = {
              experiment: feedTitle,
              image_url: imgsrc,
              name: item.title
            };

          Images.find(imageJson, (err, docs) => {
            if (docs.length === 0) {
              loadedItems++;
              let newImage = new Images(
              {
                experiment: feedTitle,
                image_url: imgsrc,
                name: item.title
              });
              newImage.save();
            } else {
              console.log(' -- already have this image');
            }
          });
        }
      }
    });

    return {
      'pinterestRssUrl': pinterestRssUrl
    };
  }
}

module.exports = new LoadFromPinterest();