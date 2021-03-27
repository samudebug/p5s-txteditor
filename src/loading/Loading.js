import { Layout, Spin, Row, Col } from 'antd';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useFile } from '../contexts/CurrentFileContext'
import { LoadingOutlined } from '@ant-design/icons'
const { Content} = Layout;
const electron = window.require("electron");

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin />;

function Loading(props) {
    const history = useHistory();
    const fileContext = useFile();
    useEffect(() => {
        electron.ipcRenderer.send("hide-menu", {});
        electron.ipcRenderer.on("opened-file-data", (event, data) => {
            fileContext.addFile(data, () => {
                history.replace({pathname: "/edit"})
            });
            
        })
    })

    return (
        <Content>
            <Row justify="center" align="middle" style={{ height: '100%' }}>
                    <Col span={12} className="content-col">
                        
                            <Spin indicator={antIcon} />
                            <h3>Loading File</h3>
                    </Col>
                </Row>
        </Content>
    );
}

export default Loading;