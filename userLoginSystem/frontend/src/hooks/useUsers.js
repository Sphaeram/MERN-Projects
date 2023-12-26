import { useSelector } from "react-redux"
import { selectAllUsers } from "../features/users/usersSlice"

const useUsers = () => {
    const users = useSelector(selectAllUsers)
    return users
}

export default useUsers