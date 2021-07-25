//Import Statements
import { useState, useEffect } from 'react'
import axios from 'axios'

//Session Hook
const useSession = () =>
{
    const [state, setState] = useState({ name: '', region: 'Asia/Kolkata', projectCount: 0, documentCount:0, isLoaded: false, hasError: false })

    useEffect(() => 
    {
        let authAPI = async() =>
        {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token') 
    
            try 
            {
                const response = await axios.get('/api/account/dashboard')
                console.log(response)
                setState({ name: response.data.user.name, region: response.data.user.region, projectCount: response.data.projectCount, documentCount: response.data.documentCount, isLoaded: true, hasError: false })
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