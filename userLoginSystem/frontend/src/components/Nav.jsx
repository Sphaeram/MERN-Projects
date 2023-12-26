import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useDispatch } from 'react-redux'
import { axiosPrivate } from '../api/axios'
import { logOut } from '../features/auth/authSlice'

const Nav = () => {
  const { isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      const response = await axiosPrivate.get('/auth/logout')
      if (response.status >= 200 && response.status < 300) {
        dispatch(logOut())
        navigate('/login')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <nav>
      <ul className='nav'>
        <li><Link to={'/'}>Home</Link></li>
        <li><Link to={'/users'}>Users</Link></li>
        <li><Link to={'/test'}>Test</Link></li>
        <li><Link to={'/signup'}>SignUp</Link></li>
        {!isAuthenticated && <li><Link to={'/login'}>Login</Link></li>}
        {isAuthenticated && <li><Link to={'/logout'} onClick={logout}>Logout</Link></li>}
      </ul>
    </nav>
  )
}

export default Nav