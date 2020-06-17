import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './assets/main.css'

import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/css/pe-icon-7-stroke.css";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
)