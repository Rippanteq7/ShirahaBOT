const webpmux = require('../lib/sticker.js')



let handler = async(m, {client, text, usedPrefix, command}) => {
  if (!m.quoted && !/image\/webp/.test(m.quoted.mtype)) throw 'Tag sticker yang akan di modif namanya!' 
   let q = { message: { [m.quoted.mtype]: m.quoted } }
  const sticker = await client.downloadM(q)
  if (!sticker) throw sticker
  let arg = text.split('|')
  if (!arg[0] || !arg[1]) throw `Example: ${usedPrefix + command} Tenma | kawaii`
  const exif = await webpmux.createExif(arg[0], arg[1])
  const rawWebp = await webpmux.modifExif(sticker, exif)
  client.sendFile(m.chat, rawWebp, `bruh.webp`, null, m, {asSticker: true})
  
}

handler.help = ['setexif <teks> | <teks>']
handler.tags = ['convert']
handler.group = true
handler.exp = 5
handler.limit = true
handler.command = /^(set|)exif$/i

module.exports = handler
