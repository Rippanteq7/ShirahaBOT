let syntaxerror = require('syntax-error')
let util = require('util')
let fs = require('fs')
let { execSync } = require('child_process')

let handler  = async (m, { client, usedPrefix, command, text, noPrefix, args, isOwner }) => {
   if (!m.quoted) return client.reply(m.chat, 'Sc nya?', m)
  let _sc = m.quoted.text //m.quoted.text.replace(/\${/g, '\' + ').replace(/}\$/g, ' + \'').replace(/`/g, '\'')
  let _filename = _output = args[0] ? args[0] : './cmd.js'
  console.log(args);
 //let err = await syntaxerror(_sc)
 //if (err) return client.reply(m.chat, '```' + err + '```', m)
  //let sc = fs.readFileSync('./plugins/play.js').toString('utf-8')
  fs.writeFileSync(_filename, _sc)
  await execSync(`beautify -o ${_output} -f ${(args[1] ? args[1] : 'js')} ${_filename}`)
  client.reply(m.chat, fs.readFileSync(_output).toString(), m)
}


handler.tags = ['owner']
handler.customPrefix = /^fs/
handler.command = /^write$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.admin = false
handler.botAdmin = false
handler.fail = null
module.exports = handler

