import { Route, Routes } from "react-router"
import Nav from "./components/Nav"
import Login from "./features/auth/Login"
import Register from "./features/auth/Register"
import Home from './components/Home'
import User from "./features/users/User"
import RequireAuth from "./components/RequireAuth"
import Test from './components/Test'

function App() {

  return (
    <>
      <Nav />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/users" element={<User />} />
          <Route path="/test" element={<Test />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
