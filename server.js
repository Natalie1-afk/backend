const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando OK");
});

// 🔥 RUTA IMPORTANTE
app.post("/evaluar", async (req, res) => {
  const data = req.body;

  const prompt = `
Eres experto en reclutamiento minero en Chile.

Evalúa este candidato:

${JSON.stringify(data)}

Entrega:
- Puntaje en %
- Estado (APTO / OBSERVADO / NO APTO)
- Análisis breve profesional
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const result = await response.json();

    res.json({
      resultado: result.output?.[0]?.content?.[0]?.text || "Sin respuesta"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});