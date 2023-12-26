import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
    error: null
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers:{
        setUsers:(state,action)=>{
            state.users = action.payload
            // console.log(action.payload)
            state.error = null
        }
    }
})

export const selectAllUsers = (state)=>state.users
export const {setUsers}=usersSlice.actions
export default usersSlice.reducer