//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'

//Session Hook
const useSession = () =>
{
    const [state, setState] = useState({ name: '', documentCount:0, isLoaded: false, hasError: false })

    useEffect(() => 
    {
        let authAPI = async() =>
        {
            try 
            {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token') 
                const response = await axios.get('/services/session/getactiveuser')
                setState({ name: response.data.user.name, documentCount: response.data.documentCount, isLoaded: true, hasError: false })
            } 
            
            catch (error) 
            {
                localStorage.removeItem('token')
                setState({ ...state, isLoaded: true, hasError: true })
            }
        }

        authAPI()
    }, [])

    return state
}

//Export Statement
export default useSession