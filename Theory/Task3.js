/*Task 3: Event Listeners - Escuchadores de Eventos (8 minutos)
Los eventos permiten que la página responda a interacciones del usuario.*/

/*Tipos de Eventos Comunes*/ 
const boton = document.querySelector('button');

// Click
boton.addEventListener('click', function(event) {
  console.log('Botón clickeado');
  event.preventDefault(); // Prevenir comportamiento por defecto
});

// Mouse events
boton.addEventListener('mouseenter', () => {
  boton.style.backgroundColor = 'lightblue';
});

boton.addEventListener('mouseleave', () => {
  boton.style.backgroundColor = '';
});

// Keyboard events
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    console.log('Enter presionado');
  }
});

// Form events
const formulario = document.querySelector('form');
formulario.addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('Formulario enviado');
});

// Input events
const input = document.querySelector('input');
input.addEventListener('input', function(event) {
  console.log('Valor cambió a:', event.target.value);
});

input.addEventListener('focus', () => {
  input.style.borderColor = 'blue';
});

input.addEventListener('blur', () => {
  input.style.borderColor = '';
});


/*Event Delegation*/
// En lugar de agregar listeners a cada elemento individual
const lista = document.querySelector('ul');

// Agregar listener al contenedor padre
lista.addEventListener('click', function(event) {
  // Verificar si el elemento clickeado es un LI
  if (event.target.tagName === 'LI') {
    console.log('Elemento de lista clickeado:', event.target.textContent);
    event.target.classList.toggle('completado');
  }
});

// Para elementos dinámicos
function agregarTarea(texto) {
  const li = document.createElement('li');
  li.textContent = texto;
  lista.appendChild(li);
  // No necesitamos agregar listeners individuales
}

agregarTarea('Nueva tarea 1');
agregarTarea('Nueva tarea 2');


/*Objeto Event y Métodos Útiles*/ 
boton.addEventListener('click', function(event) {
  // Información del evento
  console.log('Tipo de evento:', event.type);
  console.log('Elemento objetivo:', event.target);
  console.log('Elemento actual:', event.currentTarget);

  // Posición del mouse
  console.log('Posición X:', event.clientX);
  console.log('Posición Y:', event.clientY);

  // Teclas modificadoras
  if (event.ctrlKey) console.log('Control presionado');
  if (event.shiftKey) console.log('Shift presionado');
  if (event.altKey) console.log('Alt presionado');

  // Prevenir comportamiento por defecto
  event.preventDefault();

  // Detener propagación
  event.stopPropagation();
});