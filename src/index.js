const crypto = require('crypto')
const eccrypto = require("eccrypto");

/**
 * Encrypts the file
 * @param file:  File data
 * @param cipherKey: {Buffer} Symmetric Key
 * @returns {Promise<unknown>}
 */
const encryptFile = function (file,cipherKey) {
    try {
        return new Promise((resolve)=>{
            let iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes256', cipherKey, iv);
            const encryptedData= Buffer.concat([
                iv,
                cipher.update(Buffer.from(file.toString())),
                cipher.final()
            ]);
            resolve(encryptedData)
        })
    }catch (err) {
        console.error("Error while encrypting file",err)
        return null
    }
}

/**
 * Decrypts the file
 * @param encryptedData: {Buffer}
 * @param cipherKey: {Buffer} Symmetric Key
 * @returns {Promise|boolean}
 */
const decryptFile = function(encryptedData,cipherKey){
    try {
        const iv = encryptedData.slice(0,16)
        encryptedData = encryptedData.slice(16)
        return new Promise((resolve)=>{
            const decipher = crypto.createDecipheriv("aes256",cipherKey,iv)
            const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
            resolve(decryptedData)
        })
    }catch (err) {
        console.error("Error while decrypting file:",err)
        return false
    }
}

/**
 * Encrypts Symmetric key used for encrypting file
 * @param publicKey: {Buffer}
 * @param cipherKey: {Buffer} Symmetric Key
 * @returns {Promise<unknown>|null}
 */
const encryptKey = function(publicKey,cipherKey){
    try {
        const iv = Buffer.alloc(16);
        iv.fill(5);
        const ephemPrivateKey = Buffer.alloc(32);
        ephemPrivateKey.fill(4);
        const encOpts = {ephemPrivateKey: ephemPrivateKey, iv: iv};
        return new Promise((resolve) => {
            eccrypto.encrypt(publicKey, cipherKey, encOpts).then(function (result) {
                resolve(result);
            })
        })
    }catch(err) {
        console.error("Error while encrypting key:",err)
        return null
    }

}

/**
 * Get public key from private key
 * @param privateKey: {String}
 * @returns {null|Buffer}
 */
const getPublicKey = function (privateKey){
    try {
        return eccrypto.getPublic(Buffer.from(privateKey, "hex"))
    }catch(err){
        console.error("Error while extracting public key:",err)
        return null;
    }
}

/**
 * Decrypts Symmetric key used for encrypting file
 * @param privateKey: {String}
 * @param encryptedKey: {Buffer}
 * @returns {Promise<unknown>|null}
 */
const decryptKey = function(privateKey,encryptedKey){
    try {
        return new Promise((resolve) => {
            eccrypto.decrypt(Buffer.from(privateKey, "hex"), encryptedKey)
                .then(function (decryptedKey) {
                    resolve(decryptedKey)
                });
        })
    }catch(err){
        console.error("Error while decrypting key:",err)
        return null
    }
}

/**
 * Create symmetric key for file encryption
 * @param password: {String}
 * @returns {null|Buffer}
 */
const generateCipherKey = function(password){
    try {
        return crypto.createHash('sha256').update(password).digest()
    }catch (err) {
        console.error("Error while generating symmetric key:",err)
        return null;
    }
}

module.exports = {
    encryptFile,
    decryptFile,
    generateCipherKey,
    encryptKey,
    decryptKey,
    getPublicKey
}
