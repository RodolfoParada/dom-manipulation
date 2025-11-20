 // Elementos del DOM
    const inputTarea = document.getElementById('input-tarea');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnLimpiar = document.getElementById('btn-limpiar-completadas');
    const listaTareas = document.getElementById('lista-tareas');
    const emptyState = document.querySelector('.empty-state');
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const stats = {
      total: document.getElementById('total-tareas'),
      completadas: document.getElementById('tareas-completadas'),
      pendientes: document.getElementById('tareas-pendientes')
    };

    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    let filtroActual = 'todas';

    // Funciones de utilidad
    function guardarTareas() {
      localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function actualizarEstadisticas() {
      const total = tareas.length;
      const completadas = tareas.filter(t => t.completada).length;
      const pendientes = total - completadas;

      stats.total.textContent = total;
      stats.completadas.textContent = completadas;
      stats.pendientes.textContent = pendientes;

      btnLimpiar.style.display = completadas > 0 ? 'block' : 'none';
    }

    function crearElementoTarea(tarea) {
      const div = document.createElement('div');
      div.className = `tarea ${tarea.completada ? 'completed' : ''}`;
      div.dataset.id = tarea.id;

      // --- INICIO DE LO NUEVO: Hacer draggable ---
      div.setAttribute('draggable', 'true'); 
      
      // Evento: Cuando empiezas a arrastrar
      div.addEventListener('dragstart', () => {
          div.classList.add('dragging');
      });

      // Evento: Cuando sueltas (aquí guardamos el nuevo orden)
      div.addEventListener('dragend', () => {
          div.classList.remove('dragging');
          guardarOrdenDespuesDeMover(); // <--- Llamamos a la nueva función
      });

      // Si es una tarea vieja y no tiene categoría, asignamos 'general' por defecto
      const categoria = tarea.categoria || 'general';

      div.innerHTML = `
        <input type="checkbox" class="checkbox" ${tarea.completada ? 'checked' : ''}>
        <span class="texto-tarea">${tarea.texto}</span>
        <span class="etiqueta etiqueta-${categoria}" style="margin-left: 10px;">${categoria}</span>
        <input type="text" class="editor" value="${tarea.texto}" maxlength="100">
        <div class="acciones">
          <button class="btn btn-small btn-primary btn-editar">Editar</button>
          <button class="btn btn-small btn-danger btn-eliminar">Eliminar</button>
        </div>
      `;

      // Event listeners para la tarea
      const checkbox = div.querySelector('.checkbox');
      const btnEditar = div.querySelector('.btn-editar');
      const btnEliminar = div.querySelector('.btn-eliminar');
      const editor = div.querySelector('.editor');

      checkbox.addEventListener('change', () => {
        tarea.completada = checkbox.checked;
        div.classList.toggle('completed', tarea.completada);
        guardarTareas();
        actualizarEstadisticas();
        filtrarTareas();
      });

      btnEditar.addEventListener('click', () => {
        if (div.classList.contains('editando')) {
          // Guardar cambios
          const nuevoTexto = editor.value.trim();
          if (nuevoTexto) {
            tarea.texto = nuevoTexto;
            div.querySelector('.texto-tarea').textContent = nuevoTexto;
            guardarTareas();
          }
          div.classList.remove('editando');
          btnEditar.textContent = 'Editar';
        } else {
          // Entrar en modo edición
          div.classList.add('editando');
          editor.focus();
          editor.select();
          btnEditar.textContent = 'Guardar';
        }
      });

      btnEliminar.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
          div.classList.add('removing');
          setTimeout(() => {
            tareas = tareas.filter(t => t.id !== tarea.id);
            div.remove();
            guardarTareas();
            actualizarEstadisticas();
            mostrarEmptyState();
          }, 300);
        }
      });

      // Guardar al presionar Enter en el editor
      editor.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          btnEditar.click();
        } else if (e.key === 'Escape') {
          div.classList.remove('editando');
          editor.value = tarea.texto;
          btnEditar.textContent = 'Editar';
        }
      });

      return div;
    }

    function mostrarTareas() {
      listaTareas.innerHTML = '';
      let tareasFiltradas = tareas;

      switch (filtroActual) {
        case 'pendientes':
          tareasFiltradas = tareas.filter(t => !t.completada);
          break;
        case 'completadas':
          tareasFiltradas = tareas.filter(t => t.completada);
          break;
      }

      if (tareasFiltradas.length === 0) {
        mostrarEmptyState();
        return;
      }

      tareasFiltradas.forEach(tarea => {
        const elementoTarea = crearElementoTarea(tarea);
        listaTareas.appendChild(elementoTarea);
      });
    }

    function mostrarEmptyState() {
      if (tareas.length === 0) {
        listaTareas.innerHTML = '';
        listaTareas.appendChild(emptyState);
      }
    }

    function filtrarTareas() {
      mostrarTareas();
    }

    // Event listeners principales
    btnAgregar.addEventListener('click', (e) => {
      e.preventDefault();
      const texto = inputTarea.value.trim();
      const categoria = selectCategoria.value; 

      if (texto) {
        const nuevaTarea = {
          id: Date.now(),
          texto: texto,
          completada: false,
          categoria: categoria,
          fechaCreacion: new Date().toISOString()
        };

        tareas.push(nuevaTarea);
        inputTarea.value = '';
        selectCategoria.value = 'general';
        guardarTareas();
        actualizarEstadisticas();

        if (filtroActual === 'todas' || filtroActual === 'pendientes') {
          const elementoTarea = crearElementoTarea(nuevaTarea);
          if (listaTareas.contains(emptyState)) {
            listaTareas.innerHTML = '';
          }
          listaTareas.appendChild(elementoTarea);
        }
      }
    });

    // Agregar tarea al presionar Enter
    inputTarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnAgregar.click();
      }
    });

    // Filtros
    filtroBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filtroBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroActual = btn.dataset.filtro;
        filtrarTareas();
      });
    });

    // Limpiar tareas completadas
    btnLimpiar.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres eliminar todas las tareas completadas?')) {
        tareas = tareas.filter(t => !t.completada);
        guardarTareas();
        actualizarEstadisticas();
        filtrarTareas();
      }
    });

    // Inicialización
    actualizarEstadisticas();
    mostrarTareas();



// funcionalidad de modo oscuro/claro
const boton = document.getElementById('theme-btn');
const html = document.documentElement;

boton.addEventListener('click', () => {
    // Simplemente preguntamos: ¿Tiene el atributo puesto?
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme'); // Quita el modo oscuro
        boton.textContent = "🌙 Modo Oscuro";
    } else {
        html.setAttribute('data-theme', 'dark'); // Pone el modo oscuro
        boton.textContent = "☀️ Modo Claro";
    }
});

// selector de etiqueta/categoría
const selectCategoria = document.getElementById('select-categoria');

//selector de búsqueda en tiempo real
const inputBuscador = document.getElementById('input-buscador');

//funcionalidad de busqueda

function buscarTareas() {
    const texto = inputBuscador.value.toLowerCase().trim();

    // 1. Si el buscador está vacío, devolvemos el control a tu función original
    if (texto === "") {
        mostrarTareas(); // Vuelve a mostrar las tareas según los filtros (Pendientes/Todas)
        return;
    }

    // 2. Si hay texto, filtramos sobre TODAS las tareas existentes
    const tareasEncontradas = tareas.filter(tarea => 
        tarea.texto.toLowerCase().includes(texto)
    );

    // 3. Limpiamos la lista visualmente
    listaTareas.innerHTML = '';

    // 4. Mostramos los resultados o un mensaje de vacío
    if (tareasEncontradas.length === 0) {
        listaTareas.innerHTML = `
            <div class="empty-state">
                <p>No se encontró ninguna tarea que diga "${texto}"</p>
            </div>`;
    } else {
        // Reutilizamos tu función existente para pintar cada tarea encontrada
        tareasEncontradas.forEach(tarea => {
            const elemento = crearElementoTarea(tarea);
            listaTareas.appendChild(elemento);
        });
    }
}

// Evento que dispara la función cada vez que escribes
inputBuscador.addEventListener('input', buscarTareas);


//funcionalidad mover y soltar

// 1. Función para detectar dónde soltar la tarea
listaTareas.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necesario para permitir soltar
    
    // Detectamos cuál es el elemento que se está arrastrando
    const tareaArrastrada = document.querySelector('.dragging');
    if (!tareaArrastrada) return;

    // Buscamos sobre qué elemento estamos pasando el mouse
    const siguienteTarea = obtenerSiguienteElemento(e.clientY);

    // Si estamos al final, agregamos al final. Si no, insertamos antes del siguiente elemento.
    if (siguienteTarea) {
        listaTareas.insertBefore(tareaArrastrada, siguienteTarea);
    } else {
        listaTareas.appendChild(tareaArrastrada);
    }
});

// 2. Algoritmo para calcular la posición exacta (Matemática del DOM)
function obtenerSiguienteElemento(y) {
    // Seleccionamos todas las tareas que NO estamos arrastrando
    const tareasNoArrastradas = [...listaTareas.querySelectorAll('.tarea:not(.dragging)')];

    return tareasNoArrastradas.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2; // Distancia al centro de la caja

        // Si el offset es negativo (estamos arriba del centro) y es el más cercano a 0...
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 3. Función para Guardar el Nuevo Orden (Esta es la "moverTarea" que pediste)
function guardarOrdenDespuesDeMover() {
    // Solo guardamos si estamos viendo "Todas" y sin buscar (para evitar bugs visuales)
    if (filtroActual !== 'todas' || (inputBuscador && inputBuscador.value.trim() !== '')) {
        return; 
    }

    // Leemos el DOM actual para ver el nuevo orden visual
    const tareasVisuales = document.querySelectorAll('.tarea');
    const nuevoOrdenIds = Array.from(tareasVisuales).map(div => Number(div.dataset.id));

    // Reordenamos el array de datos 'tareas' basándonos en el visual
    const tareasReordenadas = [];
    nuevoOrdenIds.forEach(id => {
        const tareaEncontrada = tareas.find(t => t.id === id);
        if (tareaEncontrada) {
            tareasReordenadas.push(tareaEncontrada);
        }
    });

    // Actualizamos la variable principal y guardamos en LocalStorage
    tareas = tareasReordenadas;
    guardarTareas();
}