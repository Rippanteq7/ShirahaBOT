const axios = require('axios').default;


const baseUrl = 'http://api-melodicxt.herokuapp.com';
const apiKey = 'administrator';


const pornHub = async(text1 = '', text2 = '') => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=pornhub&text1=${text1}&text2=${text2}&apiKey=${apiKey}`
  try {
    const response = (await axios.get(fullUrl)).data.result;
    return response;
  }catch(err) {
    throw err;
  }
}

const wolfGalaxy = async(text1 = '', text2 = '') => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=wolf_galaxy&text1=${text1}&text2=${text2}&apiKey=${apiKey}`
  try {
    const textPro = (await axios.get(fullUrl)).data.result;
    return textPro;
  }catch(err){
    throw err;
  }
}

const marvelText = async(text1 = '', text2 = '') => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=marvel_studio&text1=${text1}&text2=${text2}&apiKey=${apiKey}`
  try {
    const textPro = (await axios.get(fullUrl)).data.result;
    return textPro;
  }catch(err){
    throw err;
  }
};


const blackPink = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=black_pink&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}


const skyText = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=sky_online&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}


const sandText = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=sand_engraved&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}

const greenNeon = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=green_neon&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}


const thunder = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=thunder&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}

const joker = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=joker&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}


const metalDark = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=metal_dark_gold&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}


const dropWater = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=dropwater&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}

const blueMetal = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=blue_metal&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}

const matrix = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=matrix&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}

const advanceGlow = async(text) => {
  let fullUrl = `${baseUrl}/api/txtcustom?theme=advanced_glow&text=${text}&apiKey=${apiKey}`;
  try {
    const response = (await axios.get(fullUrl)).data.result
    return response
  }catch(err) {
    throw err;
  }
}


module.exports = {
  pornHub,
  wolfGalaxy,
  marvelText,
  blackPink,
  skyText,
  sandText,
  greenNeon,
  thunder,
  joker,
  metalDark,
  dropWater,
  blueMetal,
  matrix,
  advanceGlow,
}





