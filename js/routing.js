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
            loadTemplate('home');
            App.initHome();
            window.scrollTo(0, 0);
        });
        crossroads.addRoute('/about', () => {
            loadTemplate('about');
            window.scrollTo(0, 0);
        });

        // setup hasher for subscribing to hash changes and browser history
        hasher.prependHash = '';
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();
    };

    function parseHash(newHash) { crossroads.parse(newHash); }
    function loadTemplate(page, data) {
        $('#page-content').html(templates[page](data));
    }
})();
