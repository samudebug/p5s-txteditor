import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import ItemsList from './itemsList/ItemsList'
import { useFile } from '../contexts/CurrentFileContext'
import { useHistory } from 'react-router-dom'
import './EditorLayout.css'
const electron = window.require("electron");

const { Content } = Layout;
function EditorLayout() {

    const fileContext = useFile();
    let [data] = useState(fileContext.file())
    let [msgData] = useState(data.data);
    let [strs, setStrs] = useState([])
    const history = useHistory();

    useEffect(() => {
        if (strs.length === 0) {
            setStrs(msgData.map((msg) => {
                return msg.text;
            }));
        }
        // electron.ipcRenderer.on("invoke-open", (event, data) => {
        //     electron.ipcRenderer.send("open-file", {});
        // })

        electron.ipcRenderer.send("has-rendered", {});
        
        electron.ipcRenderer.on("invoke-export", (event, data) => {
            electron.ipcRenderer.send("export-file", fileContext.file());
        })
        electron.ipcRenderer.on('invoke-save', (data) => {
            
            electron.ipcRenderer.send("save-data", fileContext.file());
        });
        electron.ipcRenderer.on("opened-file-data", (event, data) => {
            fileContext.addFile(data, () => {
                history.go(0)
            })
        })
        electron.ipcRenderer.on("invoke-open-project", (event, data) => {
            electron.ipcRenderer.send("open-project", {});
        })

        electron.ipcRenderer.on("invoke-open", (event, data) => {
            electron.ipcRenderer.send("open-file", {});
        })
        return () => {
            electron.ipcRenderer.removeAllListeners();
        }
    }, [strs, msgData, fileContext, history])

    const itemCount = strs.length;
    return (
        <div>
            {strs.length === 0 ? <div></div> : <Content className="editor-wrapper">
        <ItemsList itemCount={itemCount} items={strs} />
    </Content>}
        </div>
    );
}

export default EditorLayout;