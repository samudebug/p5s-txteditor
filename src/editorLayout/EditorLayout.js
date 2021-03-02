import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import ItemsList from './itemsList/ItemsList'
import { useFile } from '../contexts/CurrentFileContext'
import './EditorLayout.css'
const electron = window.require("electron");

const { Content } = Layout;
function EditorLayout() {

    const fileContext = useFile();
    let [data] = useState(fileContext.file)
    let [msgData] = useState(data.data);
    let [strs, setStrs] = useState([])

    useEffect(() => {
        if (strs.length === 0) {
            setStrs(msgData.map((msg) => {
                return msg.text;
            }));
        }
        electron.ipcRenderer.on('invoke-save', (data) => {
            
            electron.ipcRenderer.send("save-data", fileContext.file);
          });
        return () => {
            electron.ipcRenderer.removeAllListeners();
        }
    }, [strs, msgData, fileContext])

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