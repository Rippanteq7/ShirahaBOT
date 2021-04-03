const { uploadImage } = require('../lib/functions')
const { DWebp } = require('cwebp')
const axios = require('axios')
let handler = async(m, { client, text, usedPrefix, command }) => {
  let enc = m.quoted ? { message: { [m.quoted.mtype]: m.quoted } } : m
  let mtype = (m.quoted ? m.quoted : m).mtype
  let img 
  let isTms = /tms/.test(command)
  if (mtype === 'stickerMessage' && !enc.message.stickerMessage.isAnimated) {
    let sticker = await client.downloadM(enc)
    img = await (new DWebp(sticker)).toBuffer()
  }else if (mtype === 'imageMessage') img = await client.downloadM(enc)
  else return m.reply(`[❗] Tag image/sticker yang akan diprocess\n*sticker tidak boleh beranimasi*`)
  if (!text) return m.reply(`Example: ${usedPrefix + command} atas|bawah`)
  let arg = text.split('|') || [text]
  m.reply(`Chottomatte onii-chan~ :v`)
  if (!img) throw img
  let teks1 = arg[0]
  let teks2 = arg[1] || ''
  teks1 = teks1.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
  teks2 = teks2.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
  let urlImg = await uploadImage(img)
  console.log(urlImg)
  const { data } = await axios.get(`http://api-melodicxt-2.herokuapp.com/api/meme-maker?url=${urlImg}&text=${teks1}|${teks2}`)
  const finalImg = data.result
  client.sendFile(m.chat, finalImg.result, '', '', m, { asSticker: isTms})
}
handler.command = /^((meme|text)maker|tms)$/i
handler.tags = ['maker']
handler.help = ['textmaker', 'tms'].map(v=> v + ' atas|bawah')
handler.owner = false
handler.limit = true
handler.group = true

module.exports = handler