const fs = require("fs");
const fsPromises = fs.promises;
const jsPack = require("jspack");

async function writeFile(filePath, jsonData) {
    const MAGIC = 0x16121900;

    const strs = [];
    const stringStartOffset = 0x40 + (jsonData.bCount * jsonData.bSize);
    let stringOffset = 0;
    // let ptrfmt = `<${Math.floor(jsonData.bSize / 4)}I`;
    // if (jsonData.bSize === 20 && jsonData.bCount === 200) {
    //     ptrfmt = "<2I";
    // }
    let ptrs = [];
    const dataTable = [...jsonData.dataTable];
    
    for (let i = 0; i<jsonData.data.length; i++) {
        const currentData = jsonData.data[i];
        const strBuffer = Buffer.from(currentData.text.replace("[0a]", "\x0a").replace("[1b]", "\x1b") + "\x00", "utf-8");
        strs.push(strBuffer)
        if (currentData.pointerIndex !== -1) {
            dataTable[currentData.pointerIndex] = stringOffset;
        }
        stringOffset += strBuffer.length;
    }
    
    
    const outputFile = await fsPromises.open(filePath, "w");
    const startBuffer = Buffer.from(jsPack.jspack.Pack("<3I", [MAGIC, jsonData.bCount, jsonData.bSize]))
    await outputFile.write(startBuffer, 0, startBuffer.length, 0);
    
    let ptrStart = 0x40;
    const ptrfmt = `<${Math.floor(jsonData.bSize * jsonData.bCount / 4)}I`;
    const dataTableBuff = Buffer.from(jsPack.jspack.Pack(ptrfmt, dataTable));
    await outputFile.write(dataTableBuff, 0, dataTableBuff.length, ptrStart)
    let stringStart = stringStartOffset;
    for (let i=0; i<strs.length; i++) {
        await outputFile.write(strs[i], 0, strs[i].length, stringStart);
        stringStart += strs[i].length;
    }

    if (jsonData.paddingSize > 0) {
        const paddBuff = Buffer.alloc(jsonData.paddingSize).fill(0);
        await outputFile.write(paddBuff, 0, paddBuff.length, ptrStart);
    }
    outputFile.close();
}

module.exports =  writeFile;