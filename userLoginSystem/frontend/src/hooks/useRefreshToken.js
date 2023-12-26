import { useDispatch } from "react-redux";
import axios from "../api/axios";
import { setNewAcessToken } from "../features/auth/authSlice";

const useRefreshToken = () => {
    const dispatch = useDispatch()
    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        })
        dispatch(setNewAcessToken(response?.data?.accessToken))
        return response?.data?.accessToken
    }
    return refresh
}

export default useRefreshToken