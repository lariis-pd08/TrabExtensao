// Coloque este arquivo em public/contador.js e inclua no HTML:
// <span id="contador">0</span>
// <script src="contador.js"></script>

async function atualizarContador() {
  const el = document.getElementById("contador");
  if (!el) return;

  try {
    // Conta só na primeira vez da sessão; nos recarregamentos apenas consulta
    const jaContou = sessionStorage.getItem("visitaContada");

    const res = jaContou
      ? await fetch("/api/visitas")
      : await fetch("/api/visita", { method: "POST" });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    el.textContent = json.data.up_count;

    if (!jaContou) sessionStorage.setItem("visitaContada", "1");
  } catch (err) {
    console.error("Erro no contador:", err);
    el.textContent = "—";
  }
}

atualizarContador();