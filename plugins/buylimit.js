const uangperlimit = 350 
let handler = async (m, { client, command, args }) => {
  let user = global.DB['users'].find(v=>v.jid == m.sender)
  let count = command.replace(/^buylimit/i, '')
  count = count ? /all/i.test(count) ? Math.floor(user.money / uangperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (user.money >= uangperlimit * count) {
    user.money -= uangperlimit * count
    user.limit += count
    client.reply(m.chat, `-${uangperlimit * count} Uang\n+ ${count} Limit`, m)
  } else client.reply(m.chat, `Uang tidak mencukupi untuk membeli ${count} limit`, m)
}
handler.help = ['buylimit <jumlah limit>', 'buylimitall']
handler.tags = ['user']
handler.command = /^(buylimit([0-9]+)|buylimit|buylimitall)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler

