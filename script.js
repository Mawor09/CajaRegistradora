let orden = [];

function agregarComida() {
    const comidaInput = document.getElementById('comida');
    const precioInput = document.getElementById('precio');
    const comidaNombre = comidaInput.value;
    const comidaPrecio = parseFloat(precioInput.value);
    
    if (comidaNombre && comidaPrecio) {
        orden.push({ name: comidaNombre, price: comidaPrecio });
        console.log(`"${comidaNombre}" agregado a la orden.`);
    } else {
        console.log("Por favor ingrese un nombre y precio válidos.");
    }
}

function mostrarOrden() {
    console.log("Orden:");
    orden.forEach(item => {
        console.log(`${item.name} - $${item.price}`);
    });
    const total = orden.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
    console.log(`Total: $${total.toFixed(2)}`);
}