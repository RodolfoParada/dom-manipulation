document.addEventListener('DOMContentLoaded', () => {

    // ELEMENTOS DEL DOM
    const inputTarea = document.getElementById('input-tarea');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnLimpiar = document.getElementById('btn-limpiar-completadas');
    const listaTareas = document.getElementById('lista-tareas');
    const emptyState = document.querySelector('.empty-state');
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    
    // Nuevos Elementos (Selectores y Buscador)
    const selectCategoria = document.getElementById('select-categoria');
    const inputBuscador = document.getElementById('input-buscador');
    const exportContainer = document.getElementById('export-container');

    const stats = {
        total: document.getElementById('total-tareas'),
        completadas: document.getElementById('tareas-completadas'),
        pendientes: document.getElementById('tareas-pendientes')
    };

    //ESTADO INICIAL
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    let filtroActual = 'todas';

    //FUNCIONES
    function guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    function actualizarEstadisticas() {
        const total = tareas.length;
        const completadas = tareas.filter(t => t.completada).length;
        const pendientes = total - completadas;

        if (stats.total) stats.total.textContent = total;
        if (stats.completadas) stats.completadas.textContent = completadas;
        if (stats.pendientes) stats.pendientes.textContent = pendientes;

        if (btnLimpiar) btnLimpiar.style.display = completadas > 0 ? 'block' : 'none';
    }

    function mostrarEmptyState() {
        listaTareas.innerHTML = '';
        if (emptyState) listaTareas.appendChild(emptyState);
    }

  
    //CREAR ELEMENTO 
    function crearElementoTarea(tarea) {
        const div = document.createElement('div');
        div.className = `tarea ${tarea.completada ? 'completed' : ''}`;
        div.dataset.id = tarea.id;

        // --- Drag & Drop (Atributos visuales) ---
        div.setAttribute('draggable', 'true');
        div.addEventListener('dragstart', () => {
            div.classList.add('dragging');
        });
        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
            guardarOrdenDespuesDeMover(); 
        });

        // Categoría por defecto
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

        /* -----------------------------------------------------------------
        Este código se desactivó porque creaba cientos de eventos innecesarios.
        Ahora se maneja con "Event Delegation" más abajo.
        -----------------------------------------------------------------

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
            // Lógica antigua de editar...
        });

        btnEliminar.addEventListener('click', () => {
            // Lógica antigua de eliminar...
        });
        -----------------------------------------------------------------
        */

        return div;
    }


    //RENDERIZADO Y FILTROS

    function mostrarTareas() {
        listaTareas.innerHTML = '';
        let tareasFiltradas = tareas;

        // Filtro 1: Pestañas
        switch (filtroActual) {
            case 'pendientes':
                tareasFiltradas = tareas.filter(t => !t.completada);
                break;
            case 'completadas':
                tareasFiltradas = tareas.filter(t => t.completada);
                break;
        }

        // Filtro 2: Buscador
        if (inputBuscador && inputBuscador.value.trim() !== "") {
            const textoBusqueda = inputBuscador.value.toLowerCase();
            tareasFiltradas = tareasFiltradas.filter(t => t.texto.toLowerCase().includes(textoBusqueda));
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

    function filtrarTareas() {
        mostrarTareas();
    }

    //EVENT LISTENER (AGREGAR)
    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        const texto = inputTarea.value.trim();
        const categoria = selectCategoria ? selectCategoria.value : 'general';

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
            if (selectCategoria) selectCategoria.value = 'general';
            
            guardarTareas();
            actualizarEstadisticas();
            mostrarTareas();
        }
    });

    inputTarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnAgregar.click();
        }
    });

    // Botones de Filtro
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtroBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroActual = btn.dataset.filtro;
            filtrarTareas();
        });
    });

    // Limpiar completadas
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (confirm('¿Eliminar todas las completadas?')) {
                tareas = tareas.filter(t => !t.completada);
                guardarTareas();
                actualizarEstadisticas();
                filtrarTareas();
            }
        });
    }

    
    // FUNCIONALIDADES EXTRA


    // --- 1. MODO OSCURO ---
    const themeBtn = document.getElementById('theme-btn');
    const html = document.documentElement;

    // Cargar preferencia
    if(localStorage.getItem('theme') === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if(themeBtn) themeBtn.textContent = "☀️ Modo Claro";
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                html.removeAttribute('data-theme');
                themeBtn.textContent = "🌙 Modo Oscuro";
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                themeBtn.textContent = "☀️ Modo Claro";
                localStorage.setItem('theme', 'dark');
            }
        });
    }


    //2. --- CATEGORÍAS/ETIQUETAS ---
    //  se creo el selector de categorias en el HTML
    //  const selectCategoria = document.getElementById('select-categoria');
    //  y se agrego en la  crearElementoTarea(tarea)



    //3 --- BUSCADOR TIEMPO REAL ---
    if (inputBuscador) {
        inputBuscador.addEventListener('input', () => {
            mostrarTareas();
        });
    }

    //4--- ARRASTRAR Y SOLTAR---
    listaTareas.addEventListener('dragover', (e) => {
        e.preventDefault();
        const tareaArrastrada = document.querySelector('.dragging');
        if (!tareaArrastrada) return;

        const siguienteTarea = obtenerSiguienteElemento(e.clientY);
        if (siguienteTarea) {
            listaTareas.insertBefore(tareaArrastrada, siguienteTarea);
        } else {
            listaTareas.appendChild(tareaArrastrada);
        }
    });

    function obtenerSiguienteElemento(y) {
        const tareasNoArrastradas = [...listaTareas.querySelectorAll('.tarea:not(.dragging)')];
        return tareasNoArrastradas.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function guardarOrdenDespuesDeMover() {
        // No guardar si hay filtros o búsqueda activa
        if (filtroActual !== 'todas' || (inputBuscador && inputBuscador.value.trim() !== '')) return;

        const idsVisuales = Array.from(document.querySelectorAll('.tarea')).map(div => Number(div.dataset.id));
        const tareasReordenadas = [];
        
        idsVisuales.forEach(id => {
            const t = tareas.find(x => x.id === id);
            if(t) tareasReordenadas.push(t);
        });

        tareas = tareasReordenadas;
        guardarTareas();
    }

    // ---EXPORTAR EXPORTAR DIFERENTES FORMATOS---
    if (exportContainer) {
        exportContainer.innerHTML = `
            <select id="formato-export" class="select-custom" style="padding: 5px; font-size: 0.8rem;">
                <option value="json">📄 JSON</option>
                <option value="csv">📊 CSV</option>
                <option value="excel">📗 Excel</option>
            </select>
            <button id="btn-descargar" class="btn btn-primary btn-small">⬇️</button>
        `;

        const btnDescargar = document.getElementById('btn-descargar');
        if (btnDescargar) {
            btnDescargar.addEventListener('click', () => {
                if (tareas.length === 0) return alert("No hay tareas");
                
                const formato = document.getElementById('formato-export').value;
                
                if (formato === 'json') {
                    descargarArchivo(JSON.stringify(tareas, null, 2), 'tareas.json', 'application/json');
                } else if (formato === 'csv') {
                    let csv = "ID,Tarea,Categoria,Estado\n" + tareas.map(t => 
                        `${t.id},${t.texto.replace(/,/g,' ')},${t.categoria||'general'},${t.completada?'Si':'No'}`
                    ).join('\n');
                    descargarArchivo("\uFEFF"+csv, 'tareas.csv', 'text/csv;charset=utf-8;');
                } else if (formato === 'excel') {
                    let xls = `
                        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                        <head><meta charset="UTF-8"></head><body><table border="1"><thead><tr style="background:#4CAF50;color:white"><th>Tarea</th><th>Cat</th><th>Estado</th></tr></thead><tbody>
                        ${tareas.map(t => `<tr style="background:${t.completada?'#d4edda':'#fff'}"><td>${t.texto}</td><td>${t.categoria||'gen'}</td><td>${t.completada?'OK':'Pend'}</td></tr>`).join('')}
                        </tbody></table></body></html>`;
                    descargarArchivo(xls, 'tareas.xls', 'application/vnd.ms-excel');
                }
            });
        }
    }

    function descargarArchivo(content, name, mime) {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    
    // INICIALIZACIÓN
    actualizarEstadisticas();
    mostrarTareas();


    // 6. EVENT DELEGATION  OPTIMIZA EL RENDIMIENTO EVITANDO MANIPULACIONES INNECESARIAS DEL DOM
    listaTareas.addEventListener('click', (e) => {
        const target = e.target;
        const elementoTarea = target.closest('.tarea');

        if (!elementoTarea) return; // Click fuera de tarea

        const id = Number(elementoTarea.dataset.id);
        const tarea = tareas.find(t => t.id === id);

        if (!tarea) return;

        // A. CHECKBOX
        if (target.classList.contains('checkbox')) {
            tarea.completada = target.checked;
            elementoTarea.classList.toggle('completed', tarea.completada);
            guardarTareas();
            actualizarEstadisticas();
            // Si estamos en un filtro específico, refrescamos la vista
            if(filtroActual !== 'todas') mostrarTareas();
        }

        // B. ELIMINAR
        if (target.classList.contains('btn-eliminar')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                elementoTarea.classList.add('removing');
                setTimeout(() => {
                    tareas = tareas.filter(t => t.id !== id);
                    elementoTarea.remove(); // Borramos del DOM directamente
                    guardarTareas();
                    actualizarEstadisticas();
                    if(tareas.length === 0) mostrarEmptyState();
                }, 300);
            }
        }

        // C. EDITAR
        if (target.classList.contains('btn-editar')) {
            const editor = elementoTarea.querySelector('.editor');
            const textoSpan = elementoTarea.querySelector('.texto-tarea');

            if (elementoTarea.classList.contains('editando')) {
                // Guardar
                const nuevoTexto = editor.value.trim();
                if (nuevoTexto) {
                    tarea.texto = nuevoTexto;
                    textoSpan.textContent = nuevoTexto; // Actualizamos texto visual
                    guardarTareas();
                }
                elementoTarea.classList.remove('editando');
                target.textContent = 'Editar';
                mostrarTareas(); // Refrescar para acomodar etiquetas
            } else {
                // Editar
                elementoTarea.classList.add('editando');
                editor.focus();
                target.textContent = 'Guardar';
            }
        }
    });

    // Delegación para Teclado (Enter en input editor)
    listaTareas.addEventListener('keyup', (e) => {
        if (e.target.classList.contains('editor') && e.key === 'Enter') {
            const btnEditar = e.target.closest('.tarea').querySelector('.btn-editar');
            btnEditar.click();
        }
    });



});