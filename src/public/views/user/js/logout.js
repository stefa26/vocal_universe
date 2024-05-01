function cerrarSesion() {
    localStorage.clear('usuario');
    window.location.href = '../../../index.html'
}