import {Row, Col} from 'antd';
import logo from '../assets/logo.png';
import './Banner.css'

function Banner (props) {
    return (
        <Row justify="center" align="middle" className="banner-wrapper">
            <Col span={12} className="banner">
               <img src={logo} alt="logo"/>
               <h3> Event Message Editor</h3>
            </Col>
        </Row>
    );
}

export default Banner;