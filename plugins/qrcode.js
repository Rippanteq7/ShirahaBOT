let qrcode = require("qrcode")

let handler  = async (m, { client, text }) => {
  if (!text) throw 'Teks nya??'
  client.sendFile(m.chat, await qrcode.toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', '¯\\_(ツ)_/¯', m)
}
handler.help = [ 'code'].map(v => 'qr' + v + ' <teks>')
handler.tags = ['convert']
handler.command = /^qr(code)?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

