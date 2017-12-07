import React from 'react';

class Clear extends React.Component {

    componentWillMount() {
        let storage = window.localStorage;

        storage.removeItem('auth');

        window.location = '/';
    }

    render() {
        return <p>Removing auth…</p>
    }

}

export default Clear;