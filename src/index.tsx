import ReactDOM from 'react-dom'
import Root from './components/root'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import './index.css'

ReactDOM.render(<Root />, document.querySelector('#app'))
