import React from 'react';
import { Link } from 'react-router-dom';

class Menu extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link to="/summary" className="nav-link active">
                                December '17 (current month)
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/summary/previous-months" className="nav-link">
                                Previous months
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/settings" className="nav-link">
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Menu;
