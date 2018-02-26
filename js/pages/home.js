(() => {
	App.initHome = () => {

        $('body').unbind(); // unbind any event listeners

		// click event for the enter button
		$('.enter-button').click((d) => {
            window.location = window.location += 'mandates';
		});

	};
})();
