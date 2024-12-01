import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'






function App() {
  const [messages, setMessages] = useState<string[]>(["Hi there"])
  const wsRef = useRef<WebSocket | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080");
    wsRef.current.onmessage = (event) => {
      setMessages((m) => [...m, event.data])
    }
    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      })) 
    }

    // Cleanup function for the websocket connection when the component unmounts
    return () => {
      wsRef.current?.close();
    }
  }, []);


  function handleSendMessage (){
    const message = inputRef.current?.value;
    wsRef.current?.send(JSON.stringify({
      type : "chat",
      payload: {
        message: message
      }
    }))
    inputRef.current!.value = "";
  }


  return (
      <div className="h-screen bg-black">
        <br /> <br /> <br />
        <div className="h-[95vh]">
          {messages.map((m, index) => (
            <div key={index} className="m-6 mb-2 mt-10">
              <span className="text-black bg-white p-4 rounded-md">
                {m}
              </span>
            </div>
          ))}
        </div>
        
        <div className="bg-white w-full flex">
          <input 
            ref={inputRef} 
            className="flex-1 w-full p-4" 
          />
          <button onClick={handleSendMessage} className="bg-purple-600 text-white p-4">Send Message</button>
        </div>
      </div>
  )
}

export default App
