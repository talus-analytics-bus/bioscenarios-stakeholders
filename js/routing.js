const Routing = {};

(() => {
	// Precompiles all html handlebars templates on startup.
	// Compiling is front-loaded so the compiling does not happen on page changes.
	const templates = {};
	Routing.precompileTemplates = () => {
		$("script[type='text/x-handlebars-template']").each((i, e) => {
			templates[e.id.replace('-template', '')] = Handlebars.compile($(e).html());
		});
	};

	Routing.initializeRoutes = () => {
		// setup crossroads for routing
		crossroads.addRoute('/', () => {
			loadPage('home', App.initHome);
		});
		crossroads.addRoute('/login', () => {
			loadPage('login', App.initLogin);
		});
		crossroads.addRoute('/libraries', () => {
			loadPage('libraries');
		});
		crossroads.addRoute('/text', () => {
			loadPage('text');
		});
		crossroads.addRoute('/tables', () => {
			loadPage('tables', App.initTables);
		});
		crossroads.addRoute('/sections', () => {
			loadPage('sections');
		});
		crossroads.addRoute('/map', () => {
			loadPage('map', App.initMap);
		});
		crossroads.addRoute('/buttons', () => {
			loadPage('buttons', App.initButtons);
		});
		crossroads.addRoute('/filters', () => {
			loadPage('filters', App.initFilters);
		});
		crossroads.addRoute('/tooltips', () => {
			loadPage('tooltips', App.initTooltips);
		});
		crossroads.addRoute('/notifications', () => {
			loadPage('notifications', App.initNotifications);
		});
		crossroads.addRoute('/fonts', () => {
			loadPage('fonts');
		});
		crossroads.addRoute('/colors', () => {
			loadPage('colors');
		});
		crossroads.addRoute('/svgcrowbar', () => {
			loadPage('svgcrowbar');
		});
		crossroads.addRoute('/stacked', () => {
			loadPage('stacked', App.initStacked);
		});
		crossroads.addRoute('/sankey', () => {
			loadPage('sankey', App.initSankey);
		});
		crossroads.addRoute('/force', () => {
			loadPage('force', App.initForce);
		});

		// setup hasher for subscribing to hash changes and browser history
		hasher.prependHash = '';
		hasher.initialized.add(parseHash);
		hasher.changed.add(parseHash);
		hasher.init();
	};

	function loadPage(pageName, func, ...data) {
		loadTemplate(pageName);
		if (func) func(...data);
		window.scrollTo(0, 0);

		fetch('/verify', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `token=${App.authToken}`,
		})
			.then((response) => {
				console.log(response);
				response.json().then((data) => {
					console.log(data);
				});
			});
	}
	function parseHash(newHash) { crossroads.parse(newHash); }
	function loadTemplate(page, data) {
		$('#page-content').html(templates[page](data));
	}
})();
