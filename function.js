const carrito = document.querySelector('.Carrito-compras');
const apiUrl = 'https://script.google.com/macros/s/AKfycbwgSe35tOBtx8KPQhyx5OAXeEiRIyspWmmWwv02OqNwg2kWmYh0CrNxeJS0GtkLEPhHLA/exec';

// Función para abrir y cerrar el carrito
function abrirCarrito() {
    const carritoVisible = carrito.classList.contains('visible');
    const body = document.body;

    if (carritoVisible) {
        carrito.classList.remove('visible');
        body.classList.remove('no-scroll');
    } else {
        carrito.classList.add('visible');
        body.classList.add('no-scroll');
    }
}

// Función para agregar productos al carrito
function agregarProducto(nombre, precio) {
  const contenedorCarrito = document.querySelector('.productos-carrito');

  // Buscar si el producto ya existe en el carrito
  let productoExistente = null;
  const productos = contenedorCarrito.querySelectorAll('.producto');
  productos.forEach(producto => {
      if (producto.querySelector('.nombre-producto').textContent === nombre) {
          productoExistente = producto;
      }
  });

  if (productoExistente) {
      // Producto ya existe, actualizar la cantidad y el precio
      const cantidadSpan = productoExistente.querySelector('.cantidad-producto');
      const cantidadActual = parseInt(cantidadSpan.textContent) || 0;
      const nuevoCantidad = cantidadActual + 1;
      cantidadSpan.textContent = nuevoCantidad;

      // Actualizar el precio total del producto en el carrito
      const precioSpan = productoExistente.querySelector('.precio');
      const precioTotal = nuevoCantidad * precio;
      precioSpan.textContent = `Precio: $${precioTotal}`;

      // Actualizar el valor en el formulario oculto
      const inputCantidad = productoExistente.querySelector('input[name="cantidad"]');
      inputCantidad.value = nuevoCantidad;
  } else {
      // Producto no existe, crear un nuevo div para el producto
      const nuevoProductoDiv = document.createElement('div');
      nuevoProductoDiv.classList.add('producto');

      nuevoProductoDiv.innerHTML = `
          <h4 class="nombre-producto">${nombre}</h4>
          <span class="cantidad">
              <button onclick="actualizarCantidad('${nombre}', 1)">+</button>
              <span class="cantidad-producto">1</span>
              <button onclick="actualizarCantidad('${nombre}', -1)">-</button>
          </span>
          <span class="precio">Precio: $${precio}</span>
          <button class="eliminar" onclick="eliminarProducto(this.parentElement)">
              <span class="material-symbols-outlined">delete</span>
          </button>
          <!-- Formulario oculto para capturar los datos -->
          <form class="formulario-producto" style="display: none;">
              <input type="text" name="nombre" value="${nombre}">
              <input type="number" name="cantidad" value="1">
          </form>
      `;

      contenedorCarrito.appendChild(nuevoProductoDiv);
  }

  // Mostrar el carrito si está vacío
  if (contenedorCarrito.children.length > 0) {
      const asideCarrito = document.querySelector('aside');
      asideCarrito.style.display = 'block';
  }

  // Actualizar contador de botones agregar
  actualizarContador(nombre);
  actualizarSubtotalYTotal();
}


// Función para actualizar la cantidad de productos en el carrito
function actualizarCantidad(nombre, incremento) {
    const contenedorCarrito = document.querySelector('.productos-carrito');
    const producto = Array.from(contenedorCarrito.querySelectorAll('.producto')).find(p => p.querySelector('.nombre-producto').textContent === nombre);

    if (producto) {
        const cantidadSpan = producto.querySelector('.cantidad-producto');
        const cantidadActual = parseInt(cantidadSpan.textContent) || 0;
        const nuevaCantidad = cantidadActual + incremento;

        if (nuevaCantidad > 0) {
            cantidadSpan.textContent = nuevaCantidad;

            // Actualizar el precio total del producto en el carrito
            const precio = parseFloat(producto.querySelector('.precio').textContent.replace('Precio: $', ''));
            const precioTotal = nuevaCantidad * precio / cantidadActual;
            producto.querySelector('.precio').textContent = `Precio: $${precioTotal}`;
        } else {
            eliminarProducto(producto);
        }
    }

    // Actualizar contador y subtotales
    actualizarContador(nombre);
    actualizarSubtotalYTotal();
}

// Función para eliminar productos del carrito
function eliminarProducto(productoDiv) {
    productoDiv.remove();

    const contenedorCarrito = document.querySelector('.productos-carrito');
    if (contenedorCarrito.children.length === 0) {
        const asideCarrito = document.querySelector('aside');
        asideCarrito.style.display = 'none';
    }

    // Actualizar subtotales
    actualizarSubtotalYTotal();
}

