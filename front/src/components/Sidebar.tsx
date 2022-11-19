import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import './Sidebar.css'
const Sidebar = () => {
  const user = useSelector(
    (state: { user: { newMessages: any; _id: string } }) => state.user
  );
  console.log(user);
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
  const joinRoom = (room: any, isPublic = true) => {
    if (!user) {
      return alert("로그인이 필요한 서비스입니다.");
    }
    socket.emit("join-room", room);
    setCurrentRoom(room);
    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    //dispatch for notifications
  };
  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload: any) => {
    setMembers(payload);
  });
  function orderIds(id1: string, id2: string) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }
  function handlePrivateMemberMsg(member: { _id: string }) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }
  const getRooms = () => {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };
  if (!user) {
    return <></>;
  }
  return (
    <>
      <h2>Availble Romms</h2>
      <ListGroup>
        {rooms.map((room: string, idx: number) => (
          <ListGroup.Item
            key={idx}
            onClick={() => joinRoom(room)}
            active={room == currentRoom}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {room}{" "}
            {currentRoom !== room && (
              <span className="badge rounded-pill bg-primary">
                {user.newMessages[room]}
              </span>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      {members.map(
        (member: {
          _id: string;
          name: string;
          picture: string;
          status: string;
        }) => (
          <ListGroup.Item
            key={member._id}
            style={{ cursor: "pointer" }}
            active={privateMemberMsg?._id == member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member._id === user._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img src={member.picture} className="member-status-img" />
                {member.status == "online" ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9}>
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status == "offline" && " (Offline)"}
              </Col>
              <Col xs={1}>
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            </Row>
            
          </ListGroup.Item>
        )
      )}
    </>
  );
};

export default Sidebar;
