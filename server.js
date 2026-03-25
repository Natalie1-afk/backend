const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando OK");
});

// Ruta POST (tu API)
app.post("/api/evaluar", (req, res) => {
  const { texto } = req.body;

  console.log("Recibido:", texto);

  res.json({
    resultado: "Esto viene del backend 🚀",
  });
});

// Levantar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});