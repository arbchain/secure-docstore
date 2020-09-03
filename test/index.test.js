const assert = require('assert')
const encrypt = require('../src/index.js')
const path = require('path')

let cipherKey, publicKey, encryptedKey, decryptedKey, encryptedData
let privateKey = "d6d3710c0f16fafcfce5d4e1de712b875dd9e6eab4e05e0519ade677fe73a319"

const fileInput = "This code does exactly what the code in the first section does, except that we have to " +
    "\"collect\" chunks of data before printing it out to the console. If your file is fairly small then you'll " +
    "probably only ever receive a single chunk, but for larger files, like audio and video, you'll have to collect " +
    "multiple chunks. This is the case where you'll start to notice the real value of streaming files.\n" +
    "\n" +
    "Note that the example I showed above mostly defeats the purpose of using a stream since we end up collecting " +
    "the data in a buffer (variable) anyway, but at least it gives you an idea as to how they work. A better example " +
    "showing the strengths of file streams can be seen here, in an Express route that handles a file request:"


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
        encryptedData = await encrypt.encryptFile(fileInput,cipherKey)
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
        console.log("decryptFile:",status.toString())
        //assert.strictEqual(true,status)
    });

})
