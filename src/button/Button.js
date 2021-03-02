import './Button.css'
function Button(props) {
    return (
        <button className="rnd-btn" type="button" onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export default Button