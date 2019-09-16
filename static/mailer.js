(function($){
	$(document).on('submit','.contactform',function(e){
		e.preventDefault();
		console.log($(this));
		var ajaxData = $(this).serialize();
		if($('.fr').length) {
			ajaxData += '&fr=1'
		}
		console.log(ajaxData);
			$.ajax({
				"url":"/mailer/mailer.php",
				//"dataType":"json",
				"method":"POST",
				"data":ajaxData,
				"success":function(data) {
					console.log(data);
					if($('.fr').length)
						$('#formcont').html("<h3 id=thanks>Merci d'avoir contacté Haïti Prend Racine! 🍃</h3>");
					else 
						$('#formcont').html("<h3 id=thanks>Thank you for contacting Haiti Takes Root! 🍃</h3>");
				},
				"error":function(err){
				}

			});
	});
})(jQuery)
