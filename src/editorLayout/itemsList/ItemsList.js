import { Row } from 'antd';
import { FixedSizeList as List } from 'react-window';

import Dialog from './dialog/Dialog';
function ItemsList(props) {

    const renderListItem = ({ index, style }) => {
        return (
            <Row className="editor-row" key={index} style={style}>
                <Dialog index={index}/>
            </Row>
        );
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