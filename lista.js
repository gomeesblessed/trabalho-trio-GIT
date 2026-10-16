"use strict";

const CHAVE = "historico_atividades_v1";
const form = document.querySelector("#form-atividade");
const lista = document.querySelector("#lista");
const filtro = document.querySelector("#filtro");
const data = document.querySelector("#data");

function hojeLocal() {
  const agora = new Date();
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`;
}
data.value = hojeLocal();

function carregar() {
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
}
let atividades = carregar();

function salvar() {
  localStorage.setItem(CHAVE, JSON.stringify(atividades));
}

function formatarData(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
  const [ano, mes, dia] = valor.split("-");
  return `${dia}/${mes}/${ano}`;
}

function renderizar() {
  lista.replaceChildren();
  const concluidas = atividades.filter(item => item.concluida).length;
  document.querySelector("#total").textContent = atividades.length;
  document.querySelector("#concluidas").textContent = concluidas;
  document.querySelector("#pendentes").textContent = atividades.length - concluidas;

  const visiveis = atividades
    .filter(item => filtro.value === "todas" || (filtro.value === "concluidas" ? item.concluida : !item.concluida))
    .sort((a, b) => b.data.localeCompare(a.data) || b.criadaEm - a.criadaEm);
  document.querySelector("#vazio").hidden = visiveis.length > 0;

  visiveis.forEach(item => {
    const li = document.createElement("li");
    li.className = `atividade${item.concluida ? " feito" : ""}`;
    const conteudo = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = item.titulo;
    const meta = document.createElement("div");
    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = item.categoria;
    const dataTexto = document.createElement("small");
    dataTexto.textContent = formatarData(item.data) + (item.concluida ? " · Concluída" : " · Pendente");
    meta.append(etiqueta, dataTexto);
    conteudo.append(titulo, meta);
    if (item.descricao) {
      const descricao = document.createElement("p");
      descricao.textContent = item.descricao;
      conteudo.append(descricao);
    }
    const acoes = document.createElement("div");
    acoes.className = "acoes";
    const concluir = document.createElement("button");
    concluir.type = "button";
    concluir.className = "concluir";
    concluir.textContent = item.concluida ? "Reabrir" : "Concluir";
    concluir.addEventListener("click", () => {
      item.concluida = !item.concluida;
      salvar();
      renderizar();
    });
    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.className = "excluir";
    excluir.textContent = "Excluir";
    excluir.addEventListener("click", () => {
      if (!confirm(`Excluir a atividade "${item.titulo}"?`)) return;
      atividades = atividades.filter(atividade => atividade.id !== item.id);
      salvar();
      renderizar();
    });
    acoes.append(concluir, excluir);
    li.append(conteudo, acoes);
    lista.append(li);
  });
}

form.addEventListener("submit", evento => {
  evento.preventDefault();
  const titulo = document.querySelector("#titulo").value.trim();
  const descricao = document.querySelector("#descricao").value.trim();
  const categoria = document.querySelector("#categoria").value;
  if (!titulo || !data.value) return;
  atividades.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    titulo,
    descricao,
    categoria,
    data: data.value,
    concluida: false,
    criadaEm: Date.now()
  });
  salvar();
  form.reset();
  data.value = hojeLocal();
  renderizar();
  document.querySelector("#titulo").focus();
});
filtro.addEventListener("change", renderizar);
renderizar();
