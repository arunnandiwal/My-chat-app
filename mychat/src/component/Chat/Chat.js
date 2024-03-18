import React, { useEffect, useState } from 'react'
import { user } from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import sendLogo from "../../images/pngwing.com.png";

let socket;

const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const [id, setid] = useState("")
  const [messages, setMessages] = useState([]);
  const send = () => {
    const message = document.getElementById('chatInput').value;
    socket.emit('message', { message, id });
    document.getElementById('chatInput').value = "";

  }
  useEffect(() => {

    socket = socketIO(ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
      alert("connected...");
      setid(socket.id);
    });

    socket.emit('joined', { user })

    socket.on('welcome', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    })
    socket.on('userJoined', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    })
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    }); socket.on('leave', (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.off('sendMessage');
      socket.off('leave');
    };
  }, [messages]);

  return (
    <div className='chatPage'>
      <div className="chatContainer">
        <div className="header">MY CHAT APP-BY ARUN</div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? '' : item.user}
              message={item.message}
              classs={item.id === id ? 'right' : 'left'}
            />
          ))}
        </ReactScrollToBottom>

        <div className="inputBox">
          <input onKeyPress={(event) => event.key === "Enter" ? send() : null} placeholder='chat with friends' type="text" id='chatInput' />
          <button className='sendbtn' onClick={send}><img src={sendLogo} alt="Send" /></button>
        </div>
      </div>
    </div>
  )
}

export default Chat