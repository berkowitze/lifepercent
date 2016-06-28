function formComplete(healthImpact=0, editText=false) {
	d = new Date();
	currentYear 	= d.getFullYear();
	currentMonth 	= d.getMonth();
	currentDay 		= d.getDate();
	currentHour 	= d.getHours();
	currentMinute 	= d.getMinutes();
	currentSecond 	= d.getSeconds();
	currentMillisecond = d.getMilliseconds();

	msSinceMidnight = currentHour * msPerHour
					+ currentMinute * msPerMinute
					+ currentSecond * msPerSecond
					+ currentMillisecond;

	yearsAlive 	= currentYear - formDict['yearofbirth'];
	monthsAlive = currentMonth - formDict['monthofbirth'];
	daysAlive 	= currentDay - formDict['dayofbirth'];
	msAlive 	= yearsAlive * msPerYear
				+ monthsAlive * msPerMonth
				+ daysAlive * msPerDay
				+ msSinceMidnight;
	decimalYearsAlive = msAlive / msPerYear;
	range = parseInt(decimalYearsAlive / 5);
	array = leDict[Object.keys(leDict)[formDict['country']]][formDict['sex']];
	try {
		slope 			= (array[range + 1] - array[range]) / 5;
	}
	catch(err) {
		clearInterval(interval);
	}
	yIntercept 		= array[range] - (slope * range * 5);
	lifeExpectancy 	= slope * decimalYearsAlive + yIntercept;
	lifeExpectancy 	+= healthImpact;

	msInLife = lifeExpectancy * msPerYear;
	percentPassed = msAlive * 100 / msInLife;
	if (editText) {
		textEdit();
	}
}

function formIncomplete() {
	try {
		clearInterval(interval);
	}
	catch(err) {}
	finally {
		$('#percentlifepassed').text(fillFormMessage);
		$('#moreinfo').text('');
	}
}

function formChange(select) {
	select = $(select);
	id = select.prop('id');
	val = parseInt(select.val());
	formDict[id] = val;
	sessionStorage.setItem(id, val);

	changeCheck(Object.keys(formDict).map(
		function(key) {
			return formDict[key];
		}
	));
}

function fillForm(forms) {
	if (forms == 'slim') {
		selectList = ['country', 'sex'];
	}
	else {
		selectList = ['country', 'monthofbirth', 'dayofbirth', 'yearofbirth', 'sex'];
	}
	selectChanged = false;
	changeCheck(selectList.map(function(id) {
		storageItem = parseInt(sessionStorage.getItem(id));
		formDict[id] = storageItem;
		select = $('select#' + id);
		if ((storageItem != null) && Number.isInteger(storageItem)) {
			select.val(storageItem);
			return storageItem;
		}
		else if (!selectChanged) {
			select.focus();
			selectChanged = true;
		}
	}));
}

function changeCheck(arr) {
	arrCheck = arr.every(Number.isInteger);
	if (useInterval && arrCheck) {
		interval = setInterval(
			function(){formComplete(impact=0, editText=true)},
			50);
	}
	else if (arrCheck) {
		formComplete();
	}
	else {
		formIncomplete();
	}
}

function genSelects(forms) {
	normGroup = $('optgroup#normalgroup');
	recommendedGroup = $('optgroup#recommendedgroup');
	Object.keys(leDict).map(function(countryName, i) {
		option = $('<option>');
		option.val(i);
		option.text(countryName);
		if (i != 179 || i != 30) {	
			normGroup.append(option);	
		}
	});
	option = $('<option>');
	option.val(179);
	option.text('United States');
	recommendedGroup.append(option);
	option = $('<option>');
	option.val(30);
	option.text('Canada');
	recommendedGroup.append(option);

	if (forms == 'all') {
		monthSelect = $('#monthofbirth');
		for (i=0; i < monthsOfYear.length; i++) {
			option = $('<option>');
			option.val(i);
			option.text(monthsOfYear[i]);
			monthSelect.append(option);
		}

		daySelect = $('#dayofbirth');
		for (i=1; i <= 31; i++) {
			option = $('<option>');
			option.val(i);
			option.text(i);
			daySelect.append(option);
		}

		year = new Date().getFullYear();
		yearSelect = $('#yearofbirth');
		for (i=year; i > (year - 105); i--) {
			option = $('<option>');
			option.val(i);
			option.text(i);
			yearSelect.append(option);
		}
	}
}

$(document).ready(function() {
	if (document.title.includes('Calculator')) {
		$('a[href="calculator.html"]').addClass('currentPage');
		useInterval = true;
		genSelects('all');
		fillForm('all');
	}
	else if (document.title.includes('Customize')) {
		$('a[href="customize.html"]').addClass('currentPage');
		useInterval = false;
		genSelects('all');
		fillForm('all');
	}
	else if (document.title.includes('Data')) {
		$('a[href="data.html"]').addClass('currentPage');
		useInterval = false;
		genSelects('slim');
		fillForm('slim');
		dataChange();
	}
	else {}
});

function ind(inp) {
	if (inp == undefined) {
		console.log('ind');
	}
	else {console.log(inp)}
}