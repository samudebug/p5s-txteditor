const fs = require("fs");
const fsPromises = fs.promises;
const jsPack = require("jspack");

async function readFile(filePath) {
    const resultJson = {
        bSize: 0,
        bCount: 0,
        isGrouped: false,
        data: []
    }
    const file = await fsPromises.open(filePath, "r");
    const isMsgBuff = Buffer.alloc(12);
    await file.read(isMsgBuff, 0, 12, 0);
    // await file.read({
    //     buffer: isMsgBuff,
    //     length: 12,
    //     position: 0
    // });
    const [fileMagic, bCount, bSize] = jsPack.jspack.Unpack("<3I", isMsgBuff, 0);
    const MAGIC = 0x16121900;
    const isGroupedBuff = Buffer.alloc(4);
    const readPosition = 0x40 + (bSize - 4);
    await file.read(isGroupedBuff, 0, 4, readPosition)
    // await file.read({
    //     buffer: isGroupedBuff,
    //     length: 4,
    //     position: readPosition
    // });
    const [isGroupedNum] = jsPack.jspack.Unpack("<I", isGroupedBuff, 0);
    const isGrouped = isGroupedNum == 0;
    console.log(isGrouped);
    resultJson.isGrouped = isGrouped;
    resultJson.bCount = bCount;
    resultJson.bSize = bSize;
    const stringStartOffset = 0x40 + bCount * bSize;
    const ptrs = [];
    const ptrfmt = isGrouped ? `<${Math.floor(bSize/4)}I` : `<I${Math.floor((bSize - 4) / 2)}H`;

    for (let i = 0; i < bCount; i++) {
        const ptrBuff = Buffer.alloc(bSize);
        await file.read(ptrBuff, 0, bSize, 0x40 + (bSize * i))
        // await file.read({
        //     buffer: ptrBuff,
        //     length: bSize,
        //     position: 0x40 + (bSize * i)
        // });
        ptrs.push(jsPack.jspack.Unpack(ptrfmt, ptrBuff, 0));
    }

    for (let i = 0; i < ptrs.length; i++) {
        const ptr = ptrs[i];
        const stringOffset = stringStartOffset + ptr[0];
        let stringLenght = 0;
        if (i+1 !== ptrs.length) {
            stringLenght = ptrs[i+1][0] - ptr[0];
            const data = {
                msgIndex: 0,
                text: ""
            }
            if (!isGrouped) {
                if (ptr.length == 7) {
                    data.msgIndex = ptr[1] == 65535 ? -1: ptr[1];
                    data.bustupMajor = ptr[2] == 65535 ? -1: ptr[2];
                    data.bustupMinor = ptr[3] == 65535 ? -1: ptr[3];
                    data.unknown = ptr[4] == 65535 ? -1: ptr[4];
                    data.voiceIndex = ptr[5] == 65535 ? -1: ptr[5];
                    data.isNextChoice = ptr[6] == 1;
                }
            } else  {
                data.msgIndex =  ptr[1] == 65535 ? -1: ptr[1];
            }
            const stringBuff = Buffer.alloc(stringLenght);
            await file.read(stringBuff, 0, stringLenght, stringOffset);
            // await file.read({
            //     buffer: stringBuff,
            //     length: stringLenght,
            //     position: stringOffset
            // });
            let str = stringBuff.toString("utf8");
            str = str.replace("\0", "").replace("\x0a", "[0a]").replace("\x1b", "[1b]")
            data.text = str;
            resultJson.data.push(data);
        }
        
        
    }
    file.close();
    return resultJson
}


module.exports = readFile;