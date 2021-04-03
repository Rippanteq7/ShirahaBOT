let handler = async (m, { client, args }) => {
  let ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net'
  let users = m.mentionedJid.filter(u => !(u == ownerGroup || u.includes(client.user.jid)))
  for (let user of users) if (user.endsWith('@s.whatsapp.net')) await client.groupRemove(m.chat, [user])
}
handler.help = ['kick','-'].map(v => 'o' + v + ' @user')
handler.tags = ['owner']
handler.command = /^(okick|o\-)$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = true

handler.fail = null

module.exports = handler
