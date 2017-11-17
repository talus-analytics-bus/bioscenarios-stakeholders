(() => {
	function init() {
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

		fetch('/login', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=${username}&password=${password}`,
		})
			.then((response) => {
				if (response.status !== 200) {
					noty({
						layout: 'center',
						type: 'warning',
						text: '<b>Error!</b><br>The credentials you provided are invalid!',
					});
					return;
				}

				response.json().then((data) => {
					noty({
						layout: 'center',
						type: 'success',
						text: '<b>Success! You are now logged in!</b><br>Redirecting...',
					});
					setTimeout(() => {
						window.location = `/${window.location.hash}`;
					}, 500);
				});
			})
			.catch((err) => {
				noty({
					layout: 'center',
					type: 'error',
					text: '<b>Error sending credentials to server!</b><br>' + 
						'Please contact the web administrators for this tool.',
				});
			});
	}

	init();
})();
