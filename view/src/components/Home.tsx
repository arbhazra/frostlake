//Import Statements
import { Redirect, Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import React, { Fragment } from 'react'
import { NavigationModule } from './Modules'

//Home Component
const Home : React.FC = () =>
{
    //JSX
    if(localStorage.getItem('token'))
    {
        return <Redirect to='/document/library' />
    }

    else
    {
        return(
            <Fragment>
                <NavigationModule />
                <Container>
                    <div className='cover covertext'>
                        <p className='display-4'>Innovate anywhere</p>
                        <p className='lead my-4 fw-bold'>
                            Store amazing things <br/> 
                            Document cloud for everyone <br/> 
                            Store, access and share your documents in one place
                        </p>
                        <Link to ='/identity/signup' className='btn'>Sign Up<i className='fas fa-chevron-right'></i></Link>
                    </div>
                </Container>
            </Fragment> 
        )
    }  
}  

//Export Statement
export default Home