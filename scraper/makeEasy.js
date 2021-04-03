const request = require('request');
const fakeUa = require('fake-useragent');


const HttpPage = async(url) => {
  return new Promise((resolve, reject) => {
    request({
      headers: {
        "User-Agent": fakeUa()},
      url: `${url}`,
    }, (err, resp, html) => {
      if (!err && resp.statusCode == 200) {
        resolve(html);
      } else {
        reject(err);
      }
    });
  });
};


module.exports = {
  HttpPage,
}