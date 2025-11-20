/* Task 2: Modificación de Contenido y Estilos (8 minutos)
Una vez seleccionado un elemento, podemos modificar su contenido y apariencia.*/


/*Modificación de Contenido*/ 
const titulo = document.querySelector('h1');

// Texto plano
titulo.textContent = 'Nuevo título';

// HTML (¡cuidado con XSS!)
titulo.innerHTML = '<span>Nuevo</span> título';

// Agregar contenido
const lista = document.querySelector('ul');
lista.innerHTML += '<li>Nuevo elemento</li>';

// Insertar texto al final
const parrafo = document.querySelector('p');
parrafo.textContent += ' Texto adicional.';


/*Modificación de Estilos*/
const caja = document.querySelector('.caja');

// Estilo inline directo
caja.style.backgroundColor = 'blue';
caja.style.width = '200px';
caja.style.transform = 'rotate(45deg)';

// Múltiples estilos
Object.assign(caja.style, {
  backgroundColor: 'red',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
});

// Alternar clases CSS
const boton = document.querySelector('button');
boton.classList.add('activo');
boton.classList.remove('inactivo');
boton.classList.toggle('visible');

// Verificar clases
if (boton.classList.contains('activo')) {
  console.log('El botón está activo');
}

// Reemplazar clase
boton.classList.replace('activo', 'inactivo');


/*Modificación de Atributos*/
const imagen = document.querySelector('img');
const enlace = document.querySelector('a');

// Obtener atributos
const srcActual = imagen.getAttribute('src');
const hrefActual = enlace.getAttribute('href');

// Establecer atributos
imagen.setAttribute('alt', 'Nueva descripción');
enlace.setAttribute('target', '_blank');

// Atributos específicos para elementos comunes
imagen.src = 'nueva-imagen.jpg';
imagen.alt = 'Descripción alternativa';
enlace.href = 'https://nuevo-destino.com';
enlace.target = '_blank';

// Input elements
const input = document.querySelector('input');
input.value = 'Nuevo valor';
input.placeholder = 'Nuevo placeholder';
input.disabled = true;
input.checked = true; // para checkboxes/radio

// Remover atributos
imagen.removeAttribute('title');
enlace.removeAttribute('target');