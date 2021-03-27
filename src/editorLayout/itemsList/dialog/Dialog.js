import { Col, Button, Popover } from 'antd';
import box from '../../../assets/p5s-box.png';
import { formatString } from '../../../util/util';
import { useState, useCallback } from 'react';
import { useFile } from '../../../contexts/CurrentFileContext';
import './Dialog.css';
import { InfoOutlined } from '@ant-design/icons';

function Dialog({ index }) {
    
    const file = useFile();
    const [text, setText] = useState(file.file().data[index].text)
    const [propVisibilty, setVisibility] = useState(false);
    return <Col span={24} className="editor-col">
        <div className="box-wrapper" >
            <Button className="tooltip-icon" shape="circle" type="primary" icon={<InfoOutlined />}/>
            <img src={box} alt="box" className="box" />
            <textarea name="editorbox" rows={3} value={formatString(text)} onChange={useCallback((event) => {

                setText(event.target.value);
                const fileData = file.file();
                const msgDataCopy = [...fileData.data];
                msgDataCopy[index].text = event.target.value;
                fileData.data = msgDataCopy;
                file.addFile(fileData, () => { })
            }, [file, index])} />
        </div>
    </Col>
}
export default Dialog;