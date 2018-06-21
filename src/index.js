import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Container from './Components/Container';

ReactDOM.render(<Container />, document.getElementById('root'));
registerServiceWorker();
