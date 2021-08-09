//Import Statements
import React, { Fragment } from 'react'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//Navigation Module Component
const NavigationModule : React.FC = () =>
{
    if(!localStorage.getItem('token'))
    {
        return(
            <Navbar variant='dark' expand='lg'>
                <Container style={{ minWidth: '90%' }}>
                    <Link to='/'><Navbar.Brand>Frostlake</Navbar.Brand></Link>
                    <Navbar.Toggle></Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className='ms-auto'>
                            <Link to='/identity/signup'><Navbar.Brand>Sign Up</Navbar.Brand></Link>
                            <Link to='/identity/signin'><Navbar.Brand>Sign In</Navbar.Brand></Link>
                            <a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/arbhazra/'><Navbar.Brand>Creator</Navbar.Brand></a>  
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
    
    else
    {
        return(
            <Navbar variant='dark' expand='lg'>
                <Container style={{ minWidth: '90%' }}>
                    <Link to='/document/library'><Navbar.Brand>Library</Navbar.Brand></Link>  
                    <Navbar.Toggle></Navbar.Toggle>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>   
                            <Link to='/document/create'><Navbar.Brand>Create Document</Navbar.Brand></Link>
                            <Link to='/account/update'><Navbar.Brand>Account</Navbar.Brand></Link>
                            <Link to='/identity/signout'><Navbar.Brand>Sign Out</Navbar.Brand></Link>             
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

//Offline Module Component
const OfflineModule : React.FC = () => 
{
    return (
        <div className='box'>
            <p className='boxhead'>You're offline</p> 
            <i className='fas fa-wifi fa-6x'></i> 
        </div>
    )
}

//Error Module Component
const ErrorModule : React.FC = (props : any) =>
{
    return (
        <Fragment>
            <div className='box'> 
                <p className='boxhead'>{ props.message ? props.message : '404, Lost' }</p>
                <button onClick={ () => window.history.back() } className='btn btnsubmit'><i className='fas fa-chevron-left'></i>Go Back</button>
            </div>
        </Fragment>
    )
}

//Loading Module Component
const LoadingModule : React.FC = () =>
{
    return(
        <Fragment>
            <NavigationModule />
            <div className='cover text-center fa-6x'>
                <i className='fas fa-circle-notch fa-spin'></i>
            </div>
        </Fragment>
    )
}

//Export Statement
export { NavigationModule, OfflineModule, ErrorModule, LoadingModule }