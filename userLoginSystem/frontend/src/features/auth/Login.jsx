import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import { login } from './authActions/authAction'
import { useLocation, useNavigate } from 'react-router'

const Login = () => {
    const dispatch = useDispatch()
    const { isLoading } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const from = location.state?.from?.pathname || '/'

    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    })
    const [err, setErr] = useState({})

    const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const validateInput = (name, val) => {
        let errorMessage = ''
        setUserInfo({ ...userInfo, [name]: val })
        if (name === 'email') {
            if (!val) {
                errorMessage = "Email Required";
                setUserInfo({ ...userInfo, [name]: '' })
            } else if (!EMAIL_REGEX.test(val)) {
                errorMessage = "Email address must be a valid address";
            }
        }

        if (name === 'password') {
            if (!val) {
                errorMessage = "Password Required";
                setUserInfo({ ...userInfo, [name]: '' })
            } else if (userInfo[name]?.length < 5) {
                errorMessage = "Must be 6 characters long!"
            }
        }
        setErr({ ...err, [name]: errorMessage })
    }

    const handleInputs = (e) => {
        const name = e.target.name
        const value = e.target.value
        validateInput(name, value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setUserInfo({
            email: '',
            password: ''
        })
        dispatch(login(userInfo)).then((data) => {
            if (data.payload) {
                navigate(from, { replace: true })
            }
        })
    }

    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <form className="login" onSubmit={handleSubmit}>
                        <div className="login__field">
                            <input
                                className="login__input"
                                type="email"
                                name='email'
                                placeholder="Email"
                                autoComplete='off'
                                onChange={handleInputs}
                                value={userInfo.email}
                                required
                            />
                        </div>
                        {err.email && <small style={{ 'fontStyle': 'italic', 'color': 'red', 'fontWeight': 'bolder' }}>{err.email}</small>}
                        <div className="login__field">
                            <input
                                className="login__input"
                                type="password"
                                name='password'
                                minLength={6}
                                placeholder="Password"
                                onChange={handleInputs}
                                value={userInfo.password}
                                required
                            />
                        </div>
                        {err.password && <small style={{ 'fontStyle': 'italic', 'color': 'red', 'fontWeight': 'bolder' }}>{err.password}</small>}
                        <button
                            className="button login__submit"
                            type='submit'
                            disabled={userInfo.email === '' || userInfo.password.length < 6 ? true : false}
                        >
                            <span className="button__text">Log In</span>
                        </button>
                    </form>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    )
}

export default Login