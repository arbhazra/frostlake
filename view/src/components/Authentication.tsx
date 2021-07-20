//Import Statements
import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import { Redirect, Link, useHistory } from 'react-router-dom'
import Navigation from '../reusables/Navigation'
import { Form } from 'react-bootstrap'

//Signup Component
const SignUp: React.FC = () =>
{
    const [state, setState] = useState({ name: '', email: '', password: '', region: '', otp: '', hash:'', alert: '' })
    const [regions, setRegions] = useState([])
    const [show, setShow] = useState({ step1: true, step2: false })
    const history: any = useHistory()

    useEffect(() => 
    {
        const fetchRegions = async() =>
        {
            const response = await axios.get('http://worldtimeapi.org/api/timezone')
            setRegions(response.data)
        }

        fetchRegions()
    }, [])

    let getOTP = async(e: any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Please Wait' })

        try 
        {  
            const response = await axios.post('/api/auth/signup/getotp', state)
            setState({ ...state, hash: response.data.hash, alert: response.data.msg })
            setShow({ step1: false, step2: true })
        } 
        
        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'Connection Error' })
            }
        }
    }

    let register = async(e: any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Creating Account' })

        try 
        {   
            const response = await axios.post('/api/auth/signup/register', state)
            axios.defaults.headers.common['x-auth-token'] = response.data.token
            localStorage.setItem('token', response.data.token)
            history.push('/account/dashboard')
        } 
        
        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'Connection Error' })
            }
        }
    }

    if(localStorage.getItem('token'))
    {
        return(<Redirect to='/account/dashboard' />)
    }

    else
    {
        return(
            <Fragment>
                <Navigation/>
                <form className='box' onSubmit = { getOTP } style={{ display: show.step1? 'block': 'none' }}>   
                    <p className='logo logobox'>Sign Up</p>
                    <input type='text' name='name' placeholder='Your Name' onChange={ (e) => setState({ ...state, name: e.target.value }) } required autoComplete = {'off'}  minLength={3} maxLength={40} />
                    <input type='email' name='email' placeholder='Email Address' onChange={ (e) => setState({ ...state,  email: e.target.value }) } required autoComplete = {'off'}  minLength={4} maxLength={40}/>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn'>Continue<i className='fas fa-chevron-right'></i></button>
                </form> 
                <form className='box' onSubmit = { register } style={{ display: show.step2? 'block': 'none' }}>   
                    <p className='logo logobox'>Sign Up</p>
                    <input type='password' name='password' placeholder='Choose a Password' onChange={ (e) => setState({ ...state,  password: e.target.value }) } required autoComplete = {'off'}  minLength={8} maxLength={20}/>
                    <input type='text' name='otp' placeholder='Enter OTP sent to you' onChange={ (e) => setState({ ...state,  otp: e.target.value }) } required autoComplete = {'off'}  minLength={6} maxLength={6}/>
                    <Form.Select onChange = { (e) => setState({ ...state, region: (e.target as any).value }) }>
                        <option>Select Region</option>
                        {
                            regions.map(region =>
                            {
                                return <option value={ region }>{region}</option>
                            })
                        }
                    </Form.Select><br/>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn'>Sign Up<i className='fas fa-chevron-right'></i></button>
                </form>
            </Fragment>
        )
    }
}

//Signin Component
const SignIn: React.FC = () =>
{
    const [state, setState] = useState({ email: '', password: '', otp: '', hash:'', alert: '' })
    const [show, setShow] = useState({ step1: true, step2: false })
    const history: any = useHistory()

    let getOTP = async(e: any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Please Wait' })

        try 
        {     
            const response = await axios.post('/api/auth/signin/getotp', state)
            setState({ ...state, hash: response.data.hash, alert: response.data.msg })
            setShow({ step1: false, step2: true })
        } 

        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'Connection Error' })
            }
        }
    }


    let login = async(e: any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Signing In' })

        try 
        {
            const res = await axios.post('/api/auth/signin/login', state)
            axios.defaults.headers.common['x-auth-token'] = res.data.token
            const response = await axios.get('/api/account/dashboard')  
            localStorage.setItem('token', res.data.token)
            history.push('/account/dashboard')
        } 
        
        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'Connection Error' })
            }
        }
    }

    if(localStorage.getItem('token'))
    {
        return (<Redirect to='/account/dashboard' />)
    }

    else
    {
        return (
            <Fragment>
                <Navigation />
                <form className='box' onSubmit = { getOTP } style={{ display: show.step1? 'block': 'none' }}>   
                    <p className='logo logobox'>Sign In</p>
                    <input type='email' name='email' placeholder='Email Address' onChange={ (e) => setState({ ...state, email: e.target.value }) } required autoComplete = {'off'}/>
                    <input type='password' name='password' placeholder='Password' onChange={ (e) => setState({ ...state, password: e.target.value }) } required autoComplete = {'off'}/>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn'>Continue<i className='fas fa-chevron-right'></i></button><br/>
                    <Link to='/auth/pwreset' className='boxlink'>Forgot Password? Reset Here</Link>
                </form>  
                <form className='box' onSubmit = { login } style={{ display: show.step2? 'block': 'none' }}>   
                    <p className='logo logobox'>Sign In</p>
                    <input type='text' name='otp' placeholder='Enter OTP sent to you' onChange={ (e) => setState({ ...state,  otp: e.target.value }) } required autoComplete = {'off'}  minLength={6} maxLength={6}/>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn'>Sign In<i className='fas fa-chevron-right'></i></button>
                </form>
            </Fragment>   
        )
    }
}

//Password Reset Component
const PasswordReset: React.FC = () =>
{
    const [state, setState] = useState({ email: '', password: '', otp: '', hash:'', alert: '' })
    const [show, setShow] = useState({ step1: true, step2: false })

    let getOTP = async(e: any) =>
    {
        e.preventDefault()    
        setState({ ...state, alert: 'Please Wait' })

        try 
        { 
            const response: any = await axios.post('/api/auth/pwreset/getotp', state)
            setState({ ...state, hash: response.data.hash, alert: response.data.msg })
            setShow({ step1: false, step2: true })
        } 
        
        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'Connection Error' })
            }
        }
    }

    let reset = async(e: any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Resetting Password' })

        try 
        {     
            const res = await axios.post('/api/auth/pwreset/reset', state)
            setState({ ...state, alert: res.data.msg })
            setShow({ step1: true, step2: false })
        } 
        
        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }
            else
            {
                setState({ ...state, alert: 'Connection Error' })
            }
        }   
    }

    if(localStorage.getItem('token'))
    {
        return (<Redirect to='/account/dashboard' />)
    }

    else
    {
        return (
            <Fragment>
                <Navigation />
                <form className='box' onSubmit = { getOTP } style={{ display: show.step1? 'block': 'none' }}>   
                    <p className='logo logobox'>Reset Password</p>
                        <input type='email' name='email' placeholder='Email Address' onChange={ (e) => setState({ ...state, email: e.target.value }) } required autoComplete = {'off'}  />
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn'>Continue<i className='fas fa-chevron-right'></i></button>
                </form> 
                <form className='box' onSubmit = { reset } style={{ display: show.step2? 'block': 'none' }}>   
                    <p className='logo logobox'>Reset Password</p>
                    <input type='text' name='otp' placeholder='Enter OTP sent to you' onChange={ (e) => setState({ ...state, otp: e.target.value }) } required autoComplete = {'off'} minLength={6} maxLength={6}/>
                    <input type='password' name='password' placeholder='Enter New Passweod' defaultValue='' onChange={ (e) => setState({ ...state, password: e.target.value }) } required autoComplete = {'off'} minLength={8} maxLength={20}/>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn'>Reset Password<i className='fas fa-chevron-right'></i></button>
                </form> 
            </Fragment>  
        ) 
    }
}

//Signout Component
const SignOut: React.FC = () =>
{
    //LOGIC
    localStorage.removeItem('token')
  
    //JSX
    return <Redirect to = '/auth/signin' />
}

//Export Statement
export { SignUp, SignIn, PasswordReset, SignOut }