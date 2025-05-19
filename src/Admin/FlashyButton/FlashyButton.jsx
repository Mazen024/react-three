import React from 'react';
import './FlashyButton.css';

const FlashyButton = ({textInsideButton, handleClick}) => {
    return (
        <button className='flashyButton' onClick={handleClick}>
            <div>
                <span>{textInsideButton}</span>
            </div>
        </button>
    );
}

export default FlashyButton;
