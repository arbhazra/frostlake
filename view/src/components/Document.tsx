//Import Statements
import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import Navigation from '../reusables/Navigation'
import { Container, Row, Card, Col, Form } from 'react-bootstrap'
import Loading from '../reusables/Loading'
import Error from '../reusables/Error'
import { useHistory, Link, Redirect } from 'react-router-dom'
import useSession from '../hooks/useSession'

//Create Document Component
const CreateDocument: React.FC = (props: any) =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ title: '', content: '', project: '', alert: '' })
    const history = useHistory()
    const id = props.match.params.id

    const readFile = (e) =>
    {
        setState({ ...state, alert: 'hello' })

        try 
        {
            e.preventDefault()
            const file = e.target.files[0]
            
            if(file.name.split('.').pop() === 'txt' && file.size < 1048576)
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
    
            else
            {
                setState({ ...state, alert: 'Unsupported File' })
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
            const res = await axios.post(`/api/document/create`, state)
            history.push(`/document/view/${res.data._id}`)
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
        return <Redirect to = '/identity/signin' />
    }

    else
    {
        return (
            <Fragment>
                <Navigation/>
                <form className='box' onSubmit={ handleSubmit }> 
                    <p className='boxhead'>Create Document</p>
                    <input type='text' name='title' placeholder='Document Title' onChange={ (e) => setState({ ...state, title: e.target.value }) } autoComplete='off' required />
                    <Form.Group controlId="formFileLg" className="mb-3">
                        <Form.Label>Choose Text Document</Form.Label>
                        <Form.Control type="file" size="lg" onChange={ readFile } accept=".txt" />
                    </Form.Group>
                    <p id='alert'>{ state.alert }</p>
                    <button type='submit' className='btn btnsubmit'>Create<i className='fas fa-chevron-right'></i></button>
                </form>
            </Fragment>   
        )
    }
}

//Document Library Component
const DocumentLibrary: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ documents: [], isLoaded: false, show: false, alert: '' })
    const history = useHistory()

    useEffect(() => 
    {
        let fetchLibrary = async() =>
        {
            try 
            {
                const response = await axios.get('/api/document/library')
                setState({ ...state, documents: response.data, isLoaded: true })
            } 
            
            catch (error) 
            {
                history.push('/identity/signin') 
            }
        }       

        fetchLibrary()   
    }, [])

    let documentItems = state.documents.map((item:any)=>
    {
        return(
            <Card className='text-center' key={ item._id }>
                <Link to={ `/document/view/${item._id}` }>
                    <Card.Header className='text-white'>
                        <Row className='align-items-center'>
                            <Col>
                                <i className='fas fa-key fa-2x'></i>
                            </Col>
                            <Col>
                                <p className='logo'>{ item.title }</p>
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
        return <Redirect to = '/identity/signin' />
    }

    else
    {
        if(state.isLoaded)
        {
            if(state.documents.length === 0)
            {
                return(
                    <Fragment>
                        <Navigation/>
                        <Error type='forward' message='No Documents' btn='Create Document' btnlink='/document/create' />
                    </Fragment>
                ) 
            }
    
            else
            {
                return(
                    <Fragment>
                        <Navigation/>
                        <Container style={{ minWidth: '70%' }}>
                            { documentItems }
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

//View Document Component
const ViewDocument: React.FC = (props: any) =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ title: '', content: '', isLoaded: false, error: false, alert: '' })
    const { id } = props.match.params
    const history = useHistory()

    useEffect(() => 
    {
        let fetchDocument = async() =>
        {
            try 
            {
                const response = await axios.get(`/api/document/view/${id}`)
                console.log(response)
                setState({ ...state, title: response.data.document.title, content: response.data.document.content, isLoaded: true })     
            } 
            
            catch (error) 
            {
                setState({ ...state, error: true, isLoaded: true }) 
            }
        } 

        fetchDocument()
    }, [])

    const updateDocument = async(e) =>
    {
        e.preventDefault()

        try 
        {
            const response = await axios.post(`/api/document/update/${id}`, state)
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
        element.download = (document.getElementById('title') as HTMLInputElement).value
        document.body.appendChild(element)
        element.click()
        setState({ ...state, alert: 'Document Downloaded' })
    }

    const deleteDocument = async(e) =>
    {
        e.preventDefault()

        try 
        {
            await axios.delete(`/api/document/delete/${id}`)
            history.push(`/document/library`)
        } 
        
        catch (error) 
        {
            console.log(error)
        }
    }

    //JSX
    if(session.hasError)
    {
        return <Redirect to='/identity/signin' />
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
                                        <Form.Label>Document Title</Form.Label>
                                        <Form.Control type="text" id="title" placeholder="Document Name" value={ state.title } onChange={ (e) => setState({ ...state, title: e.target.value }) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control as="textarea" id="content" style={{ height: '30rem' }} value= { state.content } onChange={ (e) => setState({ ...state, content: e.target.value }) }/>
                                    </Form.Group>
                                    <p id="alert">{ state.alert }</p>
                                    <button type="submit" className="btn btn-block" onClick={ updateDocument }><i className="fas fa-check"></i></button>
                                </Form>
                                <button className="btn btn-block" onClick={ downloadDocument }><i className="fas fa-long-arrow-alt-down"></i></button>
                                <button className="btn btn-block" onClick={ deleteDocument }><i className="far fa-trash-alt"></i></button>
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
export { CreateDocument, DocumentLibrary, ViewDocument }