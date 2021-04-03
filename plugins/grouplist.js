let handler = async (m, { client }) => {
  let txt = client.chats.array.filter(v => v.jid.endsWith('g.us')).map(v =>`${client.getName(v.jid)}\n${v.jid} [${v.read_only ? 'Left' : 'Joined'}]`).join`\n\n`
  client.reply(m.chat, 'List Groups:\n' + txt, m)
}
handler.help = ['groups']
handler.tags = ['owner']
handler.command = /^(group(s|list))$/i
handler.owner = true
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler

