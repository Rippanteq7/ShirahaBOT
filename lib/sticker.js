const {
  spawn
} = require('child_process')
const fs = require('fs')
const path = require('path')

//"ios-app-store-link":
//"https://itunes.apple.com/app/sticker-maker-studio/id1443326857"


const stickerPackID = "com.snowcorp.stickerly.android.stickercontentprovider b5e7275f-f1de-4137-961f-57becfad34f2";
const googleLink = "https://play.google.com/store/apps/details?id=com.stickify.stickermaker";
const appleLink = "https://itunes.apple.com/app/sticker-maker-studio/id1443326857";

const createExif = (packname, author) => {
  return new Promise(async(resolve, reject) => {
  const json = {
    "sticker-pack-id": stickerPackID,
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
    "android-app-store-link": googleLink,
    "ios-app-store-link": appleLink
  };
  let length = JSON.stringify(json).length; 
  const f = Buffer.from([
  0x49, 0x49, 0x2A, 
  0x00, 0x08, 0x00,
  0x00, 0x00, 0x01, 
  0x00, 0x41, 0x57,
  0x07, 0x00
  ]); 
  const code = [
    0x00, 0x00, 0x16,
    0x00, 0x00, 0x00]; 
  if (length > 256) {
    length = length - 256;
    code.unshift(0x01);
  } else {
    code.unshift(0x00);
  }
  const fff = Buffer.from(code);
  const ffff = Buffer.from(JSON.stringify(json));
  if (length < 16) {
    length = length.toString(16); 
    length = "0" + length;
  } else {
    length = length.toString(16);
  } const ff = Buffer.from(length, "hex");
  const buffer = Buffer.concat([f, ff, fff, ffff]);
  let out = path.join(__dirname, '../tmp/' + (new Date() * 1) + '.exif')
  await fs.writeFileSync(out, buffer)
  resolve(out)
  })
}
exports.createExif = createExif

const modifExif = (buffer, exif) => { 
  return new Promise(async(resolve, reject) => {
    let tmp = path.join(__dirname, '../tmp/' + (new Date() * 1) + '.webp')
   await fs.writeFileSync(tmp, buffer)
    console.log(fs.readFileSync(tmp))
    spawn('webpmux', [ '-set', 'exif', exif, tmp, '-o', tmp])
    .on('exit', async() => { 
     await resolve(fs.readFileSync(tmp)) 
     fs.unlinkSync(exif)
     if (fs.existsSync(tmp))fs.unlinkSync(tmp)
    })
    .on('error', reject)
    .on('error', () => {
     if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    })
  })
}

exports.modifExif = modifExif