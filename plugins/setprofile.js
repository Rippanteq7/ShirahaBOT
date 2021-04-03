const { fromBuffer } = require('file-type')
let { baseURI } = require('../lib/utils')
let handler = async(m, { client, usedPrefix }) => {
  let enc = m.quoted ? { message: { [m.quoted.mtype]: m.quoted}} : m
  let mtype = (m.quoted ? m.quoted : m).mtype
  //console.log(enc);
  if (!/^(image|video)/i.test(mtype)) return client.reply(m.chat, 'Media harus berupa gif/video/img', m)
  let seconds = mtype == 'videoMessage' ? enc.message.videoMessage.seconds : 0
  if (seconds > 10) return client.reply(m.chat, 'Durasi Media Teralalu Panjang, Max 10 detik!', m)
  let pp = await client.downloadM(enc)
  if (!pp) throw pp
  let type = await fromBuffer(pp)
  global.DB['users'].find(v=>v.jid == m.sender).profile = { base64: baseURI(pp, type.mime), ext: type.ext }
  client.reply(m.chat, `Berhasil Untuk mengeset Profile Mu!\n_*Kirim perintah ${usedPrefix}profile untuk melihatnya*_`, m)
  //console.log(type);
  
  
  
}


handler.tags = ['user']
handler.help = ['setprofile <reply|caption>']
handler.command = /^set(my|)profile$/i
handler.group = true
handler.premium = true
module.exports = handler