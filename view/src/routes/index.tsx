import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CloseAccount, Dashboard, UpdateAccount } from '../components/Account'
import { PasswordReset, SignIn, SignOut, SignUp } from '../components/Authentication'
import Home from '../components/Home'
import Navigation from '../reusables/Navigation'

function Routes() 
{
    return (
        <BrowserRouter>
            {/* <Navigation /> */}
            <Switch>
                <Route exact path= '/' component = { Home } />
                <Route exact path= '/auth/signup' component = { SignUp } />
                <Route exact path= '/auth/signin' component = { SignIn } />
                <Route exact path= '/auth/pwreset' component = { PasswordReset } />
                <Route exact path= '/auth/signout' component = { SignOut } />
                <Route exact path= '/account/dashboard' component = { Dashboard } />
                <Route exact path= '/account/update' component = { UpdateAccount } />
                <Route exact path= '/project/new' component = { CloseAccount } />
                <Route exact path= '/project/close' component = { CloseAccount } />
                <Route exact path= '/account/close' component = { CloseAccount } />
                <Route exact path= '/account/close' component = { CloseAccount } />
                <Route exact path= '/account/close' component = { CloseAccount } />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes