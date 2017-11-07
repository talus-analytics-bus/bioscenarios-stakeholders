(() => {
	App.initLogin = () => {
		$('.login-button').click(login);
		$('.password-input').on('keyup', (e) => {
			if (e.which === 13) login();
		});
	};

	const instance = axios.create({
		baseURL: 'http://auth.talusanalytics.com:3000',
		//baseURL: 'http://localhost:3000',
		//baseURL: 'https://randomuser.me/api/',
		timeout: 1000,
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	});
	
	/*function login() {
		NProgress.start();
		// $.noty.closeAll();
		const username = $('.username-input').val();
		const password = $('.password-input').val();
		instance.post('/auth/login', {
			username,
			password,
		}).then((response) => {
			console.log(response);
			if (response.error) {
				noty({
					layout: 'top',
					type: 'warning',
					text: `<b>Error!</b><br> ${response.error}`,
				});
			} else {
				// hasher.setHash('');
			}
			NProgress.done();
		});
	};*/

	function login() {
		const formData = `emailOrUsername=test1&password=test2`;

		fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: formData,
		})
			.then((res) => {
				console.log(res);
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	}
})();
