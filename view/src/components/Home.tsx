//Import Statements
import { Redirect, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import React, { Fragment } from 'react'
import Navigation from '../reusables/Navigation'

//Home Component
const Home: React.FC = () =>
{
    //JSX
    if(localStorage.getItem('token'))
    {
        return <Redirect to='/account/dashboard' />
    }

    else
    {
        return(
            <Fragment>
                <Navigation />
                <Container>
                    <div className="cover covertext">
                        <p className="display-4">Innovate anywhere</p>
                        <p className="lead my-4 fw-bold" style={{ marginLeft: '3px' }}>Build amazing things <br/> Document Cloud for everyone <br/> Share your documents on the cloud securely</p>
                        <Link to ='/identity/signup' className="btn">Sign Up<i className="fas fa-chevron-right"></i></Link>
                    </div>
                </Container>
            </Fragment> 
        )
    }  
}  

//Export Statement
export default Home