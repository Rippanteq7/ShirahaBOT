const { MessageType } = require('@adiwajshing/baileys')
const PhoneNumber = require('awesome-phonenumber')

let handler = async(m, {client}) => {
  const vcard = 'BEGIN:VCARD\n' // metadata of the contact card 
  + 'VERSION:3.0\n'
  + 'FN:RRuLL\n' // full name 
  + 'ORG:Loli hunter;\n' // the organization of the contact
  + 'TEL;type=CELL;type=VOICE;waid=' + global.owner[0] + ':' + PhoneNumber(`+${global.owner[0]}`).getNumber('International') + '\n' // WhatsApp ID + phone number
  + 'END:VCARD'
  client.sendMessage(m.chat, {displayname: 'RRuLL',vcard: vcard }, MessageType.contact, {quoted: m})
}


handler.command = /^owner$/i
handler.tags = ['main']
handler.help = ['owner']
handler.exp = 0

module.exports = handler