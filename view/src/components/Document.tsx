//Import Statements
import React, { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Row, Card, Col, Form } from 'react-bootstrap'
import { NavigationModule, LoadingModule, ErrorModule } from './Modules'
import { useHistory, Redirect, Link } from 'react-router-dom'
import useSession from '../hooks/useSession'
import dateFormat from 'dateformat'

//Create Document Component
const CreateDocument: React.FC = () =>
{
    //LOGIC
    const session = useSession()
    const [state, setState] = useState({ title: '', content: '', privacy: '' })
    const [alert, setAlert] = useState('')

    const readFile = (e) =>
    {
        try 
        {
            e.preventDefault()
            const file = e.target.files[0]

            if(file.size < 30000000)
            {
                const reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = () =>
                {
                    setState({ ...state, title: file.name, content: reader.result.toString() })
                }
        
                reader.onerror = () =>
                {
                    setAlert('File Size Too Large')
                }   
            }

            else
            {
                setAlert('File Size Too Large')
            }
        } 
        
        catch (error) 
        {
            setAlert('File Size Too Large')
        }
    }

    let handleSubmit = async(e:any) =>
    {
        e.preventDefault()
        setAlert('Creating Document')
        
        try
        {
            axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
            await axios.post('/api/document/create', state)
            setAlert('Document Uploaded')
        } 

        catch (error: any) 
        {
            if(error.response)
            {
                setAlert('File Size Too Large')
            }

            else
            {
                setAlert('File Size Too Large')
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
                <NavigationModule />
                <form className='box' onSubmit={ handleSubmit }> 
                    <p className='boxhead'>Create Document</p>
                    <Form.Group controlId='formFileLg' className='mb-3'>
                        <Form.Control type='file' size='lg' onChange={ readFile } />
                    </Form.Group>
                    <Form.Select onChange = { (e) => setState({ ...state, privacy: (e.target as any).value }) }>
                        <option value=''>Select Document Privacy</option>
                        <option value='private'>Private</option>
                        <option value='public'>Public</option>
                    </Form.Select><br/>
                    <p id='alert'>{ alert }</p>
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
    const [state, setState] = useState({ documents: [], isLoaded: false, alert: '' })
    const history = useHistory()

    useEffect(() => 
    {        
        (async () =>
        {
            try 
            {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
                const response = await axios.get('/api/document/library')
                setState({ ...state, documents: response.data, isLoaded: true })
            } 
            
            catch (error) 
            {
                history.push('/identity/signin') 
            }
        })()
    }, [])

    const removeDocument = async(id: any) =>
    {
        const answer = window.confirm('Are you sure that you want to remove document?')
        
        if(answer)
        {
            try 
            {
                let documents = state.documents.filter((document:any) =>
                {
                    return id !== document._id
                })
    
                setState({ ...state, documents: documents })
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
                await axios.delete(`/api/document/delete/${id}`)
            } 
            
            catch (error) 
            {
                window.alert('Error removing document')
            }
        }
    }

    const copyLink = (id: any) =>
    {
        navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/document/save/${id}`)
        document.getElementById(`alert-${id}`).innerHTML = 'Link Copied'
        setTimeout(() => {
            document.getElementById(`alert-${id}`).innerHTML = ''
        }, 3000)
    }

    let documentItems = state.documents.map((item:any) =>
    {
        return(
            <Col xs={12} sm={12} md={6} lg={6} xl={4} key={ Math.random() }>
                <Card className='text-center' key={ item._id }>     
                    <Card.Header>
                        <Row className='align-items-center'>
                            <Col>  
                                <p className='filedetails' title={ item.title }>{ item.title.slice(0,15) }</p>
                                <p className='filedetails'>{ dateFormat(item.date, "fullDate") }</p>
                            </Col>
                            <Col>
                                { item.privacy == 'private'? <i className="fas fa-key fa-2x" title='Private'></i> : <i className="fas fa-user fa-2x" title='Public'></i> }
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Footer className='align-items-center'>
                        <Link to={ `/document/save/${item._id}` }><i className="fas fa-bookmark fa-2x" title='Save Document'></i></Link>              
                        { item.privacy == 'public'? <i className="fas fa-clipboard fa-2x" title='Get Sharable Public Link' onClick={ () => copyLink(item._id) }></i> : <></> }
                        <i className='fas fa-trash fa-2x' title='Remove' onClick={ () => removeDocument(item._id) }></i>
                        <p id={ `alert-${item._id}` } style={{ color: 'white' }}></p>
                    </Card.Footer>
                </Card>
            </Col>
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
                        <NavigationModule />
                        <div className="box">
                            <p className="boxhead">Library is Empty</p>
                            <Link to='/document/create' className="btn btnsubmit">Create Document <i className="fas fa-chevron-right"></i></Link>
                        </div>
                    </Fragment>
                ) 
            }
    
            else
            {
                return(
                    <Fragment>
                        <NavigationModule />
                        <Container style={{ minWidth: '80%' }}>
                            <Row>
                                { documentItems }
                            </Row>
                        </Container>
                    </Fragment>
                )     
            }
        }
    
        else
        {
            return <LoadingModule />
        }
    }

    
}

//Save Document Component
const SaveDocument: React.FC =(props : any) =>
{
    const [isDownloading, setDownloading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => 
    {
        const fetchDocument = async() =>
        {
            try 
            {
                axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token')
                const response = await axios.get(`/api/document/save/${props.match.params.id}`)
                const element = document.createElement('a')
                const url = response.data.document.content
                fetch(url).then(res => res.blob())
                .then(blob => 
                {
                    const file = new File([blob], 'File name')
                    element.href = URL.createObjectURL(file)
                    element.download = response.data.document.title
                    document.body.appendChild(element)
                    element.click()
                })
                setDownloading(false) 
            } 
            
            catch (error) 
            {
                setError(true)
            }
        }

        fetchDocument()
    }, [])

    if(error)
    {
        return(
            //@ts-ignore
            <ErrorModule message='No Access' />
        )
    }

    return(
        <Fragment>
        <NavigationModule />
            <div className='box text-center'>
                { isDownloading? <p className='boxhead'>Downloading</p> : <p className='boxhead'>Download Done</p> }
                { isDownloading? <i className='fas fa-circle-notch fa-spin fa-6x'></i> : <i className='fas fa-check-circle fa-6x'></i> }<br/><br/>
                <button onClick={ () => window.history.back() } className='btn btnsubmit'><i className='fas fa-chevron-left'></i>Go Back</button>
            </div>
        </Fragment>
    )
}

//Export Statements
export { CreateDocument, DocumentLibrary, SaveDocument }