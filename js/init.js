(function() {
	var app = new App();
	app.precompileTemplates();
	
	var routing = new Routing(app);
	routing.initializeRoutes();	
})();
