(() => {
	App.initHome = () => {

        $('body').unbind(); // unbind any event listeners

		$('.nav li').removeClass('active');
		$('[value="home"]').addClass('active');

		// click event for the enter button
		$('.enter-button').click((d) => {
            const location = window.location.href;

            // Firefox doesn't have the hash always. Check for the existance of it.
			window.location += location.endsWith('#') ? 'mandates' : '#mandates';
		});

	};
})();
