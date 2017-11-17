const App = {};

(() => {
	App.initialize = () => {
		$('.logout-link').click(App.logout);
	};

	App.logout = () => {
		fetch('/logout', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: '',
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

	/* ------------------ Vendor Defaults ------------------- */
	// tooltipster defaults
	$.tooltipster.setDefaults({
		contentAsHTML: true,
		trigger: 'hover',
		offset: [5, -25],
		theme: 'tooltipster-shadow',
		maxWidth: 320,
	});

	// noty defaults
	$.noty.defaults.type = 'warning';
	$.noty.defaults.layout = 'center';
	$.noty.defaults.timeout = 2000;
})();
