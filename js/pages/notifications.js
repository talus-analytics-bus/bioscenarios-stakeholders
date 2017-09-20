(() => {
	App.initNotifications = () => {
		// notification section
		$('.warning-btn').click(() => {
			noty({
				type: 'warning',
				text: '<b>Hi!</b><br>This is a warning notification!',
			})
		});
		$('.success-btn').click(() => {
			noty({
				layout: 'top',
				type: 'success',
				text: '<b>Hi!</b><br>This is a success notification with top layout!',
			})
		});
		$('.error-btn').click(() => {
			noty({
				layout: 'bottom',
				type: 'error',
				text: '<b>Hi!</b><br>This is a error notification with bottom layout!',
			})
		});

		// progress bar section
		$('.progress-btn').click(() => {
			NProgress.start();  // start progress bar
			setTimeout(() => {
				NProgress.set(0.4);  // set progress bar to 40%
			}, 1500);
			setTimeout(() => {
				NProgress.done();  // finish progress bar and hide
			}, 3000);
		});
	};
})();
