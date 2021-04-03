let syntaxerror = require('syntax-error')
let fs = require('fs')
let path = require('path')
let { execSync } = require('child_process')
let handler = async(m, { client, text, args, }) => {
  let _text = text.split(';')
  let filename = _text[0].trim() + '.js'
  let _require =  _text[1].split(',') ? _text[1].split(',').join('\n') : _text[1].trim() + '\n'
  let _sc = _text[3]
  let _args = _text[2].split(',') ? _text[2].split(',').join(', ') : _text[2]
  let _perm = _text[4].split('.').slice(1).map(per => 'handler.' + per).join('\n')
  let sc = `${_require.trim()}

let handler = async(m, {${_args.trim()}}) => {
  ${_sc.trim()}
}
${_perm.trimEnd()}

module.exports = handler
`

let err = await syntaxerror(sc)
if (err) return client.reply(m.chat, '```' + err + '```', m)
let input = path.join(__dirname, `./${filename}`)
let output = path.join(__dirname, `./plugins/${filename}`)
fs.writeFileSync(input, sc)
await execSync(`beautify -o ${output} -f js ${input}`)
client.reply(m.chat, '```' + fs.readFileSync(`./plugins/${filename}`).toString('utf-8') + '```', m)
client.reply(m.chat, `Done creating plugin with name: ${filename}`, m)
fs.unlinkSync(input)
  
}

handler.command = /^plugins?$/i
handler.owner = true

module.exports = handler