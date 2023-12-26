import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { register } from './authActions/authAction'
import { useNavigate } from 'react-router'

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
        dispatch(register(userInfo))
        navigate('/login')
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
                            <span className="button__text">Register</span>
                        </button>
                    </form>
                </div>
                <div className="screen__background2">
                    <span className="register_screen__background__shape3"></span>
                </div>
            </div>
        </div>
    )
}

export default Register