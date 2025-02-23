import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/sign_up/SignUp'
import ProfilePage from './pages/profile_page/ProfilePage'
import Board from './pages/board/Board'
import { io } from 'socket.io-client'

const socket = io("http://localhost:3000");

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/u/:username" element={<ProfilePage />} />
                <Route path="/b/:boardId/:boardTitle" element={<Board socket={socket}/>} />
            </Routes>
        </Router>
    )
}

export default App
