let handler = async(m, {client, usedPrefix, command, args}) => {
  if (args.length === 0) return m.reply(`Example: ${usedPrefix + command} #`)
  if (args.length < 1) return m.reply(`Example: ${usedPrefix + command} #`)
  if (args[0].length > 1) return m.reply(`Prefix terlalu panjang max 1 symbol/huruf`)
  global.DB['groups'].find(v=>v.jid == m.chat).prefix = args[0].toLowerCase()
  m.reply(`Berhasil Mengganti prefix ${client.user.name} di group ini!\nPrefix bot di group ini sekarang: *${args[0].toLowerCase()}*`)
  
}

handler.command = /^(set|)prefix$/i
handler.tags = ['admin']
handler.admin = true
handler.group = true
handler.help = ['setprefix <prefix>']

module.exports = handler