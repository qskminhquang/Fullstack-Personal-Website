(function($) {
	$(function() {
		const PASS_LENGTH = 8;
		var password = '';
		var characters = [];
		var counter = 0;

		var interval = setInterval(function() {
				for(i = 0; i < counter; i++) {
					characters[i] = password.charAt(i);
				}
				for(i = counter; i < PASS_LENGTH; i++) {
					characters[i] = Math.floor(Math.random() * 36).toString(36);
				}
				$('.password').text(characters.join(''));
			}, 50);

		//keyboard events won't fire if the iframe isn't selected first in Full Page view
		$('.start').on('click', function() {
			$(this).addClass('hidden');
			$('.info p:last-child, .password').removeClass('hidden');
			$('#dummy').focus();
		});

		$('.password').on('click', function() {
			$('#dummy').focus();
		});

		$(window).on('keyup', function() {
			if (counter < PASS_LENGTH) {
				password = $('#dummy').val();
				counter = password.length;
			}
			if (counter >= PASS_LENGTH){
				$('.continue, .login, .rerun').removeClass('hidden');
			}
		});

		$('.login').on('click', function() {
			var md5 = CryptoJS.MD5(password).toString();
			var token = '';
			for(i = 0; i < md5.length; i++) {
				if(i % 2 === 0) {
					token += md5.charAt(i);
					token += Math.floor(Math.random() * 36).toString(36);
				}
				else {
					token += md5.charAt(i);
				}
			}
			window.location = '?token=' + token;
			//window.location.href = "http://www.google.com";
		});

		$('.rerun').on('click', function() {
			$('.continue, .login, .rerun').addClass('hidden');
			password = '';
			characters = [];
			counter = 0;
			$('#dummy').val('');
			$('#dummy').focus();
		});
	});
})(jQuery);