const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const fs = require('fs')
const readFile = require('./reader');
let win;
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Open file...",
                accelerator: "Ctrl+O",
                
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
                label: "Quit",
                accelerator: "Alt+F4",
                click() {
                    app.quit();
                }
            }
        ]
    }
]

function saveDataCallback() {
    const filePath = dialog.showSaveDialogSync(win, {
        title: "Save Project",
        defaultPath: "project.json",
        filters: [
            {   
                name: "project",
                extensions: ['json']
            }
        ]
    });
    saveProject(filePath, data);
}

async function openFile(event, data) {
    const [filePath] = dialog.showOpenDialogSync(win, {
        title: "Open P5S text file",
        filters: [
            {   
                name: "Persona 5 Strikers text data",
                extensions: ["evd", "ftd"]
            }
        ],
        properties: ["openFile"]
    });
    try {
        const fileData = await readFile(filePath);
        event.reply("opened-file-data", fileData);
    }catch(error) {
        console.error(error);
        dialog.showErrorBox("Error", "An error ocurred while opening the file");
    }
    
}

function saveProject(filePath, jsonData) {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4), "utf-8");
}

function createWindow() {
    const menu = Menu.buildFromTemplate(menuTemplate);
    win = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}});
    win.webContents.openDevTools({mode: 'detach'})
    win.loadURL('http://localhost:3000/')
    Menu.setApplicationMenu(menu)
    ipcMain.on("save-data", saveDataCallback);
    ipcMain.on("open-file", openFile);
}

app.on("ready", createWindow);