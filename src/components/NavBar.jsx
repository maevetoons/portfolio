import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-logo">
                    <h4>Maeve Chen</h4>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
