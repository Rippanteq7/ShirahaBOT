let { spawn }  = require('child_process');
let handler  = async (m, { client, args}) => {
  if (global.client.user.jid == client.user.jid) {
    let count = args[0] && !isNaN(parseInt(args[0])) ? parseInt(args[0]) : 5
    await client.reply(m.chat, 'Mereset bot dalam hitungan: ' + count + ' Detik', m)
    setTimeout(() => {
      process.send('reset')
      process.exit()
    }, count * 1000);
  } else client.reply(m.chat, '_*a*_', m)
}
handler.help = ['restart <detik>']
handler.tags = ['owner']
handler.command = /^(debounce|restart)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

