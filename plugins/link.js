let handler = async (m, { client, args }) => {
  client.reply(m.chat, 'https://chat.whatsapp.com/' + (await client.groupInviteCode(m.chat)), m)
}
handler.help = ['linkgroup']
handler.tags = ['admin']
handler.command = /^linkgro?up?$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = true
handler.botAdmin = true

handler.fail = null

module.exports = handler

