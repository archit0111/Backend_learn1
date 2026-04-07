import{BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import AdminPanal from './Components/AdminPanal'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/adminPannel" element={<AdminPanal/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