// Función para actualizar el contador de los productos
function actualizarContador(nombre) {
    const botonAgregar = document.querySelector(`#${nombre.replace(/\s+/g, '-')}`);
    if (!botonAgregar) return;

    const contadorAgregar = botonAgregar.querySelector('.contador');
    const cantidadActual = parseInt(contadorAgregar.textContent) || 0;

    contadorAgregar.textContent = cantidadActual + 1;

    // Actualizar el contador del botón de agregar principal
    const botonAgregarPrincipal = document.querySelector('.agregar-principal');
    const contadorPrincipal = botonAgregarPrincipal.querySelector('.contador-principal');
    const cantidadTotal = Array.from(document.querySelectorAll('.cantidad-producto'))
        .reduce((sum, el) => sum + (parseInt(el.textContent) || 0), 0);
    contadorPrincipal.textContent = cantidadTotal;
}

// Funciones para el cálculo del subtotal y el total
function calcularSubtotal() {
    const productos = document.querySelectorAll('.producto');
    let subtotal = 0;

    productos.forEach(producto => {
        const precioText = producto.querySelector('.precio').textContent.replace('Precio: $', '');
        const cantidadText = producto.querySelector('.cantidad-producto').textContent;

        if (!isNaN(precioText) && !isNaN(cantidadText)) {
            const precio = parseFloat(precioText);
            const cantidad = parseInt(cantidadText);
            subtotal += precio * cantidad;
        }
    });

    return subtotal;
}

function calcularTotal() {
    const subtotal = calcularSubtotal();
    const impuesto = 0.16; // 16% de impuesto
    const total = subtotal + (subtotal * impuesto);

    return total;
}

function actualizarSubtotalYTotal() {
    const subtotal = calcularSubtotal();
    const total = calcularTotal();

    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.total').textContent = `$${total.toFixed(2)}`;
}

// Función para vaciar el carrito
function vaciar_carrito() {
    const contenedorCarrito = document.querySelector('.productos-carrito');
    contenedorCarrito.innerHTML = ''; // Vaciar el carrito
    actualizarSubtotalYTotal();
}

// Función para cargar productos desde la API
function cargarProductos() {
    fetch(apiUrl)
        .then(response => response.json())  // Convierte la respuesta a JSON
        .then(data => {
            const productos = data.data;  // Accede a los productos desde la API
            mostrarProductos(productos);  // Llama a la función para mostrar los productos en cada categoría
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

// Función para mostrar productos desde la API
function mostrarProductos(productos) {
    const entradasElement = document.querySelector('.informacion_Entradas');
    const platosFuertesElement = document.querySelector('.informacion_fuerte');
    const postresElement = document.querySelector('.informacion_postres');
    const bebidasElement = document.querySelector('.informacion_bebidas');
    const coctelesElement = document.querySelector('.informacion_cocteles');

    productos.forEach(producto => {
        const productoHTML = `
            <div>
                <h2>${producto.Nombre}
                    <button class="agregar" id="${producto.Nombre.replace(/\s+/g, '-')}" onclick="agregarProducto('${producto.Nombre}', ${producto.Precio})">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                        <span class="contador"></span>
                    </button>
                </h2>
                <div class="carrito">
                    <h4>${producto.Descripción}</h4>
                    <p class="precio">$${producto.Precio}</p>
                </div>
            </div>
        `;

        switch (producto.Categoria) {
            case 'Entrada':
                entradasElement.innerHTML += productoHTML;
                break;
            case 'Fuerte':
              platosFuertesElement.innerHTML += productoHTML;
              break;
          case 'Postre':
              postresElement.innerHTML += productoHTML;
              break;
          case 'Bebidas frias':
              bebidasElement.innerHTML += productoHTML;
              break;
          case 'Coctel':
              coctelesElement.innerHTML += productoHTML;
              break;
          default:
              console.error('Categoría no reconocida:', producto.Categoria);
      }
  });
}

function irCaja() {
  const productos = [];
  const formulariosProductos = document.querySelectorAll('.formulario-producto');

  // Recorrer todos los formularios ocultos para capturar los datos
  formulariosProductos.forEach(form => {
      const nombreProducto = form.querySelector('input[name="nombre"]').value;
      const cantidadProducto = form.querySelector('input[name="cantidad"]').value;
      productos.push({ nombre: nombreProducto, cantidad: cantidadProducto });
  });

  // Convertir los productos a formato JSON
  const productosJSON = JSON.stringify(productos);

  // Crear un formulario para enviar a la página caja.html
  const formularioPago = document.createElement('form');
  formularioPago.method = 'GET';
  formularioPago.action = 'caja.html';

  const inputProductos = document.createElement('input');
  inputProductos.type = 'hidden';
  inputProductos.name = 'productos';
  inputProductos.value = productosJSON;

  formularioPago.appendChild(inputProductos);
  document.body.appendChild(formularioPago);

  // Enviar el formulario
  formularioPago.submit();
}


// Ejecutar la función al cargar la página para obtener los productos de la API
document.addEventListener('DOMContentLoaded', cargarProductos);
