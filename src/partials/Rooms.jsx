import React, { useState, useEffect } from 'react';
import { Pagination, Form, Button, Dropdown } from 'react-bootstrap';

function Rooms() {
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [classesPerPage] = useState(5);
    const [showNoRooms, setShowNoRooms] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        const response = await fetch('http://localhost:3000/classes');
        const results = await response.json();

        if (!response.ok) {
            alert('Could not fetch classes');
        } else {
            setClasses(results);
        }
    };

    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleAssignRoom = async (index, room) => {
        const response = await fetch('http://localhost:3000/rooms', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json'
           },
           body: JSON.stringify({
            username: classes[index].username,
            start_time: classes[index].start_time,
            end_time: classes[index].end_time,
            room: room
           })
        });

        if (!response.ok) {
            alert('Failed to update room');
        } else {
            fetchClasses();
        }
    }

    const handleRemoveRoom = async (index) => {
        const response = await fetch('http://localhost:3000/rooms', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json'
           },
           body: JSON.stringify({
            username: classes[index].username,
            start_time: classes[index].start_time,
            end_time: classes[index].end_time,
            room: null
           })
        });

        if (!response.ok) {
            alert('Failed to update room');
        } else {
            fetchClasses();
        }
    }


    const formatTime = (time) => {
        return (new Date(time)).toLocaleString();
    }

    const getAvailableRooms = (index) => {
        const startTime = new Date(classes[index].start_time);
        const endTime = new Date(classes[index].end_time);

        const allRooms = [1,2,3,4,5,6,7,8,9,10];
        let availableRooms = [];

        for (let room of allRooms) {
            let roomBooked = false;
            for (let i=0; i < classes.length; ++i) {
                if (i === index) continue;

                const cls = classes[i];
                const cStartTime = new Date(cls.start_time);
                const cEndTime = new Date(cls.end_time);

                if (cls.room === room && !(cStartTime >= endTime || cEndTime <= startTime)) {
                    roomBooked = true;
                    break;
                }
            }

            if (!roomBooked) availableRooms.push(room);
        }
        return availableRooms;
    }

    const indexify = index => classesPerPage*(currentPage-1) + index;
    
    if (classes.length === 0) {
        return (
            <div style={{ margin: '20px auto', maxWidth: '800px', color: 'white' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Room Booking Management</h2>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>No Classes Scheduled</h3>
            </div>
        );
    } else {
        return (
            <div style={{ margin: '20px auto', maxWidth: '800px', color: 'white' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Room Booking Management</h2>
                <div style={{ marginBottom: '20px' }}>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check 
                            type="checkbox" 
                            label="Show classes with no rooms assigned"
                            checked={showNoRooms}
                            onChange={() => setShowNoRooms(!showNoRooms)}
                        />
                    </Form.Group>
                </div>
                {currentClasses.map((cls, index) => {
                    
                    if (showNoRooms && cls.room) {
                        return null;
                    }
                    
                    return (<div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                        <p><strong>Trainer:</strong> {cls.username}</p>
                        <p><strong>Start Time:</strong> {formatTime(cls.start_time)}</p>
                        <p><strong>End Time:</strong> {formatTime(cls.end_time)}</p>
                        {cls.room && (<p><strong>Room:</strong> {cls.room}</p>)}
                        {cls.room && (
                            <Button variant="danger" onClick={() => handleRemoveRoom(indexify(index))}>Remove Room Assignment</Button>
                        )}
                        {!cls.room && (
                            <div>
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        Select Room
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {getAvailableRooms(indexify(index)).map(room => (
                                            <Dropdown.Item key={room} onClick={() => handleAssignRoom(indexify(index), room)}>Room {room}</Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        )}
                    </div>);
                })}
                <Pagination style={{ justifyContent: 'center' }}>
                    {Array.from({ length: Math.ceil(classes.length / classesPerPage) }).map((_, index) => (
                        <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        );
    }
}

export default Rooms;