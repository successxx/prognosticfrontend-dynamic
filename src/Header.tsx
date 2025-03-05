import React from 'react';
import headerImage from './assets/header.png';
import './index.css';

const Header: React.FC = () => (
    <div id="image03" className="image">
        <span className="frame">
            <a 
                href="https://clients.ai" 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <img src={headerImage} alt="Clients.ai"/>
            </a>
        </span>
    </div>
);

export default Header;
