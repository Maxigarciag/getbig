-- Create the database
CREATE DATABASE IF NOT EXISTS getbig;
USE getbig;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routines table
CREATE TABLE routines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    days_per_week INT NOT NULL
);

-- Exercise categories table
CREATE TABLE exercise_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Exercises table
CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    description TEXT,
    difficulty_level ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    FOREIGN KEY (category_id) REFERENCES exercise_categories(id)
);

-- Routine exercises table (junction table for routines and exercises)
CREATE TABLE routine_exercises (
    routine_id INT,
    exercise_id INT,
    day_of_week INT NOT NULL,
    sets INT NOT NULL,
    reps_min INT NOT NULL,
    reps_max INT NOT NULL,
    PRIMARY KEY (routine_id, exercise_id, day_of_week),
    FOREIGN KEY (routine_id) REFERENCES routines(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Progress tracking table
CREATE TABLE progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    exercise_id INT,
    weight DECIMAL(5,2),
    reps INT,
    date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Insert sample exercise categories
INSERT INTO exercise_categories (name, description) VALUES
('Pecho', 'Ejercicios para desarrollar los músculos pectorales'),
('Espalda', 'Ejercicios para fortalecer los músculos de la espalda'),
('Piernas', 'Ejercicios para desarrollar los músculos de las piernas'),
('Hombros', 'Ejercicios para desarrollar los deltoides'),
('Brazos', 'Ejercicios para bíceps y tríceps'),
('Core', 'Ejercicios para abdominales y core');

-- Insert sample exercises
INSERT INTO exercises (name, category_id, description, difficulty_level) VALUES
('Press de banca', 1, 'Ejercicio compuesto para pecho', 'intermedio'),
('Dominadas', 2, 'Ejercicio compuesto para espalda', 'intermedio'),
('Sentadillas', 3, 'Ejercicio compuesto para piernas', 'intermedio'),
('Press militar', 4, 'Ejercicio compuesto para hombros', 'intermedio'),
('Curl de bíceps', 5, 'Ejercicio de aislamiento para bíceps', 'principiante'),
('Plancha', 6, 'Ejercicio isométrico para core', 'principiante');

-- Insert sample routines
INSERT INTO routines (name, description, difficulty_level, days_per_week) VALUES
('Full Body', 'Rutina de cuerpo completo', 'principiante', 3),
('Upper Lower', 'Rutina dividida en superior e inferior', 'intermedio', 4),
('Push Pull Legs', 'Rutina dividida en empuje, tirón y piernas', 'avanzado', 6);

-- Insert sample routine exercises
INSERT INTO routine_exercises (routine_id, exercise_id, day_of_week, sets, reps_min, reps_max) VALUES
(1, 1, 1, 3, 8, 12),
(1, 2, 1, 3, 8, 12),
(1, 3, 2, 3, 8, 12),
(2, 1, 1, 4, 8, 12),
(2, 3, 2, 4, 8, 12),
(3, 1, 1, 4, 8, 12),
(3, 2, 2, 4, 8, 12),
(3, 3, 3, 4, 8, 12);