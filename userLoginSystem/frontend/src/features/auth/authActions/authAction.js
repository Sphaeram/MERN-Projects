import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";

export const register = createAsyncThunk('auth/signup', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/signup', { email, password })
        return response?.data
    } catch (error) {
        return rejectWithValue(error.response.data.msg)
    }
})

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/login', { email, password }, {
            withCredentials: true
        })
        return { email: email, accessToken: response?.data?.accessToken }
    } catch (error) {
        if(error?.response && error?.response?.status === 401){
            return rejectWithValue(error.response.data.msg)
        }
        return rejectWithValue(error.response.data)
    }
})