document.addEventListener('wheel',function(e){
	//console.log('X');
	//console.log(e.deltaX);
	//console.log('Y');
	//console.log(e.deltaY);
	var view = document.querySelector('#viewer');
	var slide = view.firstChild;
	var count = view.dataset.count;
	if (e.deltaY > 0) {
		var curMarg = Number(slide.style.marginRight.slice(0,-2));
		if(curMarg < -100) {
			curMarg += 100;
			slide.style.marginRight = curMarg+'vw';
		}

	} else if (e.deltaY < 0) {
		var curMarg = Number(slide.style.marginRight.slice(0,-2));
		if(!curMarg)
			curMarg = -100
		if(curMarg/100 * -1 < count - 1) {
			curMarg -= 100;
			slide.style.marginRight = curMarg+'vw';
		}
	}
});
