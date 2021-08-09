import { BrowserRouter, Route, Switch } from 'react-router-dom'
import useDetectOffline from 'use-detect-offline'
import { AccountStorage, CloseAccount, UpdateAccount } from './components/Account'
import { PasswordReset, SignIn, SignOut, SignUp } from './components/Identity'
import Home from './components/Home'
import { CreateDocument, DocumentLibrary, SaveDocument } from './components/Document'
import { OfflineModule, ErrorModule } from './components/Modules'
import React from 'react'

const App : React.FC = () => 
{
    const { offline } = useDetectOffline()

    if(offline)
    {
        return <OfflineModule />
    }

    else
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path= '/' component = { Home } />
                    <Route exact path= '/identity/signup' component = { SignUp } />
                    <Route exact path= '/identity/signin' component = { SignIn } />
                    <Route exact path= '/identity/pwreset' component = { PasswordReset } />
                    <Route exact path= '/identity/signout' component = { SignOut } />
                    <Route exact path= '/account/storage' component = { AccountStorage } />
                    <Route exact path= '/account/update' component = { UpdateAccount } />
                    <Route exact path= '/account/close' component = { CloseAccount } />
                    <Route exact path= '/document/create' component = { CreateDocument } />
                    <Route exact path= '/document/library' component = { DocumentLibrary } />
                    <Route exact path= '/document/save/:id' component = { SaveDocument } />
                    <Route component = { ErrorModule } />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App