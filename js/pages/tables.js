(() => {
	App.initTables = () => {
		// make up table data
		const exampleData = [
			{ name: 'Jeff', title: 'Software Engineer', hobbies: 'Basketball' },
			{ name: 'Michael', title: 'Senior Analyst', hobbies: 'Opera' },
			{ name: 'Dan', title: 'Quant Researcher', hobbies: 'Climbing' },
		];

		// make up column data
		const exampleColData = [
			{ name: 'Name', value: 'name' },
			{ name: 'Title', value: 'title' },
			{ name: 'Hobbies', value: 'hobbies' },
		];

		// populate table
		const thead = d3.select('.table').append('thead');
		thead.selectAll('td')
			.data(exampleColData)
			.enter().append('td')
				.text(d => d.name);

		const tbody = d3.select('.table').append('tbody');
		const rows = tbody.selectAll('tr')
			.data(exampleData)
			.enter().append('tr');
		rows.selectAll('td')
			.data(d => exampleColData.map(c => ({ rowData: d, colData: c })))
			.enter().append('td')
				.text(d => d.rowData[d.colData.value]);
	};
})();
