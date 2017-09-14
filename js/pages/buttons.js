(() => {
	App.initButtons = () => {
		/* ------------------- Button Group Behavior ------------------ */
		$('.btn-group-container .btn-group .btn').click(function activateButton() {
			$(this).addClass('active')
				.siblings().removeClass('active');
		});


		/* ------------------- Tab Behavior ------------------ */
		// defining tab behavior using jQuery
		$('.tab-container .tab').click(function switchTabContent() {
			showTab($(this).attr('tab'));
		});

		// function for making the correct tab active and displaying the correct tab content
		function showTab(tabName) {
			// make the correct tab active; make all others inactive
			$('.tab-container .tab').removeClass('active');
			$(`.tab-container .tab[tab=${tabName}]`).addClass('active');

			// display the correct tab content
			$('.tab-content-container .tab-content').slideUp();
			$(`.tab-content-container .tab-content[tab=${tabName}]`).slideDown();
		}

		// initialize a tab to start with
		showTab('1');
	};
})();
