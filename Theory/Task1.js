/*Task 1: Selección de Elementos DOM (8 minutos)
JavaScript proporciona múltiples métodos para acceder a elementos del DOM.
Métodos Básicos de Selección*/

/*Seleccionar por ID*/
const header = document.getElementById('header');

// Seleccionar por clase (primer elemento)
const primerArticulo = document.querySelector('.articulo');

// Seleccionar múltiples elementos por clase
const todosLosArticulos = document.querySelectorAll('.articulo');

// Seleccionar por tag name
const parrafos = document.getElementsByTagName('p');
const todosLosDivs = document.getElementsByTagName('div');

// Seleccionar por atributo name
const camposEmail = document.getElementsByName('email');


/*Selectores Avanzados con querySelector*/
// Selector CSS completo
const primerBotonPrimario = document.querySelector('button.btn-primary');
const ultimoElemento = document.querySelector('li:last-child');
const elementosImpares = document.querySelectorAll('tr:nth-child(odd)');

// Seleccionar dentro de un contexto específico
const contenedor = document.getElementById('contenedor');
const botonesDentro = contenedor.querySelectorAll('button');

// Pseudo-selectores
const elementosVisibles = document.querySelectorAll(':not(.hidden)');
const inputsRequeridos = document.querySelectorAll('input:required');
const linksExternos = document.querySelectorAll('a[href^="http"]');


/*Navegación por el DOM*/
const elemento = document.querySelector('.mi-elemento');

// Padres
const padreInmediato = elemento.parentElement;
const padreMasCercano = elemento.closest('.contenedor');

// Hijos
const primerHijo = elemento.firstElementChild;
const ultimoHijo = elemento.lastElementChild;
const todosLosHijos = elemento.children;

// Hermanos
const hermanoAnterior = elemento.previousElementSibling;
const hermanoSiguiente = elemento.nextElementSibling;
const todosLosHermanos = elemento.parentElement.children;