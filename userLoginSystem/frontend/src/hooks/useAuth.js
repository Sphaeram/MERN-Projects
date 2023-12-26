import {useSelector} from 'react-redux' 
import { selectAllAuth } from '../features/auth/authSlice'

const useAuth = ()=>{
    const auth = useSelector(selectAllAuth)
    return auth
}

export default useAuth