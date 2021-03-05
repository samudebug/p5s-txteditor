import { Row, Col } from 'antd';
import { useState, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import {useFile} from '../../contexts/CurrentFileContext'
import box from '../../assets/p5s-box.png';
function ItemsList(props) {
    const [strs] = useState(props.items);
    const file = useFile();
    const formatString = (str) => {
        return str.replace('[0a]', '\n');
    }

    const renderListItem = ({ index, style }) => {
        return (
            <Row className="editor-row" key={index} style={style}>
                <ListItem index={index} />
            </Row>
        );
    }
    const ListItem = (itemProps) => {
        const [text, setText] = useState(file.file().data[itemProps.index].text)
        return <Col span={24} className="editor-col">
                    <div className="box-wrapper" >
                        <img src={box} alt="box" className="box" />
                        <textarea name="editorbox"  value={formatString(text)} onChange={useCallback((event) => {
                            
                            setText(event.target.value);
                            const fileData = file.file();
                            const msgDataCopy = [...fileData.data];
                            msgDataCopy[itemProps.index].text = event.target.value;
                            fileData.data = msgDataCopy;
                            file.addFile(fileData, () => {})
                        },[itemProps])} />
                    </div>
                </Col>
    }
    return <List
        key="list"
            height={440}
            itemCount={props.itemCount}
            itemSize={300}
            width={780}
            
        >
            {renderListItem}
        </List>
}

export default ItemsList;