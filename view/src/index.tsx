//Import Statements
import ReactDOM from 'react-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.sass'
import App from './App'

//React Render
ReactDOM.render(<App />, document.getElementById('root'))

//Register Service Worker
serviceWorkerRegistration.register()