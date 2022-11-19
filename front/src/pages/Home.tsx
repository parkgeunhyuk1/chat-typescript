import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './home.css'
const Home = () => {
  const navigate=useNavigate();
  return (
    <Row>
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div>
          <h1>Share the world with your frineds</h1>
          <p>Chat App lets you connect with the world</p>
          <Button onClick={()=>{
            navigate('/chat')
          }} variant="success">
            Get started<i className="fas fa-comments home-message-icon"></i>
          </Button>
        </div>
      </Col>
      <Col md={6} className='home-bg'>

      </Col>
    </Row>
  );
};

export default Home;
