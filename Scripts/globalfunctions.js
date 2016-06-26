
function local() {
	if ((document.URL == 'http://www.lifepercent.com') || (document.URL == 'http://lifepercent.com')) {
		$('edit').href = 'http://www.lifepercent.com';
	}
}

function expectancyAndAgeDetermination() {
	getAndSetFormVars();
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
	}
//Determining Main Return Number
	msPerLife = lifeExpectancy * msPerYear;
	percentLifePassed = msAlive * 100 / msPerLife;
}

function $(arg) {
	return document.getElementById(arg);
}

function $$(arg) {
	return document.getElementsByClassName(arg);
}

function $$$(arg) {
	return document.createElement(arg);
}

function getAndSetFormVars() {
	yob = parseInt($('yearofbirth').value);
	mob = parseInt($('monthofbirth').value);
	dob = parseInt($('dayofbirth').value);
	gender = parseInt($('genderselect').value);
	countryValue = parseInt($('country').value);
	sessionStorage.setItem('yob', yob);
	sessionStorage.setItem('mob', mob);
	sessionStorage.setItem('dob', dob);
	sessionStorage.setItem('gender', gender);
	sessionStorage.setItem('countryValue', countryValue);
}

function monthOfBirth() {
	mOBList = $('monthofbirth');
	for (i = 0; i < monthsOfYear.length; i++) {
		option = $$$('option');
		option.value = i;
		option.text = monthsOfYear[i];
		mOBList.add(option)
	}
	dayOfBirth(mOBList.value)
}

function dayOfBirth(days) {
	dOBList = $('dayofbirth');
	for (i = 1; i < (days + 1); i++) {
		option = $$$('option');
		option.value = i;
		option.text = i;
		dOBList.add(option);
	}
	dOBList.selectedIndex = saved;
}

function yearOfBirth() {
	yOBList = $('yearofbirth');
	for (i = (new Date().getFullYear()); i > (new Date().getFullYear()) - 105; i--) {
		option = $$$('option');
		option.value = i;
		option.text = i;
		yOBList.add(option);
	}
}

function dOBPopulate() {
	yearOfBirth();
	dayOfBirth(31);
	monthOfBirth();
}

function onloadFunction() {
	selectList = [['yob', 'yearofbirth'], ['mob', 'monthofbirth'],
	['dob', 'dayofbirth'], ['gender', 'genderselect'], ['countryValue', 'country']];
	z = 0;
	for (i=0; i <= selectList.length - 1; i++) {
		key = selectList[i][0];
		element = selectList[i][1];
		storageItem = sessionStorage.getItem(key);
		if ((storageItem != null) && (!isNaN(parseInt(storageItem)))) {
			try {
				$(element).value = storageItem;
				z += 1;
			}
			catch (err) {}
		}
	}
	if (z == 5) {
		if (!document.URL.includes('customize')) {
			expectancyAndAgeDetermination('Yes');
		}
	}
}

function lETable() {
	$("learray").innerHTML = "<td>Age</td><td>Life Expectancy</td>";
	countryValue = parseInt($('country').value);
	gender = parseInt($('genderselect').value);
	sessionStorage.setItem('countryValue', countryValue);
	sessionStorage.setItem('gender', gender);
	try{
		arrayToUse = lEArray[countryValue][gender];
		for (i = 0; i < arrayToUse.length; i++) {
			$("learray").innerHTML += "<td>" + 5 * i + "</td><td>" + Number(arrayToUse[i]).toFixed(1) + "</td>";
		}
	}
	catch(err) {}
}