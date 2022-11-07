import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import bot from "../assets/bot.jpeg";
import "./signup.css";
import {useSignupUserMutation} from '../services/appApi'
const SignUp = () => {
  const navigate = useNavigate();
  const validateImg = ( e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      const file=e.target.files[0]
      if(file.size>1048576){
        return alert('사진 최대용량은 1MB입니다.')
      } else{
        setImage(file);
        setImagePreview(URL.createObjectURL(file))
      }
    }
  };
  const uploadImage=async(image:Blob)=>{
    const data= new FormData();
    data.append('file', image);
    data.append('upload_preset', 'hpwvbbpo');
    try{
        setUploadingImg(true);
        let res= await fetch('https://api.cloudinary.com/v1_1/dydr9ytbq/image/upload',{
            method: 'post',
            body: data
        })
        const urlData= await res.json();
        setUploadingImg(false);
        return urlData.url
    }catch(error){
        setUploadingImg(false)
        console.log(error)
        //sginup

    }
}
  const handleSignup=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!image) return alert('이미지를 추가해주세요')
    const url= await uploadImage(image)
    console.log(url)
    signupUser({name,email,password,picture: url}).then((data)=>{
      if(data){
        console.log(data);
        navigate('/chat')
      }
    })
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupUser, {isLoading,error}]=useSignupUserMutation();
   const [image, setImage] = useState<any>();
  const [uploadingImg, setUploadingImg]=useState<boolean>(false);
  const [imagePreview, setImagePreview]=useState<any>(null);
  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Create Account</h1>
            <div className="signup-profile-pic__container">
              <img src={imagePreview || bot} className="signup-profile-pic" />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png,image/jpeg"
                onChange={validateImg}
              />
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {uploadingImg ? '회원가입중..': '회원가입' }
            </Button>
            <div
              
              className="py-4"
            >
              <p onClick={() => {
                navigate("/login");
              }} className="text-center">Already hava an account?</p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup-bg"></Col>
      </Row>
    </Container>
  );
};

export default SignUp;
