const LINK_PLAYLIST = "https://dl.dropbox.com/scl/fi/w3uj6wnegls53e3hte2mp/Jaspion.txt?rlkey=n9n8liwcmbyqkmc4xamlha97y&s...
const IMAGEM_FALLBACK = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPjLVTM6mkdjoZlZppaxyXVEr-wDk4Ya1SD8C3LU...

...
  window.scrollTo({ top: 0, behavior: "smooth" });
}

carregarPlaylist();
Tool Call
Function Name:
Write
Arguments:
file_path:
/mnt/user-data/outputs/jaspion-separado/script.js
content:
const LINK_PLAYLIST = "https://dl.dropbox.com/scl/fi/w3uj6wnegls53e3hte2mp/Jaspion.txt?rlkey=n9n8liwcmbyqkmc4xamlha97y&st=rsfikahe&dl=1";
const IMAGEM_FALLBACK = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBPjLVTM6mkdjoZlZppaxyXVEr-wDk4Ya1SD8C3LUmcA&s";

const lista = document.getElementById("lista");
const player = document.getElementById("player");
const loading = document.getElementById("loading");

async function carregarPlaylist() {
  try {
    const resposta = await fetch(LINK_PLAYLIST);
    const data = await resposta.text();

    loading.style.display = "none";

    const itens = parsePlaylist(data);

    if (!itens.length) {
      loading.style.display = "block";
      loading.textContent = "NENHUM ITEM ENCONTRADO NA PLAYLIST";
      return;
    }

    itens.forEach((item) => criarCard(item));
  } catch (erro) {
    loading.textContent = "ERRO AO CARREGAR LISTA DROPBOX";
    console.error("Erro ao carregar playlist:", erro);
  }
}

function parsePlaylist(data) {
  const linhas = data.split("\n");
  const itens = [];

  let logo = "";
  let categoria = "";
  let nome = "";

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i].trim();

    if (linha.startsWith("#EXTINF")) {
      const logoMatch = linha.match(/tvg-logo="(.*?)"/);
      const grupoMatch = linha.match(/group-title="(.*?)"/);

      logo = logoMatch ? logoMatch[1] : "";
      categoria = grupoMatch ? grupoMatch[1] : "STREAM";
      nome = linha.split(",").pop()?.trim() || "SEM NOME";
    } else if (linha.startsWith("http")) {
      itens.push({
        nome,
        logo,
        categoria,
        url: linha
      });
    }
  }

  return itens;
}

function criarCard(item) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${item.logo || IMAGEM_FALLBACK}" alt="${item.nome}" />
    <div class="info">
      <h2>${item.nome || "SEM NOME"}</h2>
      <p>${item.categoria || "STREAM"}</p>
      <button type="button">ASSISTIR</button>
    </div>
  `;

  const imagem = card.querySelector("img");
  imagem.onerror = () => {
    imagem.src = IMAGEM_FALLBACK;
  };

  const botao = card.querySelector("button");
  botao.addEventListener("click", () => tocar(item.url));

  lista.appendChild(card);
}

function destruirHlsAtual() {
  if (window.hlsInstance) {
    window.hlsInstance.destroy();
    window.hlsInstance = null;
  }
}

function tocar(url) {
  destruirHlsAtual();

  if (url.includes(".m3u8")) {
    if (window.Hls && Hls.isSupported()) {
      window.hlsInstance = new Hls();
      window.hlsInstance.loadSource(url);
      window.hlsInstance.attachMedia(player);
      window.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        player.play().catch(() => {});
      });
    } else {
      player.src = url;
      player.play().catch(() => {});
    }
  } else {
    player.src = url;
    player.play().catch(() => {});
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

carregarPlaylist();
Response
Created file /mnt/user-data/outputs/jaspion-separado/script.js (3001 characters)
