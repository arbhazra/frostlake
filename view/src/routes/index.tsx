import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { CloseAccount, Dashboard, UpdateAccount } from '../components/Account'
import { PasswordReset, SignIn, SignOut, SignUp } from '../components/Authentication'
import Home from '../components/Home'
import { CreateProject, ProjectInventory, ViewProject, DeleteProject, CreateDocument, ViewDocument } from '../components/Cloud'
import Error from '../reusables/Error'

function Routes() 
{
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path= '/' component = { Home } />
                <Route exact path= '/auth/signup' component = { SignUp } />
                <Route exact path= '/auth/signin' component = { SignIn } />
                <Route exact path= '/auth/pwreset' component = { PasswordReset } />
                <Route exact path= '/auth/signout' component = { SignOut } />
                <Route exact path= '/account/dashboard' component = { Dashboard } />
                <Route exact path= '/account/update' component = { UpdateAccount } />
                <Route exact path= '/account/close' component = { CloseAccount } />
                <Route exact path= '/doccloud/project/create' component = { CreateProject } />
                <Route exact path= '/doccloud/project/inventory' component = { ProjectInventory } />
                <Route exact path= '/doccloud/project/inventory/viewone/:id' component = { ViewProject } />
                <Route exact path= '/doccloud/project/inventory/viewone/:id/deleteproject' component = { DeleteProject } />
                <Route exact path= '/doccloud/project/inventory/viewone/:id/docs/create' component = { CreateDocument } />
                <Route exact path= '/doccloud/project/inventory/viewone/:id/docs/:docid' component = { ViewDocument } />
                <Route component = { Error } />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes