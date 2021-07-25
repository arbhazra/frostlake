//Import Statements
import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Navigation from '../reusables/Navigation'
import { Container, Row, Card, Col, Form } from 'react-bootstrap'
import Loading from '../reusables/Loading'
import Error from '../reusables/Error'
import { useHistory, Link, Redirect } from 'react-router-dom'
import useSession from '../hooks/useSession'

//Create Project Component
const CreateProject: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ title: '', alert: '' })
    const history = useHistory()

    let handleSubmit = async(e:any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Creating Project' })
        
        axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')

        try
        {
            const res = await axios.post('/api/doccloud/project/create', state)
            setState({ ...state, alert: 'Project Created' })
            history.push(`/doccloud/project/inventory/viewone/${res.data.project._id}`)
        } 

        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'An Error Occured' })
            }
        }  
    }

    //JSX
    if(session.hasError)
    {
        return <Redirect to = '/auth/signin' />
    }

    else
    {
        return (
            <Fragment>
                <Navigation/>
                <form className='box' onSubmit={ handleSubmit }> 
                    <p className='logo logobox'>Create Project</p>
                    <input type='text' name='title' placeholder='Project Title' onChange={ (e) => setState({ ...state, title: e.target.value }) } autoComplete='off' required />
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn btn-block'>Create<i className='fas fa-chevron-right'></i></button>
                </form>
            </Fragment>   
        )
    }
}

//Project Inventory Component
const ProjectInventory: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ projects: [], isLoaded: false, show: false, alert: '' })
    const history = useHistory()

    useEffect(() => 
    {
        let fetchinventory = async() =>
        {
            try 
            {
                const response = await axios.get('/api/doccloud/project/inventory')
                setState({ ...state, projects: response.data, isLoaded: true })
            } 
            
            catch (error) 
            {
                history.push('/auth/signin') 
            }
        }       

        fetchinventory()   
    }, [])

    let projectItems = state.projects.map((item:any)=>
    {
        return(
            <Card className='text-center' key={ item._id }>
                <Link to={ `/doccloud/project/inventory/viewone/${item._id}` }>
                    <Card.Header className='text-white'>
                        <Row className='align-items-center'>
                            <Col>
                                <i className='fas fa-key fa-2x'></i>
                            </Col>
                            <Col>
                                <p className='logo'>{ item.title }</p>
                                <p>{item.date.slice(0,15)}</p>
                            </Col>
                        </Row>
                    </Card.Header>
                </Link>
            </Card>
        )
    })

    //JSX
    if(session.hasError)
    {
        return <Redirect to = '/auth/signin' />
    }

    else
    {
        if(state.isLoaded)
        {
            if(state.projects.length === 0)
            {
                return(
                    <Fragment>
                        <Navigation/>
                        <Error type='forward' message='No Projects' btn='Create Project' btnlink='/doccloud/project/create' />
                    </Fragment>
                ) 
            }
    
            else
            {
                return(
                    <Fragment>
                        <Navigation/>
                        <Container style={{ minWidth: '70%' }}>
                            { projectItems }
                        </Container>     
                    </Fragment>
                )     
            }
        }
    
        else
        {
            return <Loading />
        }
    }

    
}

//View Project Component
const ViewProject: React.FC = (props:any) =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ id: '', title: '', date: '', documents: [], isLoaded: false, error: false })

    useEffect(() => 
    {
        let id = props.match.params.id
        setState({ ...state, id: id })

        let fetchProject = async() =>
        {
            try 
            {
                const response = await axios.get(`/api/doccloud/project/inventory/viewone/${id}`)
                console.log(response)
                setState({ ...state, title: response.data.project.title, date: response.data.project.date, documents: response.data.documents, isLoaded: true })     
            } 
            
            catch (error) 
            {
                setState({ ...state, error: true, isLoaded: true }) 
            }
        } 

        fetchProject()
    }, [])

    let documentItems = state.documents.map((item:any)=>
    {
        return(
            <Card className='text-center' key={ item._id }>
                <Link to={ `/doccloud/project/inventory/viewone/${props.match.params.id}/docs/${item._id}` }>
                    <Card.Header className='text-white'>
                        <Row className='align-items-center'>
                            <Col>
                                <i className='fas fa-key fa-2x'></i>
                            </Col>
                            <Col>
                                <p className='logo'>{ item.name }</p>
                                <p>{ item.date.slice(0,15) }</p>
                            </Col>
                        </Row>
                    </Card.Header>
                </Link>
            </Card>
        )
    })

    //JSX
    if(session.hasError)
    {
        return <Redirect to='/auth/signin' />
    }

    else
    {
        if(state.error)
        {
            return <Error type='backward' message='Not Found' btn='Go Back' btnlink='/'/>
        }
    
        else
        {
            if(state.isLoaded)
            {
                return(
                    <Fragment>
                        <Navigation />
                        <Container style = {{ minWidth: '70%' }}>
                            <div className='jumbotron'>
                                <Link to='/doccloud/project/inventory' className='btn'><i className='fas fa-chevron-left'></i>Go Back</Link>
                                <p className='logo text-center'>{ state.title }</p>
                                <p className='lead fw-bold'>{ `Start Date: ${state.date.slice(0,10)}` }</p>
                                <p className='lead fw-bold'>All Documents</p>
                                { documentItems }
                                <Link to={`/doccloud/project/inventory/viewone/${props.match.params.id}/docs/create`} className='btn'>Create Document<i className='fas fa-chevron-right'></i></Link>
                                <Link to={`/doccloud/project/inventory/viewone/${props.match.params.id}/deleteproject`} className='btn'>Delete Project<i className='fas fa-chevron-right'></i></Link>
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
}

//Delete Project Componet
const DeleteProject: React.FC = (props: any) =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ declaration: '', alert: '' })
    const history = useHistory()
    const id = props.match.params.id

    let handleDelete = async(e:any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Deleting Project' })
            
        try 
        {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
            await axios.delete(`/api/doccloud/project/inventory/viewone/${id}/deleteproject`)
            history.push('/doccloud/project/inventory')
        } 
        
        catch (error) 
        {
            setState({ ...state, alert: 'An Error Occured' })
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
                <form className="box" onSubmit = { handleDelete }>   
                    <p className="logo logobox">Yes, Delete Project</p>
                    <p id="alert">{ state.alert }</p>
                    <button type="submit" className="btn btn-block">Delete<i className="fas fa-chevron-right"></i></button>
                </form>
            </Fragment>
        )
    }
}

//Create Document Component
const CreateDocument: React.FC = (props: any) =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ name: '', content: '', project: '', alert: '' })
    const history = useHistory()
    const id = props.match.params.id

    const readFile = (e) =>
    {
        try 
        {
            e.preventDefault()
            const file = e.target.files[0]
            const fileSize = file.size
    
            if(fileSize > 1048576)
            {
                setState({ ...state, alert: 'File Size Should Be Within 1 MB' })
            }
    
            else
            {
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = () =>
                {
                    setState({ ...state, content: reader.result.toString(), project: id })
                }
        
                reader.onerror = () =>
                {
                    setState({ ...state, alert: 'File Size Too Large' })
                }
            }       
        } 
        
        catch (error) 
        {
            setState({ ...state, alert: 'Please Choose A File' })
        }
    }

    let handleSubmit = async(e:any) =>
    {
        e.preventDefault()
        setState({ ...state, alert: 'Creating Document' })
        
        axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')

        try
        {
            const res = await axios.post(`/api/doccloud/project/inventory/viewone/${id}/docs/create`, state)
            setState({ ...state, alert: 'Document Uploaded' })
        } 

        catch (error: any) 
        {
            if(error.response)
            {
                setState({ ...state, alert: error.response.data.msg })
            }

            else
            {
                setState({ ...state, alert: 'An Error Occured' })
            }
        }  
    }

    //JSX
    if(session.hasError)
    {
        return <Redirect to = '/auth/signin' />
    }

    else
    {
        return (
            <Fragment>
                <Navigation/>
                <form className='box' onSubmit={ handleSubmit }> 
                    <p className='logo logobox'>Create Document</p>
                    <input type='text' name='title' placeholder='Document Name' onChange={ (e) => setState({ ...state, name: e.target.value }) } autoComplete='off' required />
                    <Form.Group controlId="formFileLg" className="mb-3">
                        <Form.Label>Choose Text Document</Form.Label>
                        <Form.Control type="file" size="lg" onChange={ readFile } />
                    </Form.Group>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn btn-block'>Create<i className='fas fa-chevron-right'></i></button>
                </form>
            </Fragment>   
        )
    }
}

