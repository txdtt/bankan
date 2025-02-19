import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/sign_up/SignUp'
import ProfilePage from './pages/profile_page/ProfilePage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/my-profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    )
}

export default App
