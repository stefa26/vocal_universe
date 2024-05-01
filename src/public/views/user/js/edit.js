function habEditar() {
    var campos = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"]');

    campos.forEach(function (campo) {
        campo.removeAttribute('disabled');
    });
}