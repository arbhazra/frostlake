//Import Statements
import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

//Navigation Component
function Navigation()
{
    if(!localStorage.getItem("token"))
    {
        return(
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Link to="/"><Navbar.Brand>Frostlake</Navbar.Brand></Link>
                    <Navbar.Toggle></Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                            <Link to="/auth/signup"><Navbar.Brand>Sign Up</Navbar.Brand></Link>
                            <Link to="/auth/signin"><Navbar.Brand>Sign In</Navbar.Brand></Link>
                            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/ar-hazra/"><Navbar.Brand>Creator</Navbar.Brand></a>  
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
    
    else
    {
        return(
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Link to="/account/dashboard"><Navbar.Brand>Dashboard</Navbar.Brand></Link>  
                    <Navbar.Toggle></Navbar.Toggle>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">   
                            <Link to="/account/update"><Navbar.Brand>Account</Navbar.Brand></Link>
                            <Link to="/auth/signout"><Navbar.Brand>Sign Out</Navbar.Brand></Link>             
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

//Export Statement
export default Navigation