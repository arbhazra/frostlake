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
                    <button onClick={ () => window.history.back() } className="btn btn-block"><i className="fas fa-chevron-left"></i>{ props.btn? props.btn: 'Go Back' }</button>
                </div>
            </Fragment>
        )
    }
}

//Export Statement
export default Error