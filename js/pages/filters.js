(() => {
	App.initFilters = () => {
		// define example data (data should be an array of objects)
		const exampleData = [
			{ name: 'Option 1', value: '1', foo: 'bar1' },
			{ name: 'Option 2', value: '2', foo: 'bar2' },
			{ name: 'Option 3', value: '3', foo: 'bar3' },
		];

		// populate dropdowns with example data
		Util.populateSelect('select', exampleData, {
			nameKey: 'name',
			valKey: 'value',
		});

		// define single dropdown change behavior
		$('.single-dropdown').on('change', function onChange() {
			noty({ text: `Dropdown value is now ${$(this).val()}` });
		});


		// initialize multiselects
		const multiselectOptions = {
			includeSelectAllOption: true,
			onChange: (option, checked) => {
				noty({ text: `Changed option ${$(option).val()} to ${checked}` });
			},
			onSelectAll: () => {
				noty({ text: 'Selected all' });
			},
			onDeselectAll: () => {
				noty({ text: 'Deselected all' });
			},
		};

		$('.multi-dropdown-default').multiselect(multiselectOptions);
		multiselectOptions.buttonClass = 'btn btn-primary';
		$('.multi-dropdown-primary').multiselect(multiselectOptions);
	};
})();
