const path = require('path');
const fs = require ('fs')
const { spawn } = require('child_process')

global.pin = global.pin ? global.pin : {}
let handler = async(m, {client, args, text, command, usedPrefix}) => {
  let helper = `tag pesan hasil pencarian pinterest ${client.user.name} dan kirim perintah ${usedPrefix + command} <urutan>\nContoh: ${usedPrefix + command} 2`
  if (!m.quoted) return m.reply(helper)
  if (!global.pin[m.quoted.id]) return m.reply(helper)
  if (global.pin[m.quoted.id] && args.length === 0) return m.reply(`Example: ${usedPrefix + command} 3`)
  let i = parseInt(args[0])
  if (isNaN(i)) return m.reply(`Urutan harus berupa angka!`)
  if (!global.pin[m.quoted.id][i - 1]) return m.reply(`Tidak ada urutan dengan angaka: ${i}`)
  let url = global.pin[m.quoted.id][i - 1]
  if (url.endsWith('m3u8')) {
    try {
      m.reply(`_Tunggu sebentar video sedang di process_`)
      url = await getVideoPin(url)
    }catch(err) {
      throw err
    }
  }
  
  client.sendFile(m.chat, url, '', '', m)
}

handler.command = /^getpin$/
handler.tags = ['']
handler.help = ['']
handler.limit = true
handler.group = true

module.exports = handler


function getVideoPin(url) {
  return new Promise((resolve, reject) => {
    let temp = path.join(__dirname, '../tmp/' + (1 * new Date) + '_pin.mp4')
    console.log(temp)
    spawn('ffmpeg', 
    ['-i', url,
    '-preset', 'slow',
    '-codec:a', 'aac',
    '-b:a', '128k',
    '-codec:v','libx264',
    '-pix_fmt', 'yuv420p',
    '-b:v', '750k',
    '-minrate', '400k',
    '-maxrate', '1000k',
    '-bufsize', '1500k',
    '-vf', 'scale=-1:360',
    temp])
    .on('error', reject)
    .on('exit', () => {
      resolve(fs.readFileSync(temp))
      if (fs.existsSync(temp)) fs.unlinkSync(temp)
    })
  })
}