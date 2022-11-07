import React from "react";
import { Nav, Navbar, NavDropdown, Container, Button } from "react-bootstrap";
import {useLogoutUserMutation} from '../services/appApi'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
const Navigation = () => {
  const navigate = useNavigate();
  const user = useSelector((state: {user:{name:string,picture:string}}) => state.user);
  const [logoutUser]= useLogoutUserMutation();
  const handleLogout=async(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    await logoutUser(user);
    window.location.replace('/')

  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={logo} style={{ width: 50, height: 50 }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <Nav.Link
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Nav.Link>
            )}

            <Nav.Link
              onClick={() => {
                navigate("/chat");
              }}
            >
              Chat
            </Nav.Link>
            {user && (
              <NavDropdown title={
                <>
                <img src={user.picture} style={{width:30, height: 30, marginRight: 10, objectFit: 'cover', borderRadius: '50%'}}/>
                {user.name}
                </>
              } id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  <Button variant="danger" onClick={handleLogout}>Logout</Button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
