var Routing = {};

(function() {
	// Precompiles all html handlebars templates on startup.
	// Compiling is front-loaded so the compiling does not happen on page changes.
	var templates = {};
    var parseHash = function(newHash) { crossroads.parse(newHash); };
    var loadTemplate = function(page, data) {
        $('#page-content').html(templates[page](data));
    };

	Routing.precompileTemplates = function() {
		$("script[type='text/x-handlebars-template']").each(function (i, e) {
			templates[e.id.replace('-template', '')] = Handlebars.compile($(e).html());
		});
	};

    Routing.initializeRoutes = function() {
        // setup crossroads for routing
        crossroads.addRoute('/', function() {
            loadTemplate('home');
            App.initHome();
            window.scrollTo(0, 0);
        });
        crossroads.addRoute('/about', function() {
			loadTemplate('about');
			window.scrollTo(0, 0);
        });

        // setup hasher for subscribing to hash changes and browser history
        hasher.prependHash = '';
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    };
}());
