import { useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import { Layout, Row, Col } from 'antd';
import Button from '../button/Button'
import { FileOutlined } from '@ant-design/icons'
import './Home.css'
import {useFile} from '../contexts/CurrentFileContext';
const electron = window.require("electron");

const { Content} = Layout;
function Home() {
    const history = useHistory();
    const fileContext = useFile();
    useEffect(() => {
        electron.ipcRenderer.on("invoke-open", (event, data) => {
            electron.ipcRenderer.send("open-file", {});
        })
        
        electron.ipcRenderer.on("invoke-open-project", (event, data) => {
            electron.ipcRenderer.send("open-project", {});
        })

        electron.ipcRenderer.on("opened-file-data", (event, data) => {
            openFile(data);
        })
        return () => {
            electron.ipcRenderer.removeAllListeners();
        }
    })
    const openFile = async (file) => {
        // const file = e.target.files[0];
        // if (!file) {
        //     return;
        // }
        // const response = await readFile(file);
        fileContext.addFile(file, () => {
            history.replace({pathname: '/edit'})
        })
    }
    const click = () => {
        // inpRef.current.click();
        electron.ipcRenderer.send("open-file", {});
        electron.ipcRenderer.on("opened-file-data", (event, data) => {
            openFile(data);
        })
    }
    return (
        <Content className="content">
                <Row justify="center" align="middle" style={{ height: '100%' }}>
                    <Col span={12} className="content-col">
                        
                            <Button onClick={click}>
                                <FileOutlined className="icon-btn" />
                            </Button>
                            <h3>Select a file</h3>
                            {/* <input type="file" hidden={true} ref={inpRef} onChange={openFile} /> */}
                    </Col>
                </Row>
            </Content>
    );
}

export default Home;