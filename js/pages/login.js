(() => {
	App.initLogin = () => {
		$('.login-button').click(login);
		$('.password-input').on('keyup', (e) => {
			if (e.which === 13) login();
		});
	};

	function login() {
		const username = $('.username-input').val();
		const password = $('.password-input').val();

		// other checks
		if (!password) {
			noty({ text: 'Please enter a password first!' });
			return;
		}

		fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `username=${username}&password=${password}`,
		})
			.then((response) => {
				if (response.status !== 200) {
					noty({ text: '<b>Error!</b><br>The credentials you provided are invalid!' });
					return;
				}

				response.json().then((data) => {
					noty({ type: 'success', text: '<b>Success!</b><br>You are now logged in!' });
					App.authToken = data.token;
					hasher.setHash('/');
				});
			})
			.catch((err) => {
				console.log(err);
				noty({ text: 'Error!' });
			});
	}
})();
