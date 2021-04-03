const os = require('os')


let handler = async(m, { text }) => {
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let teks = `Bot telah berjalan selama:\n\n*_${uptime}_*`
  m.reply(teks)
  
  
}

handler.command = /^(run|up)time$/i
handler.help = ['runtime']
handler.tags = ['main']
handler.exp = 0

module.exports = handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
