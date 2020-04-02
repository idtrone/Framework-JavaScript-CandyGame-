/* ---cambiar el color del titulo del juego cada segundo--- */
var changeColorWorker = new Worker('js/change-color.js')
changeColorWorker.onmessage = function (e) {
    var color = e.data
    $('.main-titulo').css('color', color);
}

var mainContainerWidth= 0.985 * parseFloat($('.main-container').css('width'))
var timerWorker = timerWorker = new Worker('js/timer.js')
timerWorker.onmessage = function (e) {
    var time = e.data
    $('#timer').text(time);
    if (time == '00:00') {
        timerWorker.terminate()
        $('.panel-tablero').animate(
            { height: '0px' },
            3000,
            function(){ $('.panel-tablero').hide(); }
        )
        .animate(
            { width: '0px' },
            {
                step: function(now){
                    $('.panel-score').css('width', mainContainerWidth - now +'px')
                },
                queue: false,
                duration: 3000
            }
        )
    }
}

$('.btn-reinicio').click(function () {
    var name = $(this).text()
    if (name =='Iniciar'){
        $(this).text('Reiniciar')
        fillCandys()
    }
    else{
        location.reload(true)
    }
})

function initializate() {
    // $('div[class^="col-"]').droppable({
    //     greedy: false,
    //     // drop: function (event, ui) {
    //     //     console.log(ui)
    //     //     console.log(event)
    //     // },
    //     deactivate: function (event, ui) {
    //         console.log('deactivate')
    //     }
    // });
}

/*--- generar Aleatoriamente los dulces ---*/
function randomizeCandy() {
    //aleatorizar dulces del uno al cuatro
    var ramdomImg = Math.round(Math.random()*(4-1) + 1);

    // crear codigo html de la imagen dulce
    var img = $('<img style="display: none" class="elemento" src="image/&.png" alt="Candy &">'.replace(/&/g,ramdomImg))
    $(img).draggable()
    return img;
}

function fillCandys(){
    $('div[class^="col-"]').each(function (index, element) {
        //agregar 6 dulces aleatorios en cada columna
        var length = 7 - $(element).find('.elemento').length
        for (i=0; i<length; i++){
            var candy = randomizeCandy()
            $(element).prepend(candy);
            $(candy).delay(i*350).fadeIn('slow')
        }
    })
}

function candyName(elementoImg) {
    return $(elementoImg).attr('alt')
}

function combinacionPorDulce(index, top, imgArray) {
    /*determina si hay 3 o mas dulces iguales juntos*/

    // grupo de dulces iguales
    var groupCandies= [imgArray[index]]
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
                groupCandies.push(imgArray[i])
            else
                //parar la busqueda
                stop = true;
        }
    }
    return groupCandies
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

function findRowsGroupCandies() {
    //busca agrupacion de dulces en cada fila
    var rowsGroupCandies  = []
    for (var i = 0; i < 7; i++) {
        var rowImgs = getImgRow(i),
            groupCandies = combinacionesPorLinea(rowImgs)
        rowsGroupCandies.push(groupCandies)
    }
    return rowsGroupCandies
}

function findColsGroupCandies() {
    //busca agrupacion de dulces en cada columna
    var colsGroupCandies  = []
    $('div[class^="col-"]').each(function (index, element) {
        var colImgs = $(element).find('.elemento'),
            groupCandies = combinacionesPorLinea(colImgs)
        colsGroupCandies.push(groupCandies)
    })
    return colsGroupCandies
}

function deleteGroupCandys(){
    var rowGroupCandies = findRowsGroupCandies(),
        colGroupCandies = findColsGroupCandies()
    deleteAnimationCandies(rowGroupCandies)
    deleteAnimationCandies(colGroupCandies)
}

function deleteAnimationCandies(lineGroupCandies){
    //animacion para eliminar los grupos de dulces
    lineGroupCandies.forEach(function (groupCandy, i) {
        if (groupCandy.length > 0){
            groupCandy.forEach(function (candy, j) {
                $(candy).fadeToggle('fast', function () {
                    $(candy).fadeToggle('fast', function () {
                        $(candy).fadeToggle('fast', function () {
                            $(candy).remove()
                        })
                    })
                })
            })
        }
    })
}


initializate()

