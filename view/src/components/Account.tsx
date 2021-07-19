//Import Statements
import React, { Fragment, useState } from 'react'
import axios from 'axios'
import Loading from '../reusables/Loading'
import { Redirect, useHistory, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Navigation from '../reusables/Navigation'
import useSession from '../hooks/useSession'

//Dashboard Component
const Dashboard: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    
    //JSX
    if(session.hasError)
    {
        return <Redirect to = '/auth/signin' />
    }

    else
    {
        if(session.isLoaded)
        {
            return(
                <Fragment>
                    <Navigation />
                    <Container>
                        <div className="cover covertext">
                            <p className="display-1">Snowlake</p>
                            <p className="lead my-4 fw-bold">{ `Welcome, ${session.name.split(" ")[0]}` }<br/> { `${session.prototypeCount} % account storage used, ${100-session.prototypeCount} % free`} <br />Control your things from here</p>
                            <Link to ='/account/update' className="btn">Update Account<i className="fas fa-chevron-right"></i></Link>
                        </div>
                    </Container>
                </Fragment> 
            )
        }

        else
        {
            return <Loading />
        }
    }
}

//Update Account Component
const UpdateAccount: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ name: '', password: '', alert: '' })
    const history = useHistory()

    let handleUpdate = async(e:any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Updating Profile' })
        
        try 
        {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
            const res = await axios.post('/api/account/update', state)
            const response = await axios.get('/api/account/dashboard')
            setState({ ...state, alert: res.data.msg })
        } 
        
        catch (error: any) 
        {
            if(error.response)
            {
                if (error.response.status === 401) 
                {
                    localStorage.removeItem('token')
                    history.push('/auth/signin')
                }
    
                else
                {
                    setState({ ...state, alert: error.response.data.msg })
                }
            }

            else
            {
                localStorage.removeItem('token')
                history.push('/auth/signin')
            }
        }
    }

    //JSX
    if(session.hasError)
    {
        return(<Redirect to= '/auth/signin' />)
    }

    else
    {
        if(session.isLoaded)
        {
            return (
                <Fragment>
                    <Navigation />
                    <form className="box" onSubmit = { handleUpdate }>   
                        <p className="logo logobox">Update Account</p>
                        <input type="text" id="name" name="name" placeholder="Change Name" onChange={ (e) => setState({ ...state, name: e.target.value }) } defaultValue={ session.name } autoComplete="off" required minLength={3} maxLength={40} />
                        <input type="password" id="new-password" autoComplete={ 'new-password' } name="password" placeholder="Old/New Password" onChange={ (e) => setState({ ...state, password: e.target.value }) } required minLength={8} maxLength={20} />
                        <p id="alert">{ state.alert }</p>
                        <button type="submit" className="btn btn-block">Update Account<i className="fas fa-chevron-right"></i></button><br/>
                        <Link to='/account/close' className='boxlink'>Close Your Account</Link>
                    </form>
                </Fragment>   
            )
        }

        else
        {
            return <Loading />
        }
        
    }
}

//Close Account Component
const CloseAccount: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ password: '', alert: '' })
    const history = useHistory()

    let handleClose = async(e:any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Closing Account' })
            
        try 
        {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
            await axios.post('/api/account/close', state)
            localStorage.removeItem('token')
            history.push('/auth/signin')
        } 
        
        catch (error) 
        {
            setState({ ...state, alert: 'Invalid Password' })
        }
    }

    //JSX
    if(session.hasError)
    {
        return(<Redirect to= '/auth/signin' />)
    }

    else
    {
        return (
            <Fragment>
                <Navigation />
                <form className="box" onSubmit = { handleClose }>   
                    <p className="logo logobox">Close Account</p>
                    <input type="password" name="password" placeholder="Your Password" onChange={ (e) => setState({ ...state, password: e.target.value }) } required autoComplete="off" />
                    <p id="alert">{ state.alert }</p>
                    <button type="submit" className="btn btn-block">Close Account<i className="fas fa-chevron-right"></i></button>
                </form>
            </Fragment>
        )
    }
}

//Export Statement
export { Dashboard, UpdateAccount, CloseAccount }