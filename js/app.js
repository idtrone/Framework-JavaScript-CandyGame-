/* ---cambiar el color del titulo del juego cada segundo--- */
var changeColorWorker = new Worker('js/change-color.js')
changeColorWorker.onmessage = function (e) {
    var color = e.data
    $('.main-titulo').css('color', color);
}

var timerWorker = new Worker('js/timer.js')
timerWorker.onmessage = function (e) {
    var time = e.data
    $('#timer').text(time);
}

/*--- generar Aleatoriamente los dulces ---*/
function randomizeCandy() {
    //aleatorizar dulces del uno al cuatro
    var ramdomImg = Math.round(Math.random()*(4-1) + 1);

    // crear codigo html de la imagen dulce
    return '<img class="elemento" src="image/&.png" alt="Candy &">'.replace(/&/g,ramdomImg)
}

function getDivCols() {
    return $('div[class^="col-"]');
}

function fillCandys(){
    $('div[class^="col-"]').each(function (index, element) {
        //agregar 6 dulces aleatorios en cada columna
        var length = 7 - $(element).find('.elemento').length
        for (i=0; i<length; i++){
            $(element).prepend(randomizeCandy());
        }
    })
}


function candyName(elementoImg) {
    return $(elementoImg).attr('alt')
}

function combinacionPorDulce(index, top, imgArray) {
    /*determina si hay 3 o mas dulces iguales juntos*/
    // numero de dulces iguales
    var length = 1
    //buscar si tengo mas de 3 dulces
    if (top - index > 2){
        var stop = false,
            i = index;
        while(!stop && i < top){
            i++
            // si el dulce inicial es igual al dulce en la posicion 'i'
            var candyBase = candyName(imgArray[index]),
                candyI = candyName(imgArray[i]);
            if ( candyBase == candyI)
                length++
            else
                //parar la busqueda
                stop = true;
        }
    }
    return { index: index, length: length}
}

function combinacionesPorLinea(imgArray) {
    /*determina cuantos grupos de dulces juntos hay en una linea*/
    var combinacionesArray = [],
        top = imgArray.length;

    for (var i = 0; i < top; i++){
        // buscar una combiancion de tres a mas desde la posicion i
        var combinacion = combinacionPorDulce(i, top, imgArray)
        if (combinacion.length > 1)
            //agregar la combinacion si es igual o mayor a tres
            if (combinacion.length >= 3){
                i = i + (combinacion.length - 1)
                combinacionesArray.push(combinacion)
            }
            else
                // ir a la siguiente posicion si la combinacion es igual a 2
                i++;
    }
    return combinacionesArray
}









function getImgCol(index) {
    imgCol = $($('div[class^="col-"]')[index]).find('.elemento')
    return Array.from(imgCol)
}

function getImgRow(index) {
    //obteniendo los imagenes(dulces) por columnas
    var divColumns = $('div[class^="col-"]'),
        imgRow = [];
    for (var i = 0; i < 7; i++) {
        imgRow.push($(divColumns[i]).find('.elemento')[index])
        //imgRow[i] = $(divColumns[i]).find('.elemento')[index]
    }
    return imgRow;
}



function mostrarCombinacionesVerticales() {
    var combinaciones = []

    $('div[class^="col-"]').each(function (index, element) {
        var el = $(element).find('.elemento')
        var combinacion = combinacionesPorLinea(el)
        console.log('Columna &: '.replace('&', index + 1) + combinacion.length + ' combinaciones')
    })
}

function mostrarCombinacionesHorizontales() {
    var combinaciones = []
    for (var i = 0; i < 7; i++) {
        rowImg =getImgRow(i)
        var combinacion = combinacionesPorLinea(rowImg)
        console.log('Fila &: '.replace('&', i + 1) + combinacion.length + ' combinaciones')
    }
}

// fillCandys()
// mostrarCombinacionesHorizontales()
// mostrarCombinacionesVerticales()


