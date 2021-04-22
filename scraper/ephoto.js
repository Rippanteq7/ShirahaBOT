const fetch = require('node-fetch');
const cookie = require('cookie')
const FormData = require('form-data')
const cheerio = require('cheerio')





async function post(url, formdata = {}, cookies) {
  let encode = encodeURIComponent;
  let body = Object.keys(formdata)
    .map((key) => {
      let vals = formdata[key];
      let isArray = Array.isArray(vals);
      let keys = encode(key + (isArray ? "[]" : ""));
      if (!isArray) vals = [vals];
      let out = [];
      for (let valq of vals) out.push(keys + "=" + encode(valq));
      return out.join("&");
    })
    .join("&");
  return await fetch(`${url}?${body}`, {
    method: "GET",
    headers: {
      Accept: "/",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: cookies,
    },
  });
}

async function ephoto(url, text = '') {
  if (!/^https:\/\/en\.ephoto360\.com\/.+\.html$/.test(url))
    throw new Error("Wrong url!!");
  const geturl = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "GoogleBot",
    },
  });
  const caritoken = await geturl.text();
  let hasilcookie = geturl.headers
    .get("set-cookie")
    .split(",")
    .map((v) => cookie.parse(v))
    .reduce((a, c) => {
      return { ...a, ...c };
    }, {});
  hasilcookie = {
    _cfduid: hasilcookie._cfduid,
    PHPSESSID: hasilcookie.PHPSESSID,
  };
  hasilcookie = Object.entries(hasilcookie)
    .map(([name, value]) => cookie.serialize(name, value))
    .join("; ");

  const $ = cheerio.load(caritoken);
  const token = $('input[name="token"]').attr("value");
  console.log(token)
  const form = new FormData();
  if (typeof text !== "array") text = [text];
  for (let texts of text) form.append("text[]", texts);
  form.append("submit", "GO");
  form.append("token", token);
  form.append("build_server", "https://e2.yotools.net");
  form.append("build_server_id", 6);
  const geturl2 = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "/",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: hasilcookie,
      ...form.getHeaders(),
    },
    body: form.getBuffer(),
  });
  const caritoken2 = await geturl2.text();
//   return require('fs').writeFileSync('anu.html', caritoken2)
//   reply(require('util').format(caritoken2))
  let soup = cheerio.load(caritoken2)
  let token2 = soup('#form_value_input').attr('value')
//   return token2
  if (!token2) throw new Error("Token Tidak Ditemukan!!");
  const prosesimage = await post(
    "https://en.ephoto360.com/effect/create-image",
    JSON.parse(token2),
    hasilcookie
  );
  const hasil = await prosesimage.json();
  console.log(hasil)
  return `https://e2.yotools.net${hasil.image}`;
}


module.exports = {
    post,
    ephoto
}