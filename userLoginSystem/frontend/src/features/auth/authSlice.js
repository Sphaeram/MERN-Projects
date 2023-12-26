import { createSlice } from "@reduxjs/toolkit"
import { login, register } from "./authActions/authAction"
import toast from "react-hot-toast"
import { axiosPrivate } from "../../api/axios"

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    status: 'idle',
    error: null,
    user: {
        email: null,
        accessToken: null
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setNewAcessToken: (state, action) => {
            state.user.accessToken = action.payload
        },
        logOut: (state) => {
            state.isAuthenticated = false
            state.user.email = null
            state.user.accessToken = null
            toast.success('Logged Out!')
        }
    },
    extraReducers(builder) {
        builder
            // HANDLING REGISTER
            .addCase(register.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false
                state.status = 'success'
                toast.success('Account Created!')
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                toast.error(`${state.error}`)
            })

            // HANDLING LOGIN
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.status = 'success'
                state.isAuthenticated = true
                state.user = action.payload
                axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${action.payload.accessToken}`
                toast.success('Logged In!')
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                toast.error(`${state.error}`)
            })
    }
})

export const selectAllAuth = (state) => state.auth
export const { setNewAcessToken, logOut } = authSlice.actions
export default authSlice.reducer