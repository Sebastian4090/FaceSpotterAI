import React from 'react';
import Tilt from 'react-parallax-tilt';
import face from './face.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2' style={{ height: 250, width: 250}}>
                 <div className="Tilt-inner pa3">
                    <img style={{paddingTop: '45px'}} src={face} alt="logo"/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;