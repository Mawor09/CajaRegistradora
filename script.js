let orden = [];
let productos = [];

// Función para agregar un plato a la orden
function agregarComida() {
    const productoSelect = document.getElementById('producto');
    const productoIndex = productoSelect.value;

    if (productoIndex !== '') {
        const productoSeleccionado = productos[productoIndex];
        orden.push(productoSeleccionado);
        console.log(`"${productoSeleccionado.name}" agregado a la orden.`);

        // Guardar la orden en localStorage
        guardarOrdenLocalStorage();

        // Actualizar el DOM
        actualizarOrdenDOM();
        calcularTotal();
    } else {
        alert("Por favor seleccione un producto.");
    }
}

// Función para mostrar la orden en el DOM
function actualizarOrdenDOM() {
    const ordenList = document.getElementById('orden-list');
    const subtotalElement = document.getElementById('subtotal');
    const impuestoElement = document.getElementById('impuesto');

    // Limpiar la lista de orden, subtotal e impuesto
    ordenList.innerHTML = '';
    subtotalElement.textContent = '';
    impuestoElement.textContent = '';

    // Iterar sobre la orden y agregar cada plato a la lista
    orden.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        ordenList.appendChild(listItem);
    });

    // Calcular y mostrar el subtotal
    const subtotal = calcularSubtotal();
    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

    // Calcular y mostrar el impuesto (10%)
    const impuesto = subtotal * 0.1;
    impuestoElement.textContent = `Impuesto (10%): $${impuesto.toFixed(2)}`;
}

// Función para calcular el total incluyendo propina
function calcularTotal() {
    const propinaSelect = document.getElementById('propina');
    const propinaManualInput = document.getElementById('propina-manual');
    const propinaOption = propinaSelect.value;
    let propina = 0;

    if (propinaOption === 'manual') {
        propinaManualInput.style.display = 'block';
        const propinaManual = parseFloat(propinaManualInput.value);
        if (!isNaN(propinaManual) && propinaManual > 0) {
            propina = propinaManual;
        }
    } else {
        propinaManualInput.style.display = 'none';
        propina = parseFloat(propinaOption) * calcularSubtotal();
    }

    // Calcular y mostrar el total
    const total = calcularSubtotal() + propina + (calcularSubtotal() * 0.1);
    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total (incluyendo impuestos): $${total.toFixed(2)}`;
}

// Función para calcular el subtotal
function calcularSubtotal() {
    return _.sumBy(orden, 'price');
}

// Función para mostrar la orden
function mostrarOrden() {
    console.log("Orden:");
    orden.forEach(item => {
        console.log(`${item.name} - $${item.price.toFixed(2)}`);
    });
    console.log(`Subtotal: $${calcularSubtotal().toFixed(2)}`);
    console.log(`Impuesto (10%): $${(calcularSubtotal() * 0.1).toFixed(2)}`);
    calcularTotal();
}

// Función para limpiar la orden
function limpiarOrden() {
    orden = [];
    localStorage.removeItem('orden');
    actualizarOrdenDOM();
    calcularTotal();
}

// Función para guardar la orden en localStorage
function guardarOrdenLocalStorage() {
    localStorage.setItem('orden', JSON.stringify(orden));
}

// Función para cargar la orden desde localStorage al cargar la página
window.onload = function() {
    const ordenGuardada = localStorage.getItem('orden');
    if (ordenGuardada) {
        orden = JSON.parse(ordenGuardada);
        actualizarOrdenDOM();
        calcularTotal();
    }

    // Cargar menú inicial desde JSON local
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            llenarSelectProductos();
        })
        .catch(error => console.error('Error al cargar el JSON local:', error));
};

// Función para llenar el select con los productos del JSON
function llenarSelectProductos() {
    const productoSelect = document.getElementById('producto');
    productos.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        productoSelect.appendChild(option);
    });
}

// Agregar eventos a los botones
document.getElementById('agregar-btn').addEventListener('click', agregarComida);
document.getElementById('mostrar-btn').addEventListener('click', mostrarOrden);
document.getElementById('limpiar-btn').addEventListener('click', limpiarOrden);

// Evento para manejar cambios en el campo de propina manual
document.getElementById('propina-manual').addEventListener('input', calcularTotal);
