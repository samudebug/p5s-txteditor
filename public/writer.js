const fs = require("fs");
const fsPromises = fs.promises;
const jsPack = require("jspack");

async function writeFile(filePath, jsonData) {
    const MAGIC = 0x16121900;

    const strs = new Array(jsonData.bCount);
    const isGrouped = jsonData.isGrouped;
    let stringOffset = 0;
    let ptrfmt;
    let ptrs = [];

    if (isGrouped) {
        const pergrp = Math.floor((jsonData.bSize - 4) / 4);
        for (let i = 0; i < pergrp; i++) {
            for (let j = 0; j < jsonData.bCount; j++) {
                const parsedString = Buffer.from(jsonData.data[j].text.replace("[0a]", "\x0a").replace("[1b]", "\x1b") + "\0", "utf-8")
                strs[i * jsonData.bCount + j] = parsedString;
                ptrs.push([stringOffset, j]);
                stringOffset += parsedString.length;
            }
        }
        
    }
    ptrfmt = `<${Math.floor(jsonData.bSize/4)}I`;
    const outputFile = await fsPromises.open(filePath, "w");
    const startBuffer = Buffer.from(jsPack.jspack.Pack("<3I", [MAGIC, jsonData.bCount, jsonData.bSize]))
    await outputFile.write(startBuffer, 0, startBuffer.length, 0);
    
    let ptrStart = 0x40;
    for (let i=0; i<jsonData.bCount; i++) {
        const writeBuffer = Buffer.from(jsPack.jspack.Pack(ptrfmt, ptrs[i]))
        await outputFile.write(writeBuffer, 0, writeBuffer.length, ptrStart);
        ptrStart += writeBuffer.length;
    }
    for (let i=0; i<strs.length; i++) {
        await outputFile.write(strs[i], 0, undefined, ptrStart);
        ptrStart += strs[i].length;
    }
    outputFile.close();
}
module.exports =  writeFile;