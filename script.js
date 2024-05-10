let orden = [];

// Función para agregar un plato a la orden
function agregarComida() {
    const comidaInput = document.getElementById('comida');
    const precioInput = document.getElementById('precio');
    const comidaNombre = comidaInput.value;
    const comidaPrecio = parseFloat(precioInput.value);
    
    if (comidaNombre && comidaPrecio) {
        const nuevoPlato = { name: comidaNombre, price: comidaPrecio };
        orden.push(nuevoPlato);
        console.log(`"${comidaNombre}" agregado a la orden.`);
        
        // Guardar la orden en localStorage
        guardarOrdenLocalStorage();

        // Actualizar el DOM
        actualizarOrdenDOM();
        calcularTotal();
    } else {
        console.log("Por favor ingrese un nombre y precio válidos.");
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
        listItem.textContent = `${item.name} - $${item.price}`;
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
        const propinaManual = parseFloat(propinaManualInput.value);
        if (propinaManual) {
            propina = propinaManual;
        }
    } else {
        propina = parseFloat(propinaOption) * calcularSubtotal();
    }

    // Calcular y mostrar el total
    const total = calcularSubtotal() + propina;
    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total (incluyendo impuestos): $${total.toFixed(2)}`;
}

// Función para calcular el subtotal
function calcularSubtotal() {
    return orden.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
}

// Función para mostrar la orden
function mostrarOrden() {
    console.log("Orden:");
    orden.forEach(item => {
        console.log(`${item.name} - $${item.price}`);
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
};
