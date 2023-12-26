import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useUsers from '../../hooks/useUsers'
import { setUsers } from './usersSlice'

const User = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    const { users } = useUsers()

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                })
                isMounted && dispatch(setUsers(response?.data?.users))
            } catch (err) {
                navigate('/login', { state: { from: location }, replace: true })
            }
        }

        getUsers();

        return () => {
            isMounted = false
            // controller.abort()    // Will only work in Production or without strict-mode in development
            /* *********** */
            // Reason: useEffect runs twice in development strcit mode. So, when the requests are pending waiting to be resolved, the cleanup function is called for first sent axios request and controller.abort() is executed. The abort() funtion cancels all pending axios request and so that's why we get a cancelled error.
        }

    }, [])

    return (
        <>
            {users?.length < 0
                ? 'No Users Found'
                : <div style={{ 'textAlign': 'center', 'marginTop': '2rem' }}>
                    <h1 style={{ 'color': 'white' }}>Users</h1>
                    <div style={{ 'marginTop': '1rem' }}>
                        {users?.map((user, index) => (
                            <h2 key={index}>{user.email}</h2>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default User