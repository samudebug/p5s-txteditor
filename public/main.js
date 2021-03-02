const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const fs = require('fs')
let win;
const menuTemplate = [
    {
        label: "File",
        submenu: [
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

function saveProject(filePath, jsonData) {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4), "utf-8");
}

function createWindow() {
    const menu = Menu.buildFromTemplate(menuTemplate);
    win = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}});
    win.webContents.openDevTools({mode: 'detach'})
    win.loadURL('http://localhost:3000/')
    Menu.setApplicationMenu(menu)
    ipcMain.on("save-data", (event, data) => {
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
    })
}

app.on("ready", createWindow);