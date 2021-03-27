const fs = require("fs");
const fsPromises = fs.promises;
const jsPack = require("jspack");
const path = require("path");



async function getStringLength(file, strOffset) {
    let strLen = 0;
    let startOffset = strOffset;
    let strTest = Buffer.alloc(1);
    while (true) {
        await file.read(strTest, 0, 1, startOffset)
        if (strTest[0] === 0x0) break;
        else {
            strLen += 1;
            startOffset += 1;
        }
    }
    strLen += 1;
    return strLen;
}

function hasPointer(offset, fileData, startOffset) {
    return fileData.some((data) => data === (offset - startOffset));
}

async function readFile(filePath) {
    const resultJson = {
        fileName: path.basename(filePath),
        bSize: 0,
        bCount: 0,
        data: [],
        paddingSize: 0,
        dataTable: []
    }
    const file = await fsPromises.open(filePath, "r");
    const isMsgBuff = Buffer.alloc(12);
    await file.read(isMsgBuff, 0, 12, 0);
    let [fileMagic, bCount, bSize] = jsPack.jspack.Unpack("<3I", isMsgBuff, 0);
    const MAGIC = 0x16121900;
    if (fileMagic !== MAGIC) {
        throw { message: "Not msg file" };
    }
    resultJson.bCount = bCount;
    resultJson.bSize = bSize;
    const ptrfmt = `<${Math.floor(bSize * bCount/4)}I`
    const dataTableBuff = Buffer.alloc(bSize * bCount);
    await file.read(dataTableBuff, 0, bCount * bSize, 0x40);
    const dataTableInfo = jsPack.jspack.Unpack(ptrfmt, dataTableBuff);
    resultJson.dataTable = dataTableInfo;
    const stringStartOffset = 0x40 + bCount * bSize;
    let strOffset = stringStartOffset;
    let stringBlockSize = (await file.stat()).size - stringStartOffset;
    while (stringBlockSize > 0) {
        const hasPointerVar = hasPointer(strOffset, dataTableInfo, stringStartOffset)
        const stringLength = await getStringLength(file, strOffset);
        const strBuff = Buffer.alloc(stringLength);
        await file.read(strBuff, 0, stringLength, strOffset);
        const parsedStr = strBuff.toString("utf-8").replace("\x00", "").replace("\x1b", "[1b]").replace("\x0a", "[0a]");
        const data = {
            text: parsedStr,
            pointerIndex: 0
        }
        if (hasPointerVar) {
            data.pointerIndex = dataTableInfo.indexOf(strOffset - stringStartOffset);
        } else {
            resultJson.paddingSize += stringLength;
        }
        resultJson.data.push(data);
        strOffset += stringLength;
        stringBlockSize -= stringLength;
    }

    file.close();
    // fs.writeFileSync("C:\\Users\\samue\\Documents\\msgjson\\CAllTextGoalFixData[0].json", JSON.stringify(resultJson, null, 4));
    return resultJson;
}

module.exports = readFile;