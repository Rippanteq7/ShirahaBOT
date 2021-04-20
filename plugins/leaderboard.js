

let owner = global.owner[0] + '@s.whatsapp.net'
let handler = async (m, { client, args }) => {
  let userData = global.DB['users'].sort((a,b) => b.exp - a.exp )
  let sortedExp = userData.filter(v=> v.jid !== owner)
  let usersExp = userData.map(v => v.jid).filter(v=> v !== owner)
  let len = args[0] && args[0].length > 0 ? Math.min(1000, Math.max(parseInt(args[0]), 5)) : Math.min(20, sortedExp.length)
  let text = `
• *Leaderboard Top ${len}* •
${m.isOwner ? '' : `Kamu: *${userData.map(v=> v.jid).filter(v=> v !== owner).indexOf(m.sender) + 1}* dari *${usersExp.length}*`}

${sortedExp.slice(0, len).map((data, i) => (i + 1) + '. ' + client.getName(data.jid).trim() + '\n *Lvl ' + data.level + ', ' + data.exp + ' Exp*').join`\n\n`}

`.trim()
  client.reply(m.chat, text, m /*{
    contextInfo: {
      mentionedJid: [...usersExp.slice(0, len)]
    }
  }*/)
}
handler.help = ['leaderboard <jumlah user>', 'top <jumlah user>']
handler.tags = ['group']
handler.command = /^(leaderboard|top)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0

module.exports = handler

