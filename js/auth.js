const Auth = {};

(() => {
	/*
	 * Attempts to log the user in with a given username and password
	 * Callback is executed if login is successful
	 */
	Auth.login = (username, password, callback) => {
		fetch('/auth/login', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ username, password }),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
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
					callback(data);
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

	/*
	 * Logs the user out of the current session and redirects to login.html
	 */
	Auth.logout = () => {
		fetch('/auth/logout', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({}),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
				if (response.status !== 200) {
					noty({
						layout: 'center',
						type: 'error',
						text: '<b>Error logging out!</b><br>' + 
							'Please contact the web administrators for this tool.',
					});
					return;
				}

				response.json().then((data) => {
					noty({
						layout: 'center',
						type: 'success',
						text: '<b>You are now logged out!</b><br>Redirecting...',
					});
					setTimeout(() => {
						window.location = '/login.html';
					}, 500);
				});
			})
			.catch((err) => {
				noty({
					layout: 'center',
					type: 'error',
					text: '<b>Error logging out!</b><br>' + 
						'Please contact the web administrators for this tool.',
				});
			});
	};


	/*
	 * Inserts a username and password pair into the authentication database
	 * Must provide the admin password for this to work
	 */
	Auth.signup = (username, password, adminPassword) => {
		fetch('/auth/signup', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ username, password, adminPassword }),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
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
					console.log(data);
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
	};
})();
