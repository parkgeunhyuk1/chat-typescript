import React, { useContext, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useLoginUserMutation } from '../services/appApi'
import { AppContext } from "../context/AppContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {socket} = useContext(AppContext)
  const navigate=useNavigate()
  const[loginUser, {isLoading, error}]=useLoginUserMutation()
  const handleLogin=(e:React.FormEvent)=>{
    e.preventDefault();
    loginUser({email, password}).then((data)=>{
      if(data){
        socket.emit('new-user')
        navigate('/chat')

      }
    })
  }
  return (
    <Container>
      <Row>
        <Col md={5} className="login-bg"></Col>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
            <div onClick={()=>{
              navigate('/signup')
            }} className="py-4">
              <p className="text-center">
                Don't have an account?
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
