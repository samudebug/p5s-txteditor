import { useRef } from 'react'
import readFile from '../fileReader/reader';
import {useHistory} from 'react-router-dom'
import { Layout, Row, Col } from 'antd';
import Button from '../button/Button'
import { FileOutlined } from '@ant-design/icons'
import './Home.css'
import {useFile} from '../contexts/CurrentFileContext';

const { Content} = Layout;
function Home() {
    const inpRef = useRef(null);
    const history = useHistory();
    const fileContext = useFile();
    const openFile = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const response = await readFile(file);
        fileContext.addFile(response.data, () => {
            console.log("a")
            history.replace({pathname: '/edit'})
        })
    }
    const click = () => {
        inpRef.current.click();
    }
    return (
        <Content className="content">
                <Row justify="center" align="middle" style={{ height: '100%' }}>
                    <Col span={12} className="content-col">
                        
                            <Button onClick={click}>
                                <FileOutlined className="icon-btn" />
                            </Button>
                            <h3>Select a file</h3>
                            <input type="file" hidden={true} ref={inpRef} onChange={openFile} />
                    </Col>
                </Row>
            </Content>
    );
}

export default Home;