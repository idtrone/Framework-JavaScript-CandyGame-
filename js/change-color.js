function changeTitleColor(changeColor){
    var color = '';
    if(changeColor){
        color ='white'
        changeColor = false
    }
    else {
        color = '#DCFF0E';
        changeColor = true
    }
    self.postMessage(color)
    setTimeout(changeTitleColor, 1000, changeColor)
}

changeTitleColor(true)

// function changeTitleColor(){
//     changeColor = true
//     while (true){
//         if (changeColor){
//             color ='white'
//             changeColor = false
//         }
//         else{
//             color = '#DCFF0E';
//             changeColor = true
//         }
//         self.postMessage(color)
//         setTimeout(function () {
//             color = 0;
//         }, 1000)
//     }
// }
//
// changeTitleColor()