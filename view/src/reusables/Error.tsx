//Import Statements
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

//Error Component
function Error(props: any)
{
    if(props.type === 'forward')
    {
        return (
            <Fragment>
                <div className="box">   
                    <p className="logo logobox">{ props.message }</p>
                    <Link to={ props.btnlink } className="btn btn-block">{ props.btn }<i className="fas fa-chevron-right"></i></Link>
                </div>
            </Fragment>
        )
    }

    else
    {
        return (
            <Fragment>
                <div className="box"> 
                    <p className="logo logobox">{ props.message? props.message: 'Not Found' }</p>
                    <Link to={ props.btnlink? props.btnlink: '/' } className="btn btn-block"><i className="fas fa-chevron-left"></i>{ props.btn? props.btn: 'Go Back' }</Link>
                </div>
            </Fragment>
        )
    }
}

//Export Statement
export default Error