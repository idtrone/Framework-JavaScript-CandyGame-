function temporizador(miliseconds) {
	if (miliseconds > 0){
		miliseconds = miliseconds - 1000
		time = new Date(miliseconds)
		minutes = time.getMinutes();
		seconds = time.getSeconds();
		minutes = minutes <10? '0'+minutes:minutes
		seconds = seconds <10? '0'+seconds:seconds
		self.postMessage( minutes + ':' + seconds)
		setTimeout(temporizador, 1000, miliseconds)
	}
}

temporizador(2*60000)