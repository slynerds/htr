(function($){
	$(document).ready(function(){
		$('.cls-5').mouseenter(function(e){
			if($(this).attr('data-head').length) {
				var newtop = Number($(this).offset().top) + 200;
				var newleft = Number($(this).offset().left);
				var newhead = $(this).attr('data-head');
				var newblurb = $(this).attr('data-blurb');
				$('.tooltip').css('top',newtop + 'px');
				$('.tooltip').css('left',newleft + 'px');
				$('.tooltip').css('opacity','1');
				$('.tooltip').css('pointerEvents','auto');
				$('.tooltip').find('h4').text(newhead);
				$('.tooltip').find('p').text(newblurb);
			}
		});
		$('.cls-5').mouseleave(function(e){
			$('.tooltip').css('opacity','0');
			$('.tooltip').css('pointerEvents','none');
		});
	});
})(jQuery)
