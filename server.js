require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API TalentiaPro funcionando 🚀");
});

// Evaluación de candidato
app.post("/api/evaluate", async (req, res) => {
  try {

    const data = req.body;

    const nombreCandidato = data.candidate?.nombre || "Candidato";

    const respuestas =
      data.assessment?.responses
        ?.map(r => `Pregunta: ${r.questionId}\nRespuesta: ${r.text}`)
        .join("\n\n") || "Sin respuestas";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },

      body: JSON.stringify({

        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "Eres un experto en reclutamiento minero chileno. Analiza las respuestas y entrega un puntaje del 1 al 100 y un dictamen técnico profesional.",
          },

          {
            role: "user",
            content: `Candidato: ${nombreCandidato}\n\nEvaluación:\n${respuestas}`,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok)
      throw new Error(result.error?.message || "Error OpenAI");

    res.json({
      result: result.choices[0].message.content,
    });

  } catch (error) {

    console.error("ERROR:", error.message);

    res.status(500).json({
      error: "Error en el servidor",
      detalle: error.message,
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor en puerto ${PORT}`)
);