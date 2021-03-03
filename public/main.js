const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const fs = require('fs')
const readFile = require('./reader');
const writeFile = require('./writer');
let win;
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Open file...",
                accelerator: "Ctrl+O",
                click() {
                    win.webContents.send("invoke-open", {})
                }
            },
            {
                label: "Open Project",
                click() {
                    win.webContents.send("invoke-open-project", {})
                }
            },
            { 
                label: "Save Project",
                accelerator: "Ctrl+S",
                click() {
                    console.log("Saving...");
                    win.webContents.send('invoke-save', {})
                }
            },
            {
                label: "Export Project",
                accelerator: "Ctrl+E",
                click() {
                    console.log("Exporting...")
                    win.webContents.send("invoke-export", {})
                }
            },
            {
                label: "Quit",
                accelerator: "Alt+F4",
                click() {
                    app.quit();
                }
            }
        ]
    }
]

function saveDataCallback(event, data) {
    const filePath = dialog.showSaveDialogSync(win, {
        title: "Save Project",
        defaultPath: `${data.fileName.substring(0,data.fileName.indexOf("."))}.json`,
        filters: [
            {   
                name: "P5S Text Editor Project",
                extensions: ['json']
            }
        ]
    });
    if (filePath !== undefined) saveProject(filePath, data);
}

async function openProject(event, data) {
    const [filePath] = dialog.showOpenDialogSync(win, {
        title: "Open P5S text project file",
        filters: [
            {   
                name: "Persona 5 Strikers project file",
                extensions: ["json"]
            }
        ],
        properties: ["openFile"]
    });
    if (filePath !== undefined) {
        const rawData = fs.readFileSync(filePath);
        event.reply("opened-file-data", JSON.parse(rawData));
    }
}

async function exportFile(event, data) {
    const filePath = dialog.showSaveDialogSync(win, {
        title: "Export file",
        defaultPath: data.fileName,
        filters: [
            {   
                name: "Persona 5 Strikers text data",
                extensions: ["evd", "tfd", "bin"]
            }
        ]
    });
    if (filePath !== undefined) {
        try {
            writeFile(filePath, data);

        }catch(error) {
            console.error(error);
            dialog.showErrorBox("Error", "An error ocurred while exporting the file");
        }
    }
}

async function openFile(event, data) {
    const [filePath] = dialog.showOpenDialogSync(win, {
        title: "Open P5S text file",
        filters: [
            {   
                name: "Persona 5 Strikers text data",
                extensions: ["evd", "tfd", "bin"]
            }
        ],
        properties: ["openFile"]
    });
    if (filePath !== undefined) {
        try {
            const fileData = await readFile(filePath);
            event.reply("opened-file-data", fileData);
        }catch(error) {
            console.error(error);
            dialog.showErrorBox("Error", "An error ocurred while opening the file");
        }
    }
    
    
}

function saveProject(filePath, jsonData) {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4), "utf-8");
}

function createWindow() {
    const menu = Menu.buildFromTemplate(menuTemplate);
    win = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}});
    win.loadURL('http://localhost:3000/')
    Menu.setApplicationMenu(menu)
    ipcMain.on("save-data", saveDataCallback);
    ipcMain.on("open-file", openFile);
    ipcMain.on("open-project", openProject)
    ipcMain.on("export-file", exportFile);
}

app.on("ready", createWindow);