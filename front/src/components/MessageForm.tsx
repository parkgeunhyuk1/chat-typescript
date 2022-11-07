import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/AppContext";
import "./MessageForm.css";
const MessageForm = () => {
  const {
    currentRoom,
    socket,
    setMessages,
    messages,
    privateMemberMsg,
    setPrivateMemberMsg,
  } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  };
  const user = useSelector((state: {user:[]}) => state.user);
  
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  };
  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages: {}) => {
    console.log("room messages", typeof roomMessages);
    setMessages(roomMessages);
  });
  console.log("이건?", typeof messages);
  return (
    <div>
      <div className="messages-output">
        {!user && (
          <div className="alert alert-danger">
            로그인이 필요한 서비스입니다.
          </div>
        )}
        
        {
          user&&
         
          messages.map((item:{_id:string,messagesByDate:{}},idx:number)=>{
            
            <div key={idx}>
              <p className="alert alert-info text-center message-date-indicato">{item._id}</p>
              </div>
          })
        }
        {/* {user &&
          messages?.map(
            (
              { _id, messagesByDate }: { _id: string; messagesByDate: any },
              idx: number
            ) => {
              <div key={idx}>
                <p className="alert alert-info text-center message-date-indicator">
                  {_id}
                </p>
                {messagesByDate?.map(
                  (
                    {
                      content,
                      time,
                      from,
                    }: { content: string; time: string; from: {} },
                    msgIdx: number
                  ) => (
                    <div className="message" key={msgIdx}>
                      <p>{content}</p>
                    </div>
                  )
                )}
              </div>;
            }
          )} */}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="메시지를 입력하세요"
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane" />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default MessageForm;
