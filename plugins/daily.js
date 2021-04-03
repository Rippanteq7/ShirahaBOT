let { pickRandom } = require('../lib/utils')

let handler = async (m, { client }) => {
  if (new Date - global.DB['users'].find(v=> v.jid == m.sender).lastClaim > 86400000) {
    let money = pickRandom([350, 450, 300, 200, 100, 150])[0]
    let exp = pickRandom([200, 300, 450, 500, 300, 100])[0]
    client.reply(m.chat, `+${money} Uang\n+${exp} Exp`, m)
    let user = global.DB['users'].find(v=> v.jid == m.sender)
    user.exp += exp
    user.money += money
    user.lastClaim = new Date * 1
  } else client.reply(m.chat, 'Maaf, Anda sudah mengklaim klaim harian hari ini', m)
}
handler.help = ['daily']
handler.tags = ['user']
handler.command = /^daily$/i
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

