import express from 'express';
const router = express.Router();
import pool from '../pool.js';

router.post('/login', (req, res) => {
    const body = req.body;
    let exists = false;
    let table;

    if (body.account_type === 'member') {
        table = 'Members';
    } else if (body.account_type === 'trainer') {
        table = 'Trainers';
    } else {
        table = 'Admin';
    }
    
    pool.query(`SELECT * From ${table} WHERE username = $1`, [body.username.toLowerCase()], (error, results) => {
        if (error) throw error;
        if (results.rowCount > 0) exists = true;

        if (body.isLogin) {
            if (exists) {
                if (results.rows[0].passwrd === body.password) {
                    res.status(200).send();
                } else {
                    res.status(400).send("Wrong password")
                }
            } else {
                res.status(404).send("Account does not exist");
            }
        } else {
            if (exists) {
                res.status(409).send("Account already exists");
            } else {
                pool.query(`INSERT INTO ${table} (username, passwrd) VALUES ($1, $2)`, [body.username.toLowerCase(), body.password], (error, results) => {
                    if (error) throw error;
                    res.status(200).send();
                });
            }
        }
    });
});

router.post('/trainer', (req, res) => {
    const {username, start, end, method} = req.body;

    if (method === 'add') {
        pool.query('SELECT * From TrainerTimes WHERE username = $1 AND start_time < $2 AND end_time > $3', [username, end, start], (error, results) => {
            if (error) throw error;
            if (results.rowCount > 0) {
                res.status(409).send();
            } else {
                pool.query('INSERT INTO TrainerTimes (username, start_time, end_time, class, isgroup, count) VALUES ($1, $2, $3, false, false, 0)', [username, start, end], (error, results) => {
                    if (error) throw error;
                    res.status(200).send();
                });
            }
        });
    } else {
        pool.query('DELETE From TrainerTimes WHERE username = $1 AND start_time = $2 AND end_time = $3', [username, start, end], (error, results) => {
            if (error) throw error;
            res.status(200).send();
        });
    }
});

router.post('/rooms', (req, res) => {
    const { username, start_time, end_time, room } = req.body;
    pool.query('UPDATE TrainerTimes SET room = $1 WHERE username = $2 AND start_time = $3 AND end_time = $4', [room, username, start_time, end_time], (error, results) => {
        if (error) throw error;
        res.status(200).send();
    })
});

router.put('/update-password', (req, res) => {
    const { username, password, newPassword } = req.body;
    pool.query('SELECT * From Members WHERE username = $1', [username], (error, results) => {
        if (error) throw error;

        if (results.rows[0].passwrd !== password) {
            res.status(409).send();
        } else {
            pool.query('UPDATE Members SET passwrd = $1 WHERE username = $2', [newPassword, username], (error, results) => {
                if (error) throw error;
                res.status(200).send();
            });
        }
    });
});

router.post('/payment', (req, res) => {
    const { member, trainer, id, amount, add, count, room } = req.body;
    
    if (add) {
        pool.query('SELECT * FROM Payments WHERE id = $1 AND payfrom = $2', [id, member], (error, results) => {
            const query = (results.rows.length > 0) ?
            `UPDATE Payments SET cancel = false, amount = ${amount} WHERE id = ${id} AND payfrom = '${member}'`:
            `INSERT INTO Payments (id, payfrom, payto, amount, cancel) VALUES (${id}, '${member}', '${trainer}', ${amount}, false)`;

            pool.query(query, (error, results) => {
                if (error) throw error;
                pool.query('UPDATE TrainerTimes SET class = true, count = $1 WHERE id = $2', [count+1, id], (error, results) => {
                    if (error) throw error;
                    pool.query('INSERT INTO Registered VALUES ($1, $2)', [id, member], (error, results) => {
                        if (error) throw error;
                        res.status(200).send();
                    });
                });
            });
        });
        
    } else {
        pool.query('UPDATE Payments SET cancel = true WHERE id = $1 AND payfrom = $2', [id, member], (error, results) => {
            if (error) throw error;
            pool.query('DELETE FROM Registered WHERE id = $1 AND username = $2', [id, member], (error, results) => {
                if (error) throw error;
                const cls = (count - 1) === 0 ? false: true;
                const checkRoom = (count - 1) === 0 ? null: room;
                pool.query('UPDATE TrainerTimes SET class = $1, count = $2, room= $3 WHERE id = $4', [cls, count-1, checkRoom, id], (error, results) => {
                    if (error) throw error;
                    res.status(200).send();
                });
            });
        });
    }
    
})

router.put('/classes', (req, res) => {
    const { id, value } = req.body;

    pool.query('UPDATE TrainerTimes SET isgroup = $1 WHERE id = $2', [value, id], (error, results) => {
        if (error) throw error;
        res.status(200).send();
    });
});

router.post('/new-equipment', (req, res) => {
    const { equipment_name, equipment_serialNum, equipment_used } = req.body;
    pool.query('INSERT INTO Equipment (equipment_name, equipment_serialNum, equipment_used) VALUES ($1, $2, $3) RETURNING *', 
        [equipment_name, equipment_serialNum, equipment_used], 
        (error, results) => {
            if (error) {
                console.error("Error adding equipment:", error);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).send();
            }
        });
});

// For Fitness Goals
router.post('/goals', (req, res) => {
    const { username, goal } = req.body;
    pool.query('INSERT INTO FitnessGoals (username, goal) VALUES ($1, $2)', [username, goal], (error, results) => {
        if (error) {
            console.error("Error adding goal:", error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'Goal added successfully' });
        }
    });
});

router.put('/goals/:goalId', (req, res) => {
    const { goalId } = req.params;
    pool.query('UPDATE FitnessGoals SET completed = true WHERE goal_id = $1', [goalId], (error, results) => {
        if (error) {
            console.error("Error marking goal as completed:", error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Goal marked as completed' });
        }
    });
});

router.post('/health-metrics/:username', (req, res) => {
    const { height, weight, bpm, bloodPressure, sleepDuration, dailySteps, calorieIntake } = req.body;
    const { username } = req.params;
  
    pool.query('INSERT INTO HealthMetrics (username, height, weight, bpm, blood_pressure, sleep_duration, daily_steps, calorie_intake) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [username, height, weight, bpm, bloodPressure, sleepDuration, dailySteps, calorieIntake],
      (error, results) => {
        if (error) {
          console.error('Error storing health metrics:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.status(201).json({ message: 'Health metrics stored successfully' });
        }
      }
    );
});

export default router;