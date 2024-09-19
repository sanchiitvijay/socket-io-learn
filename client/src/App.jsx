import React, { useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'

const App = () => {

  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // socket.emit("message", message);
    socket.emit("message",{ message, room });
    setMessage("");
    setRoom("");
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected to server", socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    })

    return () => {
      socket.disconnect();
    }
  } , []);
  return (
    <div>
      <h1>Welcome to socket io</h1>
      <h2>Socket Id: {socketId}</h2>

      <h3>room name join</h3>
      <form onSubmit={joinRoomHandler}>
        <input type="text" value={roomName} onChange={(e)=>setRoomName(e.target.value)} /><br/>
        <button>Send</button>
      </form>


      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} /><br/>
        <input type="text" value={room} onChange={(e)=>setRoom(e.target.value)} /><br/>
        <button>Send</button>
      </form>

      {
        messages.map((msg, index) => (
          <div key={index}> {msg} </div> 
        ))
      }
    </div>
  )
}

export default App