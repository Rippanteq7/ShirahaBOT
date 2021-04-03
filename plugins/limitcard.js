const { spawn } = require('child_process')
const jimp = require('jimp')
let handler = async(m, { client, text, args}) => {
  let user = global.DB['users'].find(v=> v.jid == m.sender)
  let limit = user.limit
  console.log('bruh')
  let pp 
  try {
    pp = await client.getProfilePicture(m.sender)
  }catch {
    pp = 'src/avatar_contact.png'
  }
  let name = client.getName(m.sender)
  let teks = `Name: ${name}\n`
  + `Level: ${user.level}\n`
  + `Exp: ${user.exp}\n`
  + `Limit: ${limit}\n`
  + `Money: ${user.money}\n`
  + `Banned: ${user.isBanned ? 'Ya' : 'Tidak'}`

 // + `User info: ${(await client.getStatus(m.sender)).status}\n`
  let fontPath = 'src/font/Zahraaa.ttf'
  let outputPath = 'tmp/anu.jpg' 
  let inputPath = 'src/card.jpg'
    spawn('convert', [
    inputPath,
    '-font',
    fontPath,
    '-size',
    '1024x784',
    '-pointsize',
    '53',
    '-fill',
    '#ffffff',
    '-interline-spacing',
    '0.5',
    '-annotate',
    '+606+177',
    teks,
    outputPath
  ]).on('error', err => client.reply(m.chat, util.format(err), m))
   .on('exit', () => {
     let images = [outputPath, pp]
     let jimps = []
     for (let i in images) {
       jimps.push(jimp.read(images[i]))
     }
     Promise.all(jimps).then((data) => {
       return Promise.all(jimps)
     }).then(async(data) => {
      // data[1].cover(300, 300)
       data[1].resize(405, 405)
       data[0].composite(data[1], 68, 158)
       data[0].resize(800, jimp.AUTO)
       let buffer = await data[0].getBufferAsync('image/png')
       client.sendFile(m.chat, buffer, 'anu.png', '', m)
     })
   })
  
  
  
}


handler.command = /^(card|le?ve?l)$/i
handler.help = ['level']
handler.tags = ['user']
handler.group = true

module.exports = handler





function fixWord(s) {
  let teks = s.split(' ')
  let len = teks.slice(0, 10).length
  let teks1 = teks.length > 5 ? teks.slice(0, 10) : teks
  
}