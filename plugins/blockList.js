

let handler = async(m, {client}) => {
  let blockUser = global.DB.users.filter(v=> v.isBanned === true).map(v=> v.jid.split('@')[0]).join('\n')
  m.reply(`*List Banned:*\n\n${blockUser.trim()}`)
  
  
  
}


handler.command = /^blocklist$/i
handler.owner = true

module.exports = handler