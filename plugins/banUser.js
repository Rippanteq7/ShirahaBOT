

let handler = async(m, { client, text, args}) => {
    let target = m.mentionedJid.length > 0 ? m.mentionedJid[0]: args[0] && !isNaN(parseInt(text.replace(/^\+/g, '').replace(/ /g, '').replace(/-/g, ''))) ? text.replace(/^\+/g, '').replace(/ /g, '').replace(/-/g, '') + '@s.whatsapp.net': m.quoted && m.quoted.sender ? quoted.sender: undefined
     if (target) {
       global.DB['users'].find(v=> v.jid == target).isBanned = true
       m.reply(`Sucesss banned user ${target}`)
     }
}

handler.command = /^banuser$/i
handler.owner = true

module.exports = handler