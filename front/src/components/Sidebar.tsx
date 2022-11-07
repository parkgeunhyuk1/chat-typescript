import React, { useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";

const Sidebar = () => {
  const user = useSelector((state: {user:{}}) => state.user);
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    setPrivateMemberMsg,
    rooms,
    currentRoom,
  } = useContext(AppContext);

  useEffect(()=>{
    if(user){
      setCurrentRoom('general');
      getRooms();
      socket.emit('join-room','general');
      socket.emit('new-user');
    }
  },[])

  socket.off("new-user").on("new-user", (payload: any) => {
    setMembers(payload);
  });
  
  const getRooms = () => {
    fetch("http://localhost:5001/rooms").then((res) => res.json())
    .then((data)=>setRooms(data));
  };
  if (!user) {
    return <></>;
  }
  return (
    <>
      <h2>Availble Romms</h2>
      <ListGroup>
        {rooms.map((room: string, idx: number) => (
          <ListGroup.Item key={idx}>{room}</ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map((member: {id:string,name:string}) => (
        <ListGroup.Item key={member.id} style={{ cursor: "pointer" }}>
          {member.name}
        </ListGroup.Item>
      ))}
    </>
  );
};

export default Sidebar;
