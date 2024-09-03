const CryptoJS = require("crypto-js");

// const encryptionKey = process.env.ENCRYPTION_KEY;

const encryptionKey = "e8b12d70aeb5e462e15f9ddf8b8f4846fd47b63d9d8e79c61f8a6bdbb4c5e9f1"

if (!encryptionKey) {
  throw new Error("ENCRYPTION_KEY is not defined");
}

// Encrypt function
function encrypt(text) {
  console.log("Encrypting text:", text);
  const encrypted = CryptoJS.AES.encrypt(text, encryptionKey).toString();
  console.log("Encrypted text:", encrypted);
  return encrypted;
}

// Decrypt function
function decrypt(ciphertext) {
  console.log("Decrypting ciphertext:", ciphertext);
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  console.log("Decrypted text:", decryptedText);

  if (!decryptedText) {
    throw new Error("Decryption failed or returned empty result");
  }

  return decryptedText;
}

module.exports = { encrypt, decrypt };
