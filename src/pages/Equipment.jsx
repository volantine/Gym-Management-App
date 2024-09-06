import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import '../styles/Equipment.css';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [newEquipment, setNewEquipment] = useState({
        equipment_name: '',
        equipment_serialNum: '',
        equipment_used: ''
    });

    // Function to fetch equipment data from the server
    const fetchEquipment = async () => {
        try {
            const response = await fetch('http://localhost:3000/equipment');
            const results = await response.json();

            if (response.ok) {
                setEquipment(results);
            }
        } catch (error) {
            console.error('Error fetching equipment data:', error);
        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    // Function to handle input change for new equipment
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEquipment(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle adding new equipment
    const handleAddEquipment = async () => {
        const { equipment_name, equipment_serialNum, equipment_used } = newEquipment;
        if (equipment_name.trim() === '' || equipment_serialNum.trim() === '' || equipment_used === '') return;

        try {
            const response = await fetch('http://localhost:3000/new-equipment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newEquipment)
            });

            if (response.ok) {
                fetchEquipment(); // Fetch updated equipment list
                // Clear input fields after adding equipment
                setNewEquipment({
                    equipment_name: '',
                    equipment_serialNum: '',
                    equipment_used: ''
                });
            }
            
        } catch (error) {
            console.error('Error adding equipment:', error);
        }
    };

    return (
        <div className="container" style={{ color: 'white' }}> 
            <div className="equipment-list"> 
            <h2 className="mb-4 mt-3" style={{textAlign: 'center'}}>Equipment list</h2>
                <table className="equipment-table mb-4"> 
                    <thead style={{ color: 'black' }}>
                        <tr>
                            <th>Equipment Name</th>
                            <th>Equipment Serial Number</th>
                            <th>Equipment Condition</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: 'black' }}>
                        {equipment.map((item, index) => (
                            <tr key={index}>
                                <td>{item.equipment_name}</td>
                                <td>{item.equipment_serialnum}</td>
                                <td>{item.equipment_used}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="add-equipment">
                <h2>Order New Equipment</h2>
                <div className='mb-2'>
                    <label htmlFor="equipment_name">Equipment Name:</label>
                    <br />
                    <input type="text" name="equipment_name" value={newEquipment.equipment_name} onChange={handleInputChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="equipment_serialNum">Serial Number:</label>
                    <br />
                    <input type="text" name="equipment_serialNum" value={newEquipment.equipment_serialNum} onChange={handleInputChange} />
                </div>
                <div className='mb-3'>
                    <label>Used:</label>
                    <select name="equipment_used" value={newEquipment.equipment_used || ''} onChange={handleInputChange}>
                        <option value="" disabled>Select Used</option>
                        <option value="Old">Old</option>
                        <option value="New">New</option>
                    </select>
                    <div className='d-flex justify-content-center'>
                        <Button variant="success" style={{justifyContent: 'center'}} onClick={handleAddEquipment}>Place Order</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Equipment;
