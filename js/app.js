var mainContainerWidth= 0.985 * parseFloat($('.main-container').css('width'))
/**
 * Inicia el temporizador del juego
 */
function initializeTimer(){
    var timerWorker = timerWorker = new Worker('js/timer.js')
    timerWorker.onmessage = function (e) {
        var time = e.data
        $('#timer').text(time);
        //cuando se acabe el tiempo
        if (time == '00:00') {
            // finalizar la ejecucion del contador
            timerWorker.terminate()
            /*
             * Finaliza el juego
            */
            // hacer la animacion de la finalización del juego
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
}

/*========================================================*/
/**
 * Devuelve el nombre del dulce
 * @param {JQuery|img} imgObject - Objeto 'img'
 * @return {string} - Valor de atributo 'alt'
 */
function candyName(imgObject) {
    return $(imgObject).attr('alt')
}

/**
 * Devuelve UN grupo de dulces JUNTOS E IGUALES  desde un 'index' inical
 * @param {number} index - Inicio de la busqueda
 * @param {number} length - Limite de la busqueda
 * @param {array} candyArray - Objetos 'img' donde de hace la busqueda
 * @return {array} groupCandies - Objetos 'img'
 */
function groupPerCandy(index, length, candyArray) {
    // grupo de dulces iguales
    var groupCandies= [candyArray[index]]
    //restriccion para hacer la busqueda con los 3 ultimos dulces
    if (length - index > 2){
        var stop = false,
            i = index;
        while(!stop && i < length){
            i++
            // si el dulce inicial es igual al (siguiente )dulce en la posicion 'i'
            var candyBase = candyName(candyArray[index]),
                nextCandy = candyName(candyArray[i]);
            if ( candyBase == nextCandy)
                // agregar dulces iguales y juntos
                groupCandies.push(candyArray[i])
            else
                //parar si ya no hay dulces juntos e iguales
                stop = true;
        }
    }
    return groupCandies
}

/**
 * Determina cuantos grupos(3 o mas) de dulces juntos hay en una linea
 * @param {array} candyArray - Array de objetos 'img' donde de hace la busqueda
 * @returns {array}
 */
function groupCandyPerLine(candyArray) {
    // devuelve un ARREGLO VACIO SI NO EXISTE GRUPO
    var groupCandyPerLineArray = [],
        lengthCandyArray = candyArray.length;
    for (var i = 0; i < lengthCandyArray; i++){
        // obtener el grupo de dulces en la posicion i
        var vGroupPerCandy = groupPerCandy(i, lengthCandyArray, candyArray)
        if (vGroupPerCandy.length > 1)
            //agregar la combinacion si es igual o mayor a tres
            if (vGroupPerCandy.length >= 3){
                i = i + (vGroupPerCandy.length - 1)
                groupCandyPerLineArray.push(vGroupPerCandy)
            }
            else
                // ir a la siguiente posicion si la combinacion es igual a 2
                i++;
    }
    return groupCandyPerLineArray
}

/*========================================================*/
/**
 * Devuelve las columnas contenidas por el contenedor '.panel-tablero'
 * @returns {jQuery|HTMLElement}
 */
function colsPanelTablero() {
    return $('.panel-tablero div[class^="col-"]');
}

/**
 * @param {number} index - posicion de la columna que queremos obtener
 * todo: Obtiene los dulces(img) por columnas
 * fixme: integridad en las columnas cuando se han quitado los dulces en cada columna
 */
function getImgRow(index) {
    var divColumns = colsPanelTablero(),
        imgRow = [];
    for (var i = 0; i < divColumns.length; i++) {
        imgRow.push($(divColumns[i]).find('.elemento')[index])
    }
    return imgRow;
}

/**
 * Obtiene las agrupaciones de dulces(img) de cada FILA
 * @return {array}
 */
function findRowsGroupCandies() {
    var rowsGroupCandies  = []
    for (var i = 0; i < 7; i++) {
        var rowImgs = getImgRow(i),
            groupCandies = groupCandyPerLine(rowImgs)
        rowsGroupCandies.push(groupCandies)
    }
    return rowsGroupCandies
}

/**
 * Obtiene las agrupaciones de dulces(img) de cada COLUMNA
 * @return {array}
 */
function findColsGroupCandies() {
    var colsGroupCandies  = []
    colsPanelTablero().each(function (index, element) {
        var colImgs = $(element).find('.elemento'),
            groupCandies = groupCandyPerLine(colImgs)
        colsGroupCandies.push(groupCandies)
    })
    return colsGroupCandies
}

/**
 * Devuelve TRUE si hay al menos un grupo de dulces en alguna linea
 * @param {array} linesGroupCandies
 * @return {boolean}
 */
function existsLineGroupCandies(linesGroupCandies) {
    var i = 0,
        existsLine = false
    while(!existsLine && i < linesGroupCandies.length){
        var groupCandies = linesGroupCandies[i]
        // si al menos existe un grupo de dulces retonar 'true'
        if (groupCandies.length > 0){
            console.log(groupCandies.length)
            existsLine = true
        }
        i++
    }
    return existsLine
}

/*====================================================*/
/**
 * todo: funcion aun no establecida, para testear
 */
function deleteGroupCandys(){
    var searchGroupCandiesWorker = new Worker('js/search-group-candies.js')
    searchGroupCandiesWorker.postMessage(true)
    searchGroupCandiesWorker.onmessage = function (e) {
        var bool = e.data
        if (bool){
            var rowGroupCandies = findRowsGroupCandies(),
                colGroupCandies = findColsGroupCandies()
            // existRowsGroupCandies = existsGroupCandies(rowGroupCandies),
            // existColsGroupCandies = existsGroupCandies(colGroupCandies)
            if (existColsGroupCandies)
                deleteAnimationCandies(rowGroupCandies)
            if (existRowsGroupCandies)
                deleteAnimationCandies(colGroupCandies)
            fillCandiesAnimation()
            postMessage(existColsGroupCandies || existRowsGroupCandies)
        }
    }
}

/**
 * Animacion para desaparecer y eliminar los grupos de dulces
 * @param {array} lineGroupCandies
 */
function deleteAnimationCandies(lineGroupCandies) {
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

/*========================================================*/
/**
 * Verifica (devuelve TRUE) si el movimiento es diagonal
 * @param {object} ui - objeto(img) draggable
 * @returns {boolean}
 */
function diagonalMove(ui) {
    var top= ui.position.top,
        left = ui.position.left;
    return  top != 0 && left != 0
}

function canMoveUp() {
    return false;
}

/**
 * Movimiento del dulce hacia 'arriba' o 'abajo'
 * @param {jQuery|HTMLElement} candy
 * @param {'up','down'} move
 * @returns {{candy: (jQuery|HTMLElement), swap: (jQuery|HTMLElement)}}
 */
function verticalMoveAnimation(candy, move) {
    var verticalCandy = candy // default
    if (move  == 'up'){
        verticalCandy = $(candy).prev()
        $(verticalCandy).before(candy)
    }

    if (move  == 'down'){
        verticalCandy = $(candy).next()
        $(verticalCandy).after(candy)
    }
    $(candy).css('top', 0);
    return {candy: candy, swap: verticalCandy}
}

/**
 * Movimiento del dulce hacia 'izquierda' o 'derecha'
 * @param {jQuery|HTMLElement} candy
 * @param {'left','right'} move
 * @returns {{candy: (jQuery|HTMLElement), swap: (jQuery|HTMLElement)}}
 */
function horizontalMoveAnimation(candy, move) {
    var indexCandy = $(candy).index(),
        verticalSiblingCandy = candy
    // restriccion para los dulces de indice 0
    if (indexCandy > 0)
        verticalSiblingCandy = $(candy).prev()
    else
        verticalSiblingCandy = $(candy).next()

    var horizontalCandy = candy // default
    if (move == 'left')
        horizontalCandy = $(candy).parent().prev().children()[indexCandy]
    if (move == 'right')
        horizontalCandy = $(candy).parent().next().children()[indexCandy]

    $(horizontalCandy).after(candy)
    // restriccion para los dulces de indice 0
    if (indexCandy > 0)
        $(verticalSiblingCandy).after(horizontalCandy)
    else
        $(verticalSiblingCandy).before(horizontalCandy)

    $(candy).css('left', 0);
    return {candy: candy, swap: horizontalCandy}
}

/**
 * Verifica y procesa el movimiento un dulce
 * @param {Object} candyUi
 * @param {up, down, right, left} movement
 */
function processCandyMovement(candyUi, movement) {
    var swapCandies = {}
    switch (movement) {
        case 'up':
            swapCandies = verticalMoveAnimation(candyUi.helper, 'up')
            break
        case 'down':
            swapCandies = verticalMoveAnimation(candyUi.helper, 'down')
            break
        case 'left':
            swapCandies = horizontalMoveAnimation(candyUi.helper, 'left')
            break
        case 'right':
            swapCandies = horizontalMoveAnimation(candyUi.helper, 'right')
            break
    }
    
}
var movementsCounter = 0
/**
 * Actualiza el contenido de con id:'score-text'
 */
function updateMovementCounter() {
    movementsCounter++
    $('#movimientos-text').text(movementsCounter)
}
var firstMovement = true;
/**
 * Genera un dulce(img) aleatoriamente
 * @return {object} imgObject - Objeto DOM 'img'
 */
function randomizeCandy() {
    //aleatorizar dulces del uno al cuatro
    var ramdomImg = Math.round(Math.random()*(4-1) + 1);

    var imgObject = $('<img class="elemento" src="image/&.png" alt="Candy &">'.replace(/&/g,ramdomImg))
    $(imgObject).draggable({
        opacity: 0.7,
        grid: [99.4, 96],
        drag: function (event, ui) {
            /*
            * RESTRICCION DE UN SOLO MOVIMIENTO
            *   arriba o abajo
            *   derecha o izquierda
            */
            if (!diagonalMove(ui)){
                if (ui.position.left > 0){
                    ui.position.left = Math.min( 99.39, ui.position.left );
                }
                else{
                    ui.position.left = Math.max( -99.39, ui.position.left );
                }
                if (ui.position.top > 0){
                    ui.position.top = Math.min( 96, ui.position.top );
                }
                else{
                    ui.position.top = Math.max( -96, ui.position.top );
                }
            }
            else{
                // evitar movimiento en diagonal
                if (ui.position.left != 0){
                    ui.position.top =0
                    if (ui.position.left > 0){
                        // console.log(ui.position.left)
                        ui.position.left = Math.min( 99.39, ui.position.left );
                    }
                    else{
                        // console.log('Menor a cero ' + ui.position.left)
                        ui.position.left = Math.max( -99.39, ui.position.left );
                    }
                }
            }
        },
        stop: function (event, ui) {
            if (firstMovement){
                initializeTimer()
                firstMovement = false;
            }
            updateMovementCounter()
            // si el movimiento es vertical
            if (ui.position.top != 0 && ui.position.left == 0){
                if (ui.position.top > 0){
                    processCandyMovement(ui, 'down')
                }
                else{
                    processCandyMovement(ui, 'up')
                }
            }
            // si el movimiento es horizontal
            if (ui.position.top == 0 && ui.position.left != 0){
                if (ui.position.left > 0){
                    processCandyMovement(ui, 'right')
                }
                else{
                    processCandyMovement(ui, 'left')
                }
            }
        },
    })
    return imgObject;
}

/**
 * Animacion de llenado de dulces (img)
 */
function fillCandiesAnimation(){
    // animacion del llenado de los dulces
    colsPanelTablero().each(function (index, element) {
        //agregar 6 dulces aleatorios en cada columna
        var length = 7 - $(element).find('.elemento').length
        for (i=0; i<length; i++){
            var candy = randomizeCandy()
            $(element).prepend(candy);
            $(candy).delay(i*350).fadeIn('slow')
        }
    })
}

/*========================================================*/
/**
 * Evento del boton 'Iniciar'
 * Permite el comienzo del juego: 'Llenado de dulces'
 * Permite el reinicio del juego: 'Recargar la pagina'
 */
$('.btn-reinicio').click(function () {
    var name = $(this).text()
    if (name =='Iniciar'){
        $(this).text('Reiniciar')
        fillCandiesAnimation()
        // todo: por implementar
        //initializeTimer()
    }
    else{
        location.reload(true)
    }
})

/*========================================================*/
function initializate() {
    /**
     * Animacion (cambiar el color) del titulo del juego cada segundo
     */
    var changeColorWorker = new Worker('js/change-color.js')
    changeColorWorker.onmessage = function (e) {
        var color = e.data
        $('.main-titulo').css('color', color);
    }
        /**
         * todo: inicializar la configuracion de las columnas en modo droppable
         */
    colsPanelTablero().droppable({
        accept: function (e) {
            // console.log(e[0].offsetTop)
            // console.log(e[0].offsetLeft)
        }
    })
}
initializate()
