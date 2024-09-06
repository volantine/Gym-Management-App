import express from 'express';
import pool from '../pool.js';
const router = express.Router();

router.get('/trainer', (req, res) => {
    const { username } = req.query;
    pool.query('SELECT * FROM TrainerTimes WHERE username = $1', [username], (error, results) => {
        try {
            if (error) throw error;
            res.status(200).json(results.rows);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal error');
        }
    });
});

router.get('/classes', (req, res) => {
    pool.query('SELECT * FROM TrainerTimes WHERE class = true ORDER BY start_time', (error, results) => {
        try {
            if (error) throw error;
            res.status(200).json(results.rows);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal error');
        }
    });
});

router.get('/trainers', (req, res) => {
    const { username } = req.query;
    pool.query('SELECT * FROM Registered WHERE username = $1', [username], (error1, results1) => {
        try {
            if (error1) throw error1;
            pool.query('SELECT * From TrainerTimes ORDER BY start_time', (error2, results2) => {
                if (error2) throw error2;
                let results = results2.rows.filter(row => {

                    for (let each of results1.rows) {
                        if (row.id === each.id) {
                            row['registered'] = true;
                            return true;
                        }
                    }

                    if (!row.class || (row.class && row.isgroup)) {
                        return true;
                    } else {
                        return false;
                    }
                });

                res.status(200).json(results);
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal error');
        }
    });
});

router.get('/billing', (req, res) => {
    pool.query('SELECT * FROM Payments', (error, results) => {
        try {
            if (error) throw error;
            res.status(200).json(results.rows);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal error');
        }

    });
});

router.get('/groups', (req, res) => {
    pool.query(`SELECT * From TrainerTimes
                WHERE class = false OR isgroup = true 
                ORDER BY start_time`, (error, results) => {
        try {
            if (error) throw error;
            res.status(200).json(results.rows);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal error');
        }
    });
});

router.get('/equipment', (req, res) => {
    pool.query('SELECT * FROM Equipment', (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
});

// For Fitness Goals
router.get('/goals/:username', (req, res) => {
    const { username } = req.params;
    pool.query('SELECT * FROM FitnessGoals WHERE username = $1', [username], (error, results) => {
        if (error) {
            console.error("Error fetching goals:", error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ goals: results.rows });
        }
    });
});

// For Completed Fitness Goals
router.get('/completed-goals/:username', (req, res) => {
    const { username } = req.params;
    pool.query('SELECT * FROM FitnessGoals WHERE username = $1 AND completed = true', [username], (error, results) => {
        if (error) {
            console.error("Error fetching completed goals:", error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ completedGoals: results.rows });
        }
    });
});

router.get('/health-metrics/:username', (req, res) => {
    const { username } = req.params;
    pool.query('SELECT * FROM HealthMetrics WHERE username = $1 ORDER BY metric_id DESC LIMIT 5', [username], (error, results) => {
        if (error) {
            console.error("Error fetching health metrics:", error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(results.rows);
        }
    });
});

router.get('/exercise-routines', (req, res) => {
    pool.query('SELECT * FROM ExerciseRoutines', (error, results) => {
      if (error) {
        console.error("Error fetching exercise routines:", error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json(results.rows);
      }
    });
});

router.get('/search', (req, res) => {
    const { string } = req.query;
    const queryString = `%${string}%`;

    pool.query('SELECT username From Members WHERE username LIKE $1', [queryString], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
});

export default router;