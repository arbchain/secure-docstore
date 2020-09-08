const assert = require('assert')
const encrypt = require('../src/index.js')
const fs = require('fs')

let cipherKey, publicKey, encryptedKey, decryptedKey, encryptedData
let privateKey = "d6d3710c0f16fafcfce5d4e1de712b875dd9e6eab4e05e0519ade677fe73a319"
let filePath = "./test/file.txt"

it('should get public key', function () {
    publicKey = encrypt.getPublicKey(privateKey)
    assert(publicKey!=null)
});

describe("Test for encrypting file and key",  () => {

    it('should generate symmetric key', function () {
        cipherKey = encrypt.generateCipherKey("password")
        assert(cipherKey!=null);
    });

    it('should encrypt file', async () => {
        const data = await fs.readFileSync(filePath)
        encryptedData = await encrypt.encryptFile(data,cipherKey)
        assert(encryptedData!=null)
    })

    it('should encrypt symmetric key', async () =>{
        encryptedKey = await encrypt.encryptKey(publicKey,cipherKey)
        assert(encryptedKey!=null)
    });

})

describe("Test for decrypting file and key",  () => {

    it('should decrypt symmetric key', async ()=>{
        decryptedKey = await encrypt.decryptKey(privateKey,encryptedKey)
        assert(decryptedKey!=null)
    });

    it('should decrypt file',  async () => {
        const status = await encrypt.decryptFile(encryptedData,cipherKey)
        assert(status!=null)
    });

})
