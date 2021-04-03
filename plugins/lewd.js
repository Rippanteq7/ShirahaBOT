const fetch = require('node-fetch')
const cheerio = require('cheerio')


let handler = async(m, { client }) => {
  let group = global.DB.get('groups').find({jid: m.chat}).value()
  if (!group.isHentai) return m.reply(`*_Fitur NFSW belum di aktifkan di group ini!`)
  let resp = await fetch('https://anotepad.com/notes/7teqqbfx')
  let teks = await resp.text()
  console.log(getNote(teks).replace(/\d/g, '').split('.').map(list => list.trim()))
  
  
  
  
  
  
  
}

handler.command = /^lewd$/i
handler.owner = true

module.exports = handler



function getNote(data) {
  if(!data) return ''
  try {
    const $ = cheerio.load(data)
    const elem = $('.plaintext')
    let hasil = elem.text()
    return hasil
  }catch (err) {
    console.log(err);
  }
  
  
  
  
}