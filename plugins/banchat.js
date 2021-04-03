let handler = async (m, { client, participants }) => {
   global.DB['groups'].find(v=>v.jid == m.chat).isBanned = true
   
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat$/i
handler.owner = true

module.exports = handler
