import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import Summary from './summary/Summary';

import './app.css';

class App extends React.Component {
    componentWillMount() {
        let storage = window.localStorage;

        if (!storage.getItem('auth')) {
            storage.setItem('auth', window.prompt('Please provide a valid Auth key:'));
        }
    }

    render() {
        return (
            <Router>
                <main role="main" className="container">
                    <Route exact path="/" component={Summary}/>
                    <Route exact path="/summary" component={Summary}/>
                </main>
            </Router>
        );
    }
}

export default App;
