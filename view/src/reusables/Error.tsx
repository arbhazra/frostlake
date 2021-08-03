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
                    <p className="boxhead">{ props.message }</p>
                    <Link to={ props.btnlink } className="btn btnsubmit">{ props.btn }<i className="fas fa-chevron-right"></i></Link>
                </div>
            </Fragment>
        )
    }

    else
    {
        return (
            <Fragment>
                <div className="box"> 
                    <p className="boxhead">{ props.message? props.message: 'Not Found' }</p>
                    <button onClick={ () => window.history.back() } className="btn btnsubmit"><i className="fas fa-chevron-left"></i>{ props.btn? props.btn: 'Go Back' }</button>
                </div>
            </Fragment>
        )
    }
}

//Export Statement
export default Error