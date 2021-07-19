//Import Statements
import { Fragment } from 'react'
import Navigation from './Navigation'

//Loading Component
function Loading()
{
    return(
        <Fragment>
            <Navigation />
            <div className="cover coverloader fa-6x">
                <i className="fas fa-spinner fa-pulse"></i>
            </div>
        </Fragment>
    )
}


//Export Statement
export default Loading