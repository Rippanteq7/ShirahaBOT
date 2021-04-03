const { spawn } = require('child_process')
const util = require('util')
const { MessageType } = require('@adiwajshing/baileys')
const path = require('path')
const fs = require('fs')
let handler  = async (m, { client }) => {
  if (!m.quoted && m.quoted.mtype != 'stickerMessage') return client.reply(m.chat, 'Tag stikernya!', m)
  let q = { message: { [m.quoted.mtype]: m.quoted }}
  if (/sticker/.test(m.quoted.mtype) && !q.message.stickerMessage.isAnimated) {
    let sticker = await client.downloadM(q)
    if (!sticker) throw sticker
    let tmp = path.join(__dirname, '../tmp/' + (new Date * 1) + '.webp')
    let out = tmp.replace(/webp$/, 'png')
    fs.writeFileSync(tmp, sticker)
    spawn('ffmpeg', 
    ['-i', tmp, out])
    .on('error', () => client.reply('Terjadi kesalahan!'))
    .on('error', () => fs.unlinkSync(tmp))
    .on('exit',async () => {
      await client.sendFile(m.chat, out, 'image.png', '', m)
      fs.unlinkSync(tmp)
      if (fs.existsSync(out)) fs.unlinkSync(out)
    })
  }else throw 'Tag sticker yang akan di jadikan image!'
}
handler.help = ['toimg (reply)']
handler.tags = ['convert']
handler.command = /^toimg$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

