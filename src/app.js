import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import Summary from './summary/Summary';
import Estimate from './estimate/Estimate';
import Clear from './clear/Clear';

import './app.css';

class App extends React.Component {
    componentWillMount() {
        let storage = window.localStorage;

        if (!storage.getItem('auth')) {
            storage.setItem('auth', window.prompt('Please provide a valid Auth key:'));
            window.location.reload();
        }
    }

    render() {
        return (
            <Router>
                <main role="main" className="container">
                    <h2 className="mb-4">
                        <Link to="/">Savy</Link>
                    </h2>
                    <Route exact path="/" component={Summary}/>
                    <Route exact path="/summary" component={Summary}/>
                    <Route exact path="/estimate" component={Estimate}/>
                    <Route exact path="/clear" component={Clear}/>
                </main>
            </Router>
        );
    }
}

export default App;
