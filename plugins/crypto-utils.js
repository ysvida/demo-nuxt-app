import CryptoJS from 'crypto-js'

// const secretKey = 'mySecretKey01234'
// const base64Key = Buffer.from(secretKey).toString('base64')
// const decoded = Buffer.from(base64Key, 'base64').toString()

const genKey = function (inputKey) {
  let secretKey = inputKey || ''
  const keyLen = secretKey.length
  if (keyLen > 16) {
    secretKey = secretKey.substring(0, 16)
  } else if (keyLen < 16) {
    secretKey = secretKey.padEnd(16, '0')
  }
  const base64Key = Buffer.from(secretKey).toString('base64')
  return CryptoJS.enc.Base64.parse(base64Key)
}

const getIv = function () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charLen = characters.length
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charLen))
  }
  return result
}

const encryptForServer = function (str, inputKey, inputIv) {
  const key = genKey(inputKey)
  const base64IV = Buffer.from(inputIv).toString('base64')
  const iv = CryptoJS.enc.Base64.parse(base64IV)
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv
  })
  return encrypted.toString()
}

const decryptForServer = function (encStr, inputKey, inputIv) {
  const key = genKey(inputKey)
  const base64IV = Buffer.from(inputIv).toString('base64')
  const iv = CryptoJS.enc.Base64.parse(base64IV)
  const decrypted = CryptoJS.AES.decrypt(encStr, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export default ({ app }, inject) => {
  const crypto = {
    getIv,
    encryptForServer,
    decryptForServer
  }
  inject('crypto', crypto)
}