//View Document Component
const ViewDocument: React.FC = (props: any) =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ name: '', content: '', isLoaded: false, error: false, alert: '' })
    const { id, docid } = props.match.params
    const history = useHistory()

    useEffect(() => 
    {
        let fetchProject = async() =>
        {
            try 
            {
                const response = await axios.get(`/api/doccloud/project/inventory/viewone/${id}/docs/${docid}`)
                setState({ ...state, name: response.data.document.name, content: response.data.document.content, isLoaded: true })     
            } 
            
            catch (error) 
            {
                setState({ ...state, error: true, isLoaded: true }) 
            }
        } 

        fetchProject()
    }, [])

    const updateDocument = async(e) =>
    {
        e.preventDefault()

        try 
        {
            const response = await axios.post(`/api/doccloud/project/inventory/viewone/${id}/docs/${docid}/update`, state)
            setState({ ...state, alert: response.data.msg })  
        } 
        
        catch (error) 
        {
            setState({ ...state, error: true, isLoaded: true }) 
        }
    }

    const downloadDocument = () =>
    {
        const element = document.createElement('a')
        const blob = new Blob([(document.getElementById('content') as HTMLInputElement).value], { type: 'text/plain;charset=utf-8' })
        element.href = URL.createObjectURL(blob)
        element.download = (document.getElementById('name') as HTMLInputElement).value
        document.body.appendChild(element)
        element.click()
        setState({ ...state, alert: 'Document Downloaded' })
    }

    const deleteDocument = async(e) =>
    {
        e.preventDefault()

        try 
        {
            await axios.delete(`/api/doccloud/project/inventory/viewone/${id}/docs/${docid}/delete`)
            history.push(`/doccloud/project/inventory/viewone/${id}`)
        } 
        
        catch (error) 
        {
            console.log(error)
        }
    }

    //JSX
    if(session.hasError)
    {
        return <Redirect to='/auth/signin' />
    }

    else
    {
        if(state.error)
        {
            return <Error type='backward' message='Not Found' btn='Go Back' btnlink='/'/>
        }

        else
        {
            if(state.isLoaded)
            {
                return(
                    <Fragment>
                        <Navigation />
                        <Container style={{ minWidth: '70%' }}>
                            <div className='jumbotron'>
                                <Form onSubmit={ updateDocument }>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Document Name</Form.Label>
                                        <Form.Control type="text" id="name" placeholder="Document Name" value={ state.name } onChange={ (e) => setState({ ...state, name: e.target.value }) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control as="textarea" id="content" style={{ height: '30rem' }} value= { state.content } onChange={ (e) => setState({ ...state, content: e.target.value }) }/>
                                    </Form.Group>
                                    <p id="alert">{ state.alert }</p>
                                    <button type="submit" className="btn btn-block" onClick={ updateDocument }>Update Document<i className="fas fa-chevron-right"></i></button>
                                </Form>
                                <button className="btn btn-block" onClick={ downloadDocument }>Download Document<i className="fas fa-chevron-right"></i></button>
                                <button className="btn btn-block" onClick={ deleteDocument }>Delete Document<i className="fas fa-chevron-right"></i></button>
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
}

//Export Statements
export { CreateProject, ProjectInventory, ViewProject, DeleteProject, CreateDocument, ViewDocument }