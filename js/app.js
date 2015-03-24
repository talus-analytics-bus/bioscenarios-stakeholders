function App() {
    $('.link-about').on('click', function() { hasher.setHash('about'); });

	this.initHome = function() {
		
	};

    // precompile all handlebars templates on startup so they don't have to be compiled on each page change.
    // slightly slower startup, much faster afterwards
    this.templates = {};
    this.precompileTemplates = function () {
    	var app = this;
        $("script[type='text/x-handlebars-template']").each(function (i, e) {
            app.templates[e.id.replace("-template", "")] = Handlebars.compile($(e).html());
        });
    };
}