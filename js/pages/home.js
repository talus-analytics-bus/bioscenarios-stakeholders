(() => {
	App.initHome = () => {

        $('body').unbind(); // unbind any event listeners

		// click event for the enter button
		$('.enter-button').click((d) => {
            const location = window.location.href;

            // Firefox doesn't have the hash always. Check for the existance of it.
			window.location += location.endsWith('#') ? 'mandates' : '#mandates';
		});

	};
})();
