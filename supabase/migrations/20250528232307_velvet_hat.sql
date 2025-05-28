-- Improve existing tables
ALTER TABLE usuarios
ADD INDEX idx_email (email),
ADD INDEX idx_nivel (nivel_entrenamiento),
ADD INDEX idx_objetivo (objetivo_fitness),
ADD CONSTRAINT chk_peso CHECK (peso > 0 AND peso < 500),
ADD CONSTRAINT chk_altura CHECK (altura > 0 AND altura < 300),
ADD CONSTRAINT chk_edad CHECK (edad > 0 AND edad < 120);

ALTER TABLE ejercicios
ADD INDEX idx_categoria (categoria),
ADD INDEX idx_musculo (musculo_grupo),
ADD INDEX idx_nivel (nivel_dificultad),
ADD FULLTEXT INDEX idx_descripcion (descripcion);

ALTER TABLE rutinas
MODIFY COLUMN dias JSON,
ADD INDEX idx_objetivo (objetivo),
ADD INDEX idx_nombre (nombre),
ADD CONSTRAINT chk_duracion CHECK (duracion_semanas > 0);

ALTER TABLE progreso
ADD INDEX idx_usuario_fecha (usuario_id, fecha_registro),
ADD INDEX idx_ejercicio (ejercicio_id),
ADD CONSTRAINT chk_peso_prog CHECK (peso > 0),
ADD CONSTRAINT chk_reps CHECK (repeticiones > 0);

-- Add trigger for progress tracking
DELIMITER //
CREATE TRIGGER before_progress_insert 
BEFORE INSERT ON progreso
FOR EACH ROW
BEGIN
    IF NEW.peso <= 0 OR NEW.repeticiones <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Weight and repetitions must be positive values';
    END IF;
END;//
DELIMITER ;

-- Add view for user progress summary
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    u.id AS user_id,
    u.nombre,
    e.nombre AS ejercicio,
    COUNT(p.id) AS total_sessions,
    MAX(p.peso) AS max_weight,
    AVG(p.repeticiones) AS avg_reps,
    MAX(p.fecha_registro) AS last_session
FROM usuarios u
LEFT JOIN progreso p ON u.id = p.usuario_id
LEFT JOIN ejercicios e ON p.ejercicio_id = e.id
GROUP BY u.id, e.id;

-- Add stored procedure for routine recommendation
DELIMITER //
CREATE PROCEDURE get_recommended_routine(
    IN p_objetivo VARCHAR(20),
    IN p_nivel VARCHAR(20),
    IN p_dias INT
)
BEGIN
    SELECT r.* 
    FROM rutinas r
    JOIN rutinas_posibles rp ON r.id = rp.rutina_id
    WHERE rp.objetivo = p_objetivo
    AND rp.dias = p_dias
    ORDER BY 
        CASE 
            WHEN p_nivel = 'Principiante' THEN r.duracion_semanas
            ELSE r.id 
        END
    LIMIT 1;
END //
DELIMITER ;