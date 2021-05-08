let cp = require('child_process')
let { promisify } = require('util')
let exec = promisify(cp.exec).bind(cp)

let handler = async (m, { client }) => {
  m.reply('_Testing speed..._')
    let o
  try {
      o = await exec('speedtest-cli --simple')
  } catch {
    m.reply('```Terjadi kesalahan saat mengetes kecepatan...```')
  } finally {
      if (o) {
          let { stdout } = o
          m.reply(stdout.trim())
      }
  }
}
handler.help = [ 'speed']
handler.tags = ['info', 'tools']

handler.command = /^(speed|ping)$/i
module.exports = handler

function msToHMS(ms) { 
  // 1- Convert to seconds:
  var seconds = ms / 1000; // 2- Extract hours:
  var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour 
  seconds = seconds % 3600; // seconds remaining after extracting hours 
  // 3- Extract minutes: 
  var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute 
  // 4- Keep only seconds not extracted to minutes: 
  seconds = seconds % 60;
  return hours+":"+minutes+":"+seconds
}