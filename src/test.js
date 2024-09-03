const { encrypt, decrypt } = require('./utils/encrypt_decrypt');

const testText = "66d573ad39075bf60f49cae9";
const encrypted = encrypt(testText);
console.log("Encrypted text:", encrypted);

const decrypted = decrypt(encrypted);
console.log("Decrypted text:", decrypted);
