import { io } from 'socket.io-client'
import './App.css'
import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react';


// now the first thing i need to do is that after this i need to see how many users are there in my room  

// now i just have to update the code to every where thats it then  

function App() {

const socket = io("https://share-io.onrender.com")

const [joined, setjoined] = useState(false)
const [roomId, setroomId] = useState("")
const [userName, setuserName] = useState("")
const [copied, setcopied] = useState(false)
const [code, setcode] = useState("// start coding here")
const [language, setlanguage] = useState("javascript")
const [users, setusers] = useState([])

useEffect(()=>{
  socket.on("userJoined",(user)=>{

    console.log("socket called")
    console.log(user)
    setusers(user)
  })

  socket.on("codeUpdate" ,code=>{
    console.log("codeupdating")
    setcode(code)
  })

},[socket])

const joinRoom = () =>{
  if(roomId && userName){
    socket.emit("join" , {roomId , userName})
    setjoined(true)
  }
}

const handleLanguageChange = () =>{
  // some logic
}

const handleCodeChange = (e) =>{
  console.log("sending the code ")
  setcode(e)
  socket.emit("codeChange" , {roomId, code:e})
}
// creating the thing that will happen after we leave or reload the thing  

useEffect(() => {
  const handleReload = () =>{
    socket.emit("leaveRoom")
    console.log("leaving the room")
  }
  window.addEventListener('beforeunload' , handleReload)

  return ()=>{
    window.removeEventListener("beforeunload" ,  handleReload)
  }
}, [])


// this line lets the frontend to connect with the server 

if(!joined){
  return (
    <>

<div class="flex items-center  h-screen p-4 bg-gray-100 lg:justify-center">
      <div
        class="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
      >
        <div
          class="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
        >
          <div class="my-3 text-4xl font-bold tracking-wider text-center">
            <a href="#">K-WD</a>
          </div>
          <p class="mt-6 font-normal text-center text-gray-300 md:mt-0">
            With the power of K-WD, you can now focus only on functionaries for your digital products, while leaving the
            UI design on us!
          </p>
          <p class="flex flex-col items-center justify-center mt-10 text-center">
            <span>Don't have an account?</span>
            <a href="#" class="underline">Get Started!</a>
          </p>
          <p class="mt-6 text-sm text-center text-gray-300">
            Read our <a href="#" class="underline">terms</a> and <a href="#" class="underline">conditions</a>
          </p>
        </div>
        <div class="p-5 bg-white md:flex-1">
          <h3 class="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
          <form action="#" class="flex flex-col space-y-5">
            <div class="flex flex-col space-y-1">
              <label for="email" class="text-sm font-semibold text-gray-500">room ID</label>
              <input
                type="number"
                autofocus
                value={roomId}
                onChange={(e)=>setroomId(e.target.value)}
                class="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </div>
            <div class="flex flex-col space-y-1">
              <div class="flex items-center justify-between">
                <label  class="text-sm  font-semibold text-gray-500">UserName</label>
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e)=>setuserName(e.target.value)}
                class="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </div>
         
            <div>
              <button
                type="submit"
                onClick={joinRoom}
                class="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
              >
                Join the room 
              </button>
            </div>
   
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

else{
  return (
    <>
    <div className='w-full h-screen flex '>
      {/* this is the sidebar */}
      <div className='w-[20%] bg-[#2B3E50] pt-10  h-full items-center flex flex-col gap-5 '>
        {/* this is the room id box  */}
              <div className='flex text-white w-full flex-col gap-2 items-center justify-center'>
                <h1 className='text-white font-bold capitalize text-2xl mb-1'>code room : 100 </h1>
                <button onClick={()=>setcopied(true)} className='px-4 py-2 text-sm rounded-lg bg-blue-400'>Copy Id</button>
                <p className='text-red-500'>{copied ? "Room Id Copied" : ""}</p>
              </div>
    {/* this is the persons in the room box */}

    <div className='flex text-white w-full flex-col gap-1 items-start pl-4 justify-center'>
    <h1 className='text-white font-bold capitalize text-xl mb-1'>Person in this room</h1>
    
{users.map((user,index)=>(

  <div className='w-[80%] rounded-lg bg-gray-500 px-5 py-2 '>
    <p>{user.slice(0,8)}...</p>
    </div>
      ))}
  
    </div>

    {/* this is the user typing box  */}

    <div>
      <h1>user is typing...</h1>
    </div>

    {/*this is the coding language selection box */}
    <div className='pl-4 w-full'>

    <select className='w-[60%] outline-none rounded-lg px-3 py-1 bg-gray-500 text-white' 
      value={language}
      onChange={handleLanguageChange}
    >
          <option value="Javascript">javascript</option>
          <option value="c++">c++</option>
          <option value="python">python</option>
          <option value="java">java</option>
    </select>

    </div>

      </div>
      <div className='w-[80%] bg-[#1E1E1E] h-full overflow-hidden'>    
      <Editor 

        className='p-2'
        theme='vs-dark'
        value={code}
        onChange={handleCodeChange}
        height="100%" 
        defaultLanguage="javascript"
        defaultValue="// some comment"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
 
        />;
      </div>
    </div>
    </>
  )
}
}
export default App
