require("dotenv").config();
const express = require("express");
const cors = require("cors");

// FIX node-fetch para versiones modernas de Node
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

// Datos de prueba para que el Panel Empresa funcione de inmediato
const candidatosSimulados = [
  { nombre: "Juan Pérez", puntaje: 85, nivel: "Alto", decision: "Entrevistar" },
  { nombre: "Ana Gómez", puntaje: 40, nivel: "Bajo", decision: "Rechazar" }
];

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando OK en Render");
});

app.get("/test", (req, res) => {
  res.send("FUNCIONA TEST OK");
});

// Endpoint para el Panel Empresa
app.get("/candidatos", (req, res) => {
  res.json(candidatosSimulados);
});

// Endpoint principal de Evaluación
app.post("/evaluar", async (req, res) => {
  try {
    const data = req.body;
    console.log("Datos recibidos para evaluar:", data);

    if (!data.nombre || !data.experiencia) {
        return res.status(400).json({ error: "Faltan datos del candidato" });
    }

    // Llamada correcta a OpenAI (Chat Completions)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // El modelo más eficiente y real
        messages: [
          {
            role: "system",
            content: "Eres un experto en reclutamiento minero en Chile (normativa DS132). Evalúa al candidato entregando: 1. Puntaje (1-100), 2. Nivel (Alto/Medio/Bajo), 3. Breve recomendación técnica."
          },
          {
            role: "user",
            content: `Candidato: ${data.nombre}. Cargo: ${data.cargo}. Experiencia: ${data.experiencia}.`
          }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error?.message || "Error en la API de OpenAI");
    }

    console.log("IA respondió correctamente");

    res.json({
      resultado: result.choices[0].message.content
    });

  } catch (error) {
    console.error("ERROR EN EL SERVIDOR:", error.message);
    res.status(500).json({
      error: "Error en el servidor",
      detalle: error.message
    });
  }
});

// Puerto dinámico obligatorio para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});