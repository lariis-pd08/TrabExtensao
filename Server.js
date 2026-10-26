require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const workspace = process.env.COUNTER_WORKSPACE || "larissas-team-5919";
const token = process.env.COUNTER_TOKEN; // nome da variável no .env
const slug = process.env.COUNTER_SLUG || "contadorDireito";

if (!token) {
  console.error("COUNTER_TOKEN não encontrado no arquivo .env");
  process.exit(1);
}

const baseUrl = `https://api.counterapi.dev/v2/${workspace}/${slug}`;

// Serve apenas a pasta "public" (assim .env e server.js não ficam expostos)
app.use(express.static(path.join(__dirname, "public")));

async function consultarCounterAPI(incrementar = false) {
  const url = incrementar ? `${baseUrl}/up` : baseUrl;

  const resposta = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    console.error("CounterAPI recusou:", resposta.status, dados);
    throw new Error(`A API recusou a solicitação (HTTP ${resposta.status}).`);
  }

  return dados;
}

// Registra uma visita (+1)
app.post("/api/visita", async (req, res) => {
  try {
    const dados = await consultarCounterAPI(true);
    res.json(dados);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: "Não foi possível registrar a visita." });
  }
});

// Apenas consulta o total, sem incrementar
app.get("/api/visitas", async (req, res) => {
  try {
    const dados = await consultarCounterAPI(false);
    res.json(dados);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: "Não foi possível consultar as visitas." });
  }
});

app.listen(PORT, () => {
  console.log(`Direito Nosso: http://localhost:${PORT}`);
});