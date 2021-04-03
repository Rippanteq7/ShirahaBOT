
let { monospace } = require('../lib/utils')
let { Mimetype } = require('@adiwajshing/baileys')

let handler = async (m, { client, text, args, participants }) => {
    let target = m.mentionedJid.length > 0 ? m.mentionedJid[0]: args[0] && !isNaN(parseInt(text.replace(/^\+/g, '').replace(/ /g, ''))) ? text.replace(/^\+/g, '').replace(/ /g, '') + '@s.whatsapp.net': m.quoted && m.quoted.sender ? m.quoted.sender: m.sender
  let user = global.DB['users'].find(v=> v.jid == target)
  let ext = user && user.profile ? user.profile.ext : 'jpeg'
  let isBanned = user.isBanned ? 'Ya' : 'Tidak'
  let isPro = user.pro ? 'Unlimited' : 'Free️'
  let name = user.name ? user.name : client.getName(target)
  let { status } = user.status ? { status: user.status } : await client.getStatus(target)
  let adminsGroup = participants.filter(v=> v.isAdmin || v.isSuperAdmin).map(v=>v.jid)
  let isAdmins = adminsGroup.includes(target) ? 'Admin' : 'Member'
  status = typeof status != 'string' ? '-' : status
  let pp = './src/avatar_contact.png'
   try {
      pp = user && user.profile ? user.profile.base64 : await client.getProfilePicture(target)
   }catch(e){
     console.log(e)
   }finally {
      let caption = '╭─『 *PROFILE* 』\n'
        + `│ *Username:* ${monospace(name)}\n`
        + `│ *User Info:* ${monospace(status)}\n`
        + `│ *Status:* ${monospace(isAdmins)}\n`
        + `│ *isBanned:* ${monospace(isBanned)}\n`
        + `│ *User Type:* ${monospace(isPro)}\n`
        + `│ *Limit:* ${monospace(user.limit)}\n`
        + '╰────\n'
      switch(ext) {
           case 'mp4':
               client.sendFile(m.chat, pp, 'profile.gif', caption.trim(), m, { mimetype: Mimetype.gif })
           break
             default:
               client.sendFile(m.chat, pp, 'profile.png', caption.trim(), m)
      }
   }






}

handler.help = ['profile']
handler.tags = ['user']
handler.command = /^profile?$/i
handler.group = true
handler.exp = 20


module.exports = handler

