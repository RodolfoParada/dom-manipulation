/*Task 4: Creación y Gestión Dinámica de Elementos (6 minutos)
JavaScript permite crear, modificar y eliminar elementos del DOM dinámicamente.*/


/*Creación de Elementos */
// Crear elemento
const nuevoDiv = document.createElement('div');
const nuevoParrafo = document.createElement('p');
const nuevaImagen = document.createElement('img');

// Establecer atributos
nuevaImagen.src = 'imagen.jpg';
nuevaImagen.alt = 'Descripción';
nuevaImagen.className = 'imagen-galeria';

// Establecer clases
nuevoDiv.classList.add('caja', 'nueva');

// Establecer estilos
nuevoDiv.style.backgroundColor = 'lightblue';
nuevoDiv.style.padding = '20px';

// Agregar contenido
nuevoParrafo.textContent = 'Este es un párrafo creado dinámicamente';

// Crear estructura compleja
const tarjeta = document.createElement('div');
tarjeta.className = 'tarjeta';

const titulo = document.createElement('h3');
titulo.textContent = 'Título de la tarjeta';

const descripcion = document.createElement('p');
descripcion.textContent = 'Descripción de la tarjeta';

tarjeta.appendChild(titulo);
tarjeta.appendChild(descripcion);



/*Inserción en el DOM*/
const contenedor = document.querySelector('.contenedor');

// Agregar al final
contenedor.appendChild(nuevoDiv);

// Agregar al inicio
contenedor.insertBefore(nuevoDiv, contenedor.firstChild);

// Insertar en posición específica
const referencia = contenedor.children[2];
contenedor.insertBefore(nuevoDiv, referencia);

// InsertAdjacentElement (más flexible)
contenedor.insertAdjacentElement('beforeend', nuevoDiv); // al final
contenedor.insertAdjacentElement('afterbegin', nuevoDiv); // al inicio
contenedor.insertAdjacentElement('beforebegin', nuevoDiv); // antes del elemento
contenedor.insertAdjacentElement('afterend', nuevoDiv); // después del elemento

// Insertar HTML directamente
contenedor.insertAdjacentHTML('beforeend', '<div class="nuevo">HTML insertado</div>');



/*Eliminación de Elementos*/
const elementoAEliminar = document.querySelector('.temporal');

// Método 1: remove()
elementoAEliminar.remove();

// Método 2: removeChild() desde el padre
const padre = elementoAEliminar.parentElement;
padre.removeChild(elementoAEliminar);

// Eliminar múltiples elementos
const elementosTemporales = document.querySelectorAll('.temporal');
elementosTemporales.forEach(elemento => elemento.remove());


/*Clonación de Elementos*/
const elementoOriginal = document.querySelector('.plantilla');

// Clonación superficial (sin eventos)
const clonSuperficial = elementoOriginal.cloneNode(false);

// Clonación profunda (con hijos y contenido)
const clonProfundo = elementoOriginal.cloneNode(true);

// Nota: Los event listeners no se copian automáticamente
// Hay que volver a agregarlos al clon