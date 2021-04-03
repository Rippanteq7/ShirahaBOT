let { exec } = require("child_process")
let util = require('util')
let handler = async (m, { client, command, text, usedPrefix }) => {
  if (global.client.user.jid != client.user.jid) return
 // let term = execSync(command.trimStart()  + ' ' + text.trimEnd())
  exec(command.trimStart() + ' ' + text.trimEnd(),(err, stdin,stdout,stderr) => {
    if (err) return m.reply(util.format(err))
    else if (stdout) return m.reply(util.format(stdout))
    else if (stdin) return m.reply(util.format(stdin))
    else if (stderr) return m.reply(util.format(stderr))
    else return console.log('unknown response')
  })
  
}
handler.customPrefix = new RegExp('^[$\^]')
handler.command = new RegExp
handler.owner = true
module.exports = handler
