import nameBox from '../../../../assets/Name.png';
import {formatString} from '../../../../util/util';
import {useState, useCallback} from 'react'

function Name(props) {
    const [text, setText] = useState('')
    return (
        <div className="name-wrapper" >
        <img src={nameBox} alt="name" className="name" />
        <textarea name="editorname" rows={1} value={formatString(text)} onChange={useCallback((event) => {
            
            setText(event.target.value);
        },[])} />
    </div>
    );
}

export default Name;