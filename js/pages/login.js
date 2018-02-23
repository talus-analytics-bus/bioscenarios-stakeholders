(() => {
	function init() {
		$('#page-content').css('padding-top', '100px');
		$('.login-button').click(login);
		$('.password-input').on('keyup', (e) => {
			if (e.which === 13) login();
		});
	}

	function login() {
		const username = $('.username-input').val();
		const password = $('.password-input').val();

		// other checks
		if (!password) {
			noty({
				layout: 'center',
				type: 'warning',
				text: 'Please enter a password first!',
			});
			return;
		}

		Auth.login(username, password, () => {
			noty({
				layout: 'center',
				type: 'success',
				text: '<b>Success! You are now logged in!</b><br>Redirecting...',
			});
			setTimeout(() => {
				window.location = `/${window.location.hash}`;
			}, 500);
		});
	}

	init();
})();
