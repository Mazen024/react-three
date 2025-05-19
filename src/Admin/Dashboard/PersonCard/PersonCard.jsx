import { useState, React } from 'react';
import './PersonCard.css';
const PersonCard = ({givenOption}) => {
    const defaultValues = [
        'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5',
        'Option 6', 'Option 7', 'Option 8', 'Option 9', 'Option 10'
    ];
    
    const [selectedValues, setSelectedValues] = useState(defaultValues);
    
    const handleChange = (index, event) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = event.target.value;
        setSelectedValues(newSelectedValues);
    };
    
    const options = ['User', 'Admin', 'ShopOwner'];

    return (
        //Handle selecting options
        <div className='personCardContainer'>
            <div className="detailsOfPersonContainer">
                <img src='../OLP.jpg' alt="" className='imageOfPerson'/>
                <div className="userNameAndEmailContainer">
                    <span className='name'>Zeyad Ayman</span>
                    <span className='email'>zeyad@gmail.com</span>
                </div>
            </div>
            <div className="roleOfPerson">
                <select id="Role" value={selectedValues} onChange={handleChange}>
                    {/* <option value="">--Please choose an option--</option> */}
                    <option value={selectedValues}>{givenOption}</option>
                    {options.filter(option => option !== givenOption).map((option, index) => (
                        <option key={index} value={selectedValues}>{option}</option>
                    ))}
                </select>
            </div>
            <div className="dateOfJoiningContainer">
                <p>2/28/2025</p>
            </div>
            <input type="button" value="Edit" className='buttonOfEditPerson'/>
        </div>
    );
}

export default PersonCard;
