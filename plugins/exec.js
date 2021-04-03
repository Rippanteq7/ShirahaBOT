let syntaxerror = require('syntax-error')
let util = require('util')

let handler  = async (m, { client, usedPrefix, command, text, noPrefix, args, isOwner }) => {
  let _return
  let _syntax = ''
  let _text = (/^\=/.test(usedPrefix) ? 'return ' : '') + noPrefix
  let old = m.exp * 1
  let i = 20
  try {
    let exec = new (async () => {}).constructor('print', 'm', 'handler', 'require', 'client', 'Array', 'process', 'args', 'global', _text)
    _return = await exec((...args) => {
      if (--i < 1) return
      console.log(...args)
      return client.reply(m.chat, util.format(...args), m)
    }, m, handler, require, client, CustomArray, process, args, global)
  } catch (e) {
    let err = await syntaxerror(_text)
    if (err) _syntax = '```' + err + '```\n\n'
    _return = e
  } finally {
    client.reply(m.chat, _syntax + util.format(_return), m)
    m.exp = old
  }
}
handler.help = ['> ', '=> ']
handler.tags = ['owner']
handler.customPrefix = /^=?> /
handler.command = /(?:)/i
handler.owner = true
handler.mods = true
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

class CustomArray extends Array {
  constructor(...args) {
    if (typeof args[0] == 'number') return super(Math.min(args[0], 10000))
    else return super(...args)
  }
}
