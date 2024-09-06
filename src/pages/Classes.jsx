import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function Classes() {
    const [classes, setClasses] = useState([]);

    const fetchClasses = async () => {
        const response = await fetch('http://localhost:3000/groups');
        const results = await response.json();

        if (!response.ok) {
            alert('Could not fetch classes');
        } else {
            setClasses(results);
        }
    }

    const handleClass = async (index) => {
        const cls = classes[index];
        if (cls.isgroup && Number(cls.count) !== 0) return;

        const response = await fetch('http://localhost:3000/classes', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: cls.id,
                value: !cls.isgroup
            })
        });

        if (response.ok) {
            fetchClasses();
        }
    }

    useEffect(() => {
        fetchClasses();
    }, []);

    const formatTime = (time) => {
        return (new Date(time)).toLocaleString();
    }

    return (
        <div style={{ margin: '20px auto', maxWidth: '800px', color: 'white' }}>
            <h2 className="mb-4" style={{textAlign: 'center'}}>Class Schedule Updating</h2>
            {classes.map((cls, index) => {
                return (
                    <div className="mb-3" key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px'}}>
                        <p><strong>Trainer:</strong> {cls.username}</p>
                        <p><strong>Start Time:</strong> {formatTime(cls.start_time)}</p>
                        <p><strong>End Time:</strong> {formatTime(cls.end_time)}</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            {cls.isgroup ? (
                                <Button variant='danger' onClick={() => handleClass(index)}>Group Class {cls.class && `- ${cls.count} Registered`}</Button>
                            ): (
                                <Button variant='primary' onClick={() => handleClass(index)}>Make Group Class</Button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Classes;