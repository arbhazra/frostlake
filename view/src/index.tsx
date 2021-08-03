//Import Statements
import ReactDOM from 'react-dom'
import Routes from './routes'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import 'bootstrap/dist/css/bootstrap.min.css'
import './sass/index.sass'

//React Render
ReactDOM.render(<Routes />, document.getElementById('root'))

//Register Service Worker
serviceWorkerRegistration.register()