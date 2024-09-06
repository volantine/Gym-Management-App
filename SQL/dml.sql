INSERT INTO Members VALUES
('craig', '123'),
('daniel', '123');

INSERT INTO Trainers VALUES
('trainer', '123'),
('train', 'abc');

INSERT INTO Admin VALUES
('admin', '123');

INSERT INTO TrainerTimes (username, start_time, end_time, class, isgroup, room, count) VALUES
('trainer', '2024-04-01 08:00:00-04', '2024-04-01 09:00:00-04', TRUE, TRUE, 1, 2),
('trainer', '2024-04-05 10:00:00-04', '2024-04-05 11:00:00-04', FALSE, FALSE, NULL, 0),
('trainer', '2024-04-10 15:00:00-04', '2024-04-10 16:00:00-04', TRUE, FALSE, 3, 1),
('train', '2024-04-02 09:00:00-04', '2024-04-02 10:00:00-04', TRUE, TRUE, 1, 2),
('train', '2024-04-06 11:00:00-04', '2024-04-06 12:00:00-04', FALSE, FALSE, NULL, 0),
('train', '2024-04-12 16:00:00-04', '2024-04-12 17:00:00-04', TRUE, FALSE, 3, 1);

INSERT INTO Registered (id, username) VALUES
(1, 'craig'),
(1, 'daniel'),
(3, 'craig'),
(4, 'daniel'),
(4, 'craig'),
(6, 'craig');

INSERT INTO Payments (id, payfrom, payto, amount, cancel) VALUES
(1, 'craig', 'trainer', 20, FALSE),
(1, 'daniel', 'trainer', 20, FALSE),
(3, 'craig', 'trainer', 30, FALSE),
(4, 'daniel', 'train', 20, FALSE),
(4, 'craig', 'train', 20, FALSE),
(6, 'craig', 'train', 30, FALSE);

INSERT INTO FitnessGoals (username, goal, completed) VALUES
('craig', 'Get to 50lbs', TRUE),
('craig', 'Get to 25lbs', FALSE),
('daniel', 'Run 15 minutes', TRUE),
('daniel', 'Run 20 minutes', FALSE);

INSERT INTO HealthMetrics (username, height, weight, bpm, blood_pressure, sleep_duration, daily_steps, calorie_intake) VALUES
('craig', 1.8, 48, 120, '5/2', 8.5, 15000, 2000),
('daniel', 1.5, 159, 140, '3/2', 8.2, 5000, 2800);

INSERT INTO Equipment (equipment_name, equipment_serialNum, equipment_used) VALUES
('Treadmill', 'TM123456', 'Old'),
('Stationary Bike', 'SB789012', 'New'),
('Elliptical Trainer', 'ET345678', 'Old'),
('Rowing Machine', 'RM901234', 'New'),
('Smith Machine', 'SM567890', 'Old'),
('Leg Press Machine', 'LP123456', 'New'),
('Dumbbells', 'DB789012', 'Old'),
('Barbell', 'BB345678', 'New'),
('Bench Press', 'BP901234', 'Old'),
('Pull-up Bar', 'PU567890', 'New'),
('Resistance Bands', 'RB123456', 'Old'),
('Jump Rope', 'JR789012', 'New'),
('Medicine Ball', 'MB345678', 'Old'),
('Kettlebell', 'KB901234', 'New'),
('Yoga Mat', 'YM567890', 'Old');

INSERT INTO ExerciseRoutines (day, exercise_1, exercise_2, exercise_3, exercise_4, exercise_5)
VALUES 
('Monday','Squats', 'Push-ups', 'Lunges', 'Plank', 'Jumping Jacks'),
('Tuesday','Bicycle Crunches', 'Russian Twists', 'Leg Raises', 'Plank with Shoulder Taps', 'Mountain Climbers'),
('Wednesday','Bicep Curls', 'Tricep Dips', 'Shoulder Press', 'Bench Press', 'Pull-ups'),
('Thursday','Deadlifts', 'Step-ups', 'Glute Bridges', 'Leg Press', 'Calf Raises'),
('Friday','High Knees', 'Burpees', 'Jump Rope', 'Sprint Intervals', 'Box Jumps'),
('Saturday','Kettlebell Swings', 'Medicine Ball Slams', 'Battle Ropes', 'Farmers Walk', 'TRX Rows'),
('Sunday','Squat Jumps', 'Push-up Burpees', 'Mountain Climbers', 'Plank Jacks', 'Jump Lunges');