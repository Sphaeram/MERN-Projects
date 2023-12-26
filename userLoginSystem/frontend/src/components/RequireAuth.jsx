import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router'

const RequireAuth = () => {
    const { isAuthenticated } = useAuth()
    const location = useLocation()
    return (
        isAuthenticated
            ? <Outlet />
            : <Navigate to={'/login'} state={{ from: location }} replace />
    )
}

export default RequireAuth