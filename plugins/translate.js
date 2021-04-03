const translatte = require('translatte')

let handler = async(m, {args, command}) => {
  switch(command) {
    case 'translate':
      let text = m.quoted && m.quoted.text ? m.quoted.text : args.slice(1).join(' ')
      console.log(listBhs())
      if (args.length < 0) throw `*_Contoh:*_ ${usedPrefix + command} id Ohayou`
     if (args && !listBhs().includes(args[0].toLowerCase()))throw `Kode bahasa salah!`
      try {
        let result = await translatte(text, {to: args[0].toLowerCase()})
        m.reply(result.text)
      }catch(err){
        
        throw err
      }
      break
    case 'kodebhs':
      m.reply(listBhs('kode').trim())
      break
    
  }
}



handler.command = /^(translate|kodebhs)$/i
handler.tags = ['tools']
handler.help = ['translate <lang> <teks>', 'kodebhs <negara>']
handler.exp = 5
handler.group = true

module.exports = handler





function listBhs(kode) {
  if (!kode) return [
  'sq',    'ar',    'hy',     'ca',    'zh',
  'zh-cn', 'zh-tw', 'zh-yue', 'hr',    'cs',
  'da',    'nl',    'en',     'en-au', 'en-uk',
  'en-us', 'eo',    'fi',     'fr',    'de',
  'el',    'ht',    'hi',     'hu',    'is',
  'id',    'it',    'ja',     'ko',    'la',
  'lv',    'mk',    'no',     'pl',    'pt',
  'pt-br', 'ro',    'ru',     'sr',    'sk',
  'es',    'es-es', 'es-us',  'sw',    'sv',
  'ta',    'th',    'tr',     'vi',    'cy'
]
else return `
List kode Bahasa

  Code       Bahasa
    sq        Albanian
    ar        Arabic
    hy        Armenian
    ca        Catalan
    zh        Chinese
    zh-cn     Chinese (China)
    zh-tw     Chinese (Taiwan)
    zh-yue    Chinese (Cantonese)
    hr        Croatian
    cs        Czech
    da        Danish
    nl        Dutch
    en        English
    en-au     English (Australia)
    en-uk     English (United Kingdom)
    en-us     English (United States)
    eo        Esperanto
    fi        Finnish
    fr        French
    de        German
    el        Greek
    ht        Haitian Creole
    hi        Hindi
    hu        Hungarian
    is        Icelandic
    id        Indonesian
    it        Italian
    ja        Japanese
    ko        Korean
    la        Latin
    lv        Latvian
    mk        Macedonian
    no        Norwegian
    pl        Polish
    pt        Portuguese
    pt-br     Portuguese (Brazil)
    ro        Romanian
    ru        Russian
    sr        Serbian
    sk        Slovak
    es        Spanish
    es-es     Spanish (Spain)
    es-us     Spanish (United States)
    sw        Swahili
    sv        Swedish
    ta        Tamil
    th        Thai
    tr        Turkish
    vi        Vietnamese
    cy        Welsh`
}

