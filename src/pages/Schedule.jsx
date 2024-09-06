import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

function Schedule() {
    const [trainers, setTrainers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTrainer, setModalTrainer] = useState(null);

    const fetchTrainers = async () => {
        const response = await fetch(`http://localhost:3000/trainers?username=${encodeURIComponent(localStorage.getItem('username'))}`);
        const results = await response.json();

        if (!response.ok) {
            alert('Failed to fetch trainers');
        } else {
            setTrainers(results);
        }
    }

    const makePayment = async (bool) => {
        const response = await fetch('http://localhost:3000/payment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                member: localStorage.getItem('username'),
                trainer: modalTrainer.username,
                id: modalTrainer.id,
                amount: payment(modalTrainer.isgroup),
                add: bool,
                count: modalTrainer.count,
                room: modalTrainer.room
            })
        });

        if (response.ok) {
            window.location.reload(true);
        }
    }
    
    const formatTime = (time) => (new Date(time)).toLocaleString();
    const formatDate = (time) => {
        return (new Date(time)).toLocaleString('en-US', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    }

    const handleModalOpen = (index) => {
        setModalTrainer(trainers[index]);
        setShowModal(true);
    }
    const handleModalHide = () => setShowModal(false);

    const payment = (isgroup) => {
        const start = new Date(modalTrainer.start_time);
        const end = new Date(modalTrainer.end_time);

        const diff = end - start;
        const x = isgroup ? 10: 15;
        return ((diff/1800000)*x);
    }

    useEffect(() => {
        fetchTrainers();
    }, []);

    return (
        <div style={{ margin: '20px auto', maxWidth: '800px', color: 'white' }}>
            {trainers.length === 0 ? (
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>No Trainer Slots</h2>
            ): (
                <>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Upcoming Trainer Slots</h2>
                    {trainers.map((trainer, index) => {
                        const currentDate = formatDate(trainer.start_time)
                        const prevTrainer = trainers[index-1];
                        const prevDate = prevTrainer ? formatDate(prevTrainer.start_time): null;

                        const button = !trainer.hasOwnProperty('registered') ? (
                            <Button variant='primary' onClick={() => handleModalOpen(index)}>Register {trainer.isgroup && `(Group Class)`}</Button>
                        ): (
                            <Button variant='success' onClick={() => handleModalOpen(index)}>Registered {trainer.isgroup && `(Group Class)`} {trainer.room && `- Room ${trainer.room}`}</Button>
                        );

                        return (
                            <div key={index} className='mb-4'>
                                {prevDate !== currentDate && (
                                    <h3>{currentDate}</h3>
                                )}
                                <Card key={index} style={{border: 'dotted'}}>
                                    <Card.Title>{trainer.username}</Card.Title>
                                    <Card.Text>Time: {formatTime(trainer.start_time)} - {new Date(trainer.end_time).toLocaleTimeString()}</Card.Text>
                                    {button}
                                </Card>
                            </div>
                        );
                    })}

                    <Modal show={showModal} onHide={handleModalHide}>
                        <Modal.Header closeButton>
                            <Modal.Title>Registration</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {modalTrainer && (
                                <>
                                    <p>
                                        <strong>{modalTrainer.username}, </strong>
                                        {formatTime(modalTrainer.start_time)} - {new Date(modalTrainer.end_time).toLocaleTimeString()}
                                    </p>
                                    {modalTrainer.hasOwnProperty('registered') ? (
                                        <h5 style={{color: 'green'}}>
                                            +${payment(modalTrainer.isgroup)}.00
                                        </h5>
                                    ): (
                                        <h5 style={{color: 'red'}}>
                                            -${payment(modalTrainer.isgroup)}.00
                                        </h5>
                                    )}
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer style={{display: 'flexbox', alignItems: 'center', justifyContent: 'center'}}>
                            {modalTrainer && 
                                (
                                    modalTrainer.hasOwnProperty('registered') ? (
                                        <Button variant='danger' onClick={() => makePayment(false)} style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Refund</Button>
                                    ): (
                                        <Button variant='success' onClick={() => makePayment(true)} style={{ fontSize: '1.2rem', padding: '10px 20px' }}>Pay</Button>
                                    )
                                )
                            }
                            
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
}

export default Schedule;