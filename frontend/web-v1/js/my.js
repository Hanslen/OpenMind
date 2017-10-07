$(window).scroll(function () {
	var d = $(window).scrollTop();
	if(d > 0){
		$(".navbar").addClass("after");
		$(".navfont").addClass("afternavfont");
	}else{
		$(".navbar").removeClass("after");
		$(".navfont").removeClass("afternavfont");
	}
});