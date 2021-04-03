let handler = async (m, { client }) => {
  global.DB['groups'].find(v=> v.jid == m.chat).isBanned = false
  m.reply('Done!')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^unbanchat$/i
handler.owner = true
handler.group = true
module.exports = handler
