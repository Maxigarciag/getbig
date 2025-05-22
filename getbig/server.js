import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2";

dotenv.config(); // ✅ Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // ✅ Permitir envío de JSON en las solicitudes

// 🔥 Configuración de conexión con MySQL
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

// 🔹 Ruta para obtener el progreso del usuario
app.get("/api/progreso/:usuario_id", (req, res) => {
  const usuarioId = req.params.usuario_id;
  db.query("SELECT * FROM progreso WHERE usuario_id = ?", [usuarioId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener progreso:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Ruta para agregar nuevos registros de progreso
app.post("/api/progreso", (req, res) => {
  const { usuario_id, ejercicio_id, peso, repeticiones, rendimiento_semanal, comentarios_usuario } = req.body;
  db.query(
    "INSERT INTO progreso (usuario_id, ejercicio_id, peso, repeticiones, rendimiento_semanal, comentarios_usuario) VALUES (?, ?, ?, ?, ?, ?)",
    [usuario_id, ejercicio_id, peso, repeticiones, rendimiento_semanal, comentarios_usuario],
    (err, results) => {
      if (err) {
        console.error("❌ Error al registrar progreso:", err);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.json({ success: true, message: "Progreso registrado correctamente", id: results.insertId });
      }
    }
  );
});

// 🔹 Ruta para obtener ejercicios
app.get("/api/ejercicios/:rutina_id", (req, res) => {
  const rutinaId = req.params.rutina_id;
  db.query("SELECT * FROM ejercicios WHERE rutina_id = ?", [rutinaId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener ejercicios:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      console.log("✅ Ejercicios obtenidos en el backend:", results);
      res.json(results);
    }
  });
});
app.get("/api/rutinas", (req, res) => {
  db.query("SELECT * FROM rutinas", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener rutinas:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      res.json(results);
    }
  });
});
app.get("/api/rutinas-posibles", (req, res) => {
  db.query("SELECT * FROM rutinas_posibles", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener rutinas posibles:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    } else {
      console.log("✅ Rutinas posibles obtenidas:", results); // 🔍 Verificación en consola
      res.json(results);
    }
  });
});
app.get("/", (req, res) => {
  res.send("<h1>🚀 Bienvenido a GetBig API</h1>");
});
// 🔥 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});