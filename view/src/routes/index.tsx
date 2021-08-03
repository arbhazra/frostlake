import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CloseAccount, Dashboard, ResetAccount, UpdateAccount } from '../components/Account'
import { PasswordReset, SignIn, SignOut, SignUp } from '../components/Identity'
import Home from '../components/Home'
import { CreateDocument, ViewDocument, DocumentLibrary } from '../components/Document'
import Error from '../reusables/Error'

function Routes() 
{
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path= '/' component = { Home } />
                <Route exact path= '/identity/signup' component = { SignUp } />
                <Route exact path= '/identity/signin' component = { SignIn } />
                <Route exact path= '/identity/pwreset' component = { PasswordReset } />
                <Route exact path= '/identity/signout' component = { SignOut } />
                <Route exact path= '/account/dashboard' component = { Dashboard } />
                <Route exact path= '/account/update' component = { UpdateAccount } />
                <Route exact path= '/account/reset' component = { ResetAccount } />
                <Route exact path= '/account/close' component = { CloseAccount } />
                <Route exact path= '/document/create' component = { CreateDocument } />
                <Route exact path= '/document/library' component = { DocumentLibrary } />
                <Route exact path= '/document/view/:id' component = { ViewDocument } />
                <Route component = { Error } />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes