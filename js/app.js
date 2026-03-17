// =======================
// ESTADO
// =======================
let tarjetas = [];
let idContador = 1;

const generarId = () => idContador++;

const leerCampo = (selector) => {
  const campo = document.querySelector(selector);
  const valor = campo.value.trim();
  campo.value = "";
  return valor;
};

const galeria = document.querySelector("#galeria");

// =======================
// CREAR TARJETA
// =======================
function crearElementoTarjeta({ id, titulo, descripcion, categoria }) {
  const tarjeta = document.createElement("article");

  tarjeta.classList.add("tarjeta", `categoria-${categoria}`);
  tarjeta.dataset.id = id;

  tarjeta.innerHTML = `
    <span class="badge">${categoria}</span>
    <h3>${titulo}</h3>
    <p>${descripcion}</p>
    <button class="btn-eliminar" data-id="${id}">Eliminar</button>
  `;

  return tarjeta;
}

// =======================
// CONTADOR
// =======================
function actualizarContador() {
  const visibles = galeria.querySelectorAll(".tarjeta:not(.oculta)").length;

  let contador = document.querySelector("#contador");

  if (!contador) {
    contador = document.createElement("p");
    contador.id = "contador";
    document.querySelector("#filtros").insertAdjacentElement("afterend", contador);
  }

  contador.textContent = `Mostrando ${visibles} tarjeta(s)`;

  const sinTarjetas = galeria.querySelectorAll(".tarjeta").length === 0;

  if (sinTarjetas) {
    galeria.innerHTML = `<p class="mensaje-vacio">No hay tarjetas. Crea la primera.</p>`;
  }
}

// =======================
// AGREGAR TARJETA
// =======================
function agregarTarjeta() {
  const titulo = leerCampo("#input-titulo");
  const descripcion = leerCampo("#input-descripcion");
  const categoria = document.querySelector("#select-categoria").value;

  if (!titulo || !descripcion) {
    alert("El título y la descripción son obligatorios.");
    return;
  }

  const nuevaTarjeta = {
    id: generarId(),
    titulo,
    descripcion,
    categoria
  };

  tarjetas.push(nuevaTarjeta);

  const elemento = crearElementoTarjeta(nuevaTarjeta);

  // Si había mensaje vacío, lo quita
  const msg = galeria.querySelector(".mensaje-vacio");
  if (msg) msg.remove();

  galeria.appendChild(elemento);

  actualizarContador();
}

document.querySelector("#btn-agregar")
  .addEventListener("click", agregarTarjeta);

// =======================
// ELIMINAR TARJETA (DELEGACIÓN)
// =======================
galeria.addEventListener("click", (e) => {
  if (!e.target.matches(".btn-eliminar")) return;

  const idEliminar = Number(e.target.dataset.id);

  tarjetas = tarjetas.filter(t => t.id !== idEliminar);

  // 🔥 CORRECCIÓN AQUÍ (data-id)
  const elementoTarjeta = galeria.querySelector(`[data-id="${idEliminar}"]`);

  if (elementoTarjeta) elementoTarjeta.remove();

  actualizarContador();
});

// =======================
// FILTROS
// =======================
const btnsFiltro = document.querySelectorAll(".btn-filtro");

btnsFiltro.forEach(btn => {
  btn.addEventListener("click", () => {

    btnsFiltro.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");

    const categoriaFiltro = btn.dataset.categoria;

    const todasLasTarjetas = galeria.querySelectorAll(".tarjeta");

    todasLasTarjetas.forEach(tarjeta => {

      if (categoriaFiltro === "todas") {
        tarjeta.classList.remove("oculta");
      } else {
        const coincide = tarjeta.classList.contains(`categoria-${categoriaFiltro}`);
        tarjeta.classList.toggle("oculta", !coincide);
      }

    });

    actualizarContador();
  });
});