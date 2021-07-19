import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from '../components/Home'
import Navigation from '../reusables/Navigation'

function Routes() 
{
    return (
        <BrowserRouter>
            <Navigation />
            <Switch>
                <Route exact path= '/' component = { Home } />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes