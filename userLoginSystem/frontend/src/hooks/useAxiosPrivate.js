import { useEffect } from 'react'
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken'
import { axiosPrivate } from '../api/axios'

const useAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const { user } = useAuth

    useEffect(() => {

        const resquestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${user?.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                //!prevRequest?.sent
                if (error?.response?.status === 403) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(resquestInterceptor)
            axiosPrivate.interceptors.response.eject(responseInterceptor)
        }

    }, [user, refresh])
    return axiosPrivate
}

export default useAxiosPrivate