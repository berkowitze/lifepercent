<<<<<<< HEAD
function local() {
	if (document.URL == 'http://www.lifepercent.com' || document.URL == 'http://lifepercent.com') {
		$('#edit').href = 'http://www.lifepercent.com';
	}
}

function expectancyAndAgeDetermination(impact) {
	getAndSetFormVars();
	if (impact == undefined) {
		impact = 0;
	}
=======
function expectancyAndAgeDetermination(impact=0) {
	getAndSetFormVars();
>>>>>>> master
	d = new Date();
	currentYear = d.getFullYear();
	currentMonth = d.getMonth();
	currentDay = d.getDate();
	currentHour = d.getHours();
	currentMinute = d.getMinutes();
	currentSecond = d.getSeconds();
	currentMillisecond = d.getMilliseconds();
	//Milliseconds since midnight
	totalMsInHoursOfDay = currentHour * msPerHour;
	msSinceMidnight = totalMsInHoursOfDay + currentMinute * msPerMinute + currentSecond * msPerSecond + currentMillisecond;
//Determines milliseconds alive
	yearsAlive = currentYear - yob;
	monthsAlive = currentMonth - mob;
	daysAlive = currentDay - dob;
	msAlive = yearsAlive * msPerYear + monthsAlive * msPerMonth + (currentDay - dob) * msPerDay + msSinceMidnight;
	realYearsAlive = msAlive / msPerYear;
//Determines Life Expectancy
	if (isNaN(gender + countryValue)) {
		lifeExpectancy = dOBError;
	}
	else {
		ageRange = parseInt((realYearsAlive)/5);
		arrayToUse = lEArray[countryValue][gender];
		slope = (arrayToUse[ageRange + 1] - arrayToUse[ageRange])/5;
		yIntercept = arrayToUse[ageRange] - (slope * (ageRange * 5));
		lifeExpectancy = slope * realYearsAlive + yIntercept;
		lifeExpectancy += impact;
	}
//Determining Main Return Number
	msPerLife = lifeExpectancy * msPerYear;
	percentLifePassed = msAlive * 100 / msPerLife;
}

function getAndSetFormVars() {
	yob = parseInt($('#yearofbirth').val());
	mob = parseInt($('#monthofbirth').val());
	dob = parseInt($('#dayofbirth').val());
	gender = parseInt($('#genderselect').val());
	countryValue = parseInt($('#country').val());
	sessionStorage.setItem('yob', yob);
	sessionStorage.setItem('mob', mob);
	sessionStorage.setItem('dob', dob);
	sessionStorage.setItem('gender', gender);
	sessionStorage.setItem('countryValue', countryValue);
}

function monthOfBirth() {
	mOBList = $('#monthofbirth');
	for (i = 0; i < monthsOfYear.length; i++) {
		option = $('<option>');
		option.val(i);
		option.text(monthsOfYear[i]);
		mOBList.append(option);
	}
	dayOfBirth(mOBList.value)
}

function dayOfBirth(days) {
	dOBList = $('#dayofbirth');
	for (i = 1; i < (days + 1); i++) {
		option = $('<option>');
		option.val(i);
		option.text(i);
		dOBList.append(option);
	}
	dOBList.get(0).selectedIndex = saved;
}

function yearOfBirth() {
	yOBList = $('#yearofbirth');
	for (i = (new Date().getFullYear()); i > (new Date().getFullYear()) - 105; i--) {
		option = $('<option>');
		option.val(i);
		option.text(i);
		yOBList.append(option);
	}
}

function dOBPopulate() {
	yearOfBirth();
	dayOfBirth(31);
	monthOfBirth();
}

<<<<<<< HEAD
=======
function getDropdown() {
	$('div#country-dropdown').load('templates/country-dropdown.html');
}

>>>>>>> master
function onloadFunction() {
	if (document.title.indexOf('Personal Info') >= 0) {
		selectList = [['gender', 'genderselect'], ['countryValue', 'country']];
	}
	else {
		selectList = [['yob', 'yearofbirth'], ['mob', 'monthofbirth'],
	['dob', 'dayofbirth'], ['gender', 'genderselect'], ['countryValue', 'country']];
	}
	z = 0;
	for (i=0; i <= selectList.length - 1; i++) {
		key = selectList[i][0];
		element = selectList[i][1];
		storageItem = sessionStorage.getItem(key);
		if ((storageItem != null) && (!isNaN(parseInt(storageItem)))) {
			try {
				$('#' + element).val(storageItem);
				z += 1;
			}
			catch (err) {}
		}
	}
	if (z == 5) {
		if (document.title != 'Passing Life - Custom Data') {
			expectancyAndAgeDetermination('Yes');
		}
	}
}

function lETable() {
	$('#learray').html('<td>Age</td><td>Life Expectancy</td>');
	countryValue = parseInt($('#country').val());
	gender = parseInt($('#genderselect').val());
	sessionStorage.setItem('countryValue', countryValue);
	sessionStorage.setItem('gender', gender);
	try {
		arrayToUse = lEArray[countryValue][gender];
		for (i = 0; i < arrayToUse.length; i++) {
			tr = $('<tr>');
			firstTD = $('<td>');
			firstTD.text((5 * i).toString());
			secondTD = $('<td>');
			secondTD.text(Number(arrayToUse[i]).toFixed(1).toString());
			tr.append(firstTD, secondTD);
			$("#learray").append(tr);
		}
	}
	catch(err) {
		console.log(err.toString());
	}
}