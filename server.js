import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando con MySQL:", err);
  } else {
    console.log("✅ Conexión establecida con MySQL 🚀");
  }
});

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error("❌ Error en registro:", err);
          res.status(500).json({ error: "Error en registro" });
          return;
        }
        
        const token = jwt.sign({ userId: results.insertId }, JWT_SECRET);
        res.json({ token, user: { id: results.insertId, username, email } });
      }
    );
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ error: "Error en registro" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err || results.length === 0) {
          res.status(401).json({ error: "Credenciales inválidas" });
          return;
        }
        
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
          res.status(401).json({ error: "Credenciales inválidas" });
          return;
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    );
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error en login" });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

// Protected routes
app.get("/api/progreso/:usuario_id", authenticateToken, (req, res) => {
  const usuarioId = req.params.usuario_id;
  if (req.user.userId !== parseInt(usuarioId)) {
    return res.status(403).json({ error: "No autorizado" });
  }
  
  db.query(
    "SELECT * FROM progress WHERE user_id = ?",
    [usuarioId],
    (err, results) => {
      if (err) {
        console.error("❌ Error al obtener progreso:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json(results);
      }
    }
  );
});

// Existing routes
app.get("/api/ejercicios/:rutina_id", (req, res) => {
  const rutinaId = req.params.rutina_id;
  db.query(
    "SELECT * FROM exercises WHERE routine_id = ?",
    [rutinaId],
    (err, results) => {
      if (err) {
        console.error("❌ Error al obtener ejercicios:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json(results);
      }
    }
  );
});

app.get("/api/rutinas", (req, res) => {
  db.query("SELECT * FROM routines", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener rutinas:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(results);
    }
  });
});

app.get("/api/rutinas-posibles", (req, res) => {
  db.query("SELECT * FROM routine_exercises", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener rutinas posibles:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});