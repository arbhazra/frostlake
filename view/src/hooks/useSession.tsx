//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'

//Session Hook
const useSession = () =>
{
    const [state, setState] = useState({ name: '', isLoaded: false, hasError: false })

    useEffect(() => 
    {
        (async () =>
        {
            try 
            {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token') 
                const response = await axios.get('/services/session/getactiveuser')
                setState({ name: response.data.user.name, isLoaded: true, hasError: false })
            } 
            
            catch (error) 
            {
                localStorage.removeItem('token')
                setState({ ...state, isLoaded: true, hasError: true })
            }
        })()
    }, [])

    return state
}

//Export Statement
export default useSession