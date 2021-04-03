"use strict";

const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

const getLatest = () => {
  return new Promise((resolve, reject) => {
    const url = 'http://nekopoi.care';
    HttpPage(url, req => {
      console.log(req)
      const title = [];
      const link = [];
      const image = [];
      const data = [];
      const soup = cheerio.load(req);
      soup('div.eropost').each(function(i, e) {
        soup(e).find('h2').each(function(j, s) {
          title.push(soup(s).find('a').text().trim());
          link.push(url + soup(s).find('a').attr('href'));
        });
        image.push(url + soup(e).find('img').attr('src'));
      });
      var i;
      for (i = 0; i < title.length; i++) {
        let isi = {
          "title": title[i],
          "image": image[i].replace(url, ''),
          "link": link[i].replace(url, '')
        };
        data.push(isi);
      }
      if (data == undefined) {
        reject("No result :(");
      } else {
        var result = parseObj(data);
        resolve(result);
      }
    });
  });
};

const getInfo = (url) => {
  return new Promise((resolve,
    reject) => {
    HttpPage(url,
      req => {
        try {
          const links = [];
          let soup = cheerio.load(req);
          let title = soup("title").text();
          soup('div.liner').each(function(i, e) {
            soup(e).find('div.listlink').each(function(j, s) {
              links.push(soup(s).find('a').attr('href'))
            });
          });
          const data = {
            "title": title,
            "links": links
          };
          resolve(parseObj(data));
        } catch (err) {
          reject('Neko Error : ' + err)
        }
      })
  });
};

function parseObj(obj) {
  if (obj) return JSON.parse(JSON.stringify(obj))
  else return {}
}

function HttpPage(url, callback) {
  request({
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
    },
    'url': `${url}`,
  }, (err, resp, html) => {
    if (!err && resp.statusCode == 200) {
      callback(html);
    } else {
      throw err;
    }
  });
}

module.exports = {
  getInfo,
  getLatest,
};