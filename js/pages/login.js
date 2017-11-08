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
					console.log(response);
					console.log('Error: ' + response.status);
					noty({ text: 'Error!' });
					return;
				}

				response.json().then((data) => {
					console.log(data);
					noty({ type: 'success', text: 'Success!' });
					hasher.setHash('/');
				});
			})
			.catch((err) => {
				console.log(err);
				noty({ text: 'Error!' });
			});
	}
})();
