const {
  HttpPage
} = require('./makeEasy')
const cheerio = require('cheerio')




const nekos = async() => {
  const url = 'https://nekos.life'
  try {
    const html = await HttpPage(url)
    const $ = cheerio.load(html)
    const element = $('#modal01 > div[class="w3-modal-content w3-animate-zoom"]')
    return element.find('img').attr('src')

  } catch(e) {
    throw e;
  }

};

module.exports = {
   nekos,
}