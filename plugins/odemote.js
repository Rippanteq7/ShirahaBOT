let handler = async (m, { client, args }) => {
  let users = m.mentionedJid
  client.groupDemoteAdmin(m.chat, users)
}
handler.help = ['demote',].map(v => 'o' + v + ' @user')
handler.tags = ['owner']
handler.command = /^odemote$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = true

handler.fail = null

module.exports = handler
