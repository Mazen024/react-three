import React from 'react';
import './AdminCard.css'
// import "../OLP.jpg";
import { Link } from 'react-router';
const AdminCard = () => {
    return (
        <>
            <div className='userCardContainer'>
                <img src="../OLP.jpg" alt="" className='imageOfUser' />
                <div className='userNameAndAddressContainer'>
                    <span className='userNameTitle'>Zeyad Ayman</span>
                    <span className='addressTitle'>Saft El laban, Egypt</span>
                </div>
                <div className='containerOfButtons'>
                    <Link to="./showAdmin">
                        <input type="button" value="Show" className='button' />
                    </Link>
                    <Link to="./showAdmin">
                        <input type="button" value="Edit" className='button' />
                    </Link>
                </div>
            </div>    
        </>
    );
};


AdminCard.propTypes = {

};


export default AdminCard;
