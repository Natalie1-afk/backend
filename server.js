const express = require("express");
const fetch = require("node-fetch"); // 👈 IMPORTANTE

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando OK");
});

app.get("/test", (req, res) => {
  res.send("FUNCIONA TEST OK");
});

// Endpoint principal
app.post("/evaluar", async (req, res) => {
  try {
    const data = req.body;

    console.log("Datos recibidos:", data);

    const prompt = `
Eres experto en reclutamiento minero en Chile.

Evalúa este candidato:
Nombre: ${data.nombre}
Experiencia: ${data.experiencia}
Cargo: ${data.cargo}

Entrega una evaluación breve y clara.
`;

    // 🔥 LLAMADA A API (ejemplo con OpenAI-like)
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // 👈 usa ENV en Render
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const result = await response.json();

    console.log("Respuesta API:", result);

    res.json({
      resultado:
        result.output?.[0]?.content?.[0]?.text ||
        "Sin respuesta de la IA"
    });

  } catch (error) {
    console.error("ERROR REAL:", error); // 👈 ahora verás el error real en Render

    res.status(500).json({
      error: "Error en el servidor",
      detalle: error.message
    });
  }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});