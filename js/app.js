/* ---cambiar el color del titulo del juego cada segundo--- */
var changeColorWorker = new Worker('js/change-color.js')
changeColorWorker.onmessage = function (e) {
    var color = e.data
    $('.main-titulo').css('color', color);
}

/**/