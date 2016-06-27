function textEdit() {
	if (percentPassed < 0) {
		text = invalidDOB;
	}
	else if (decimalYearsAlive > 100) {
		text = aboveLE
	}
	else if (!isNaN(formDict['sex'] + formDict['country'] + decimalYearsAlive)) {
		text = Number(percentPassed).toFixed(9)
			 + '% of your life has passed';
	}
	else {
		text = fillFormMessage
	}
	$('#percentlifepassed').text(text);

	if ((currentDay - formDict['dayofbirth']) < 0) {
		monthsAlive = monthsAlive - 1;
		writeDays2 = Math.abs(currentDay - formDict['dayofbirth']);
	}
	else {
		writeDays2 = Math.abs(currentDay - formDict['dayofbirth'])
	}
	if (monthsAlive < 0) {
		yearsAlive = yearsAlive - 1;
		monthsAlive = 12 + monthsAlive;
	}
	// If '1', no 's' on the end of years/months/days/hours/minutes
	if (yearsAlive == 1) {
		writeYears = yearsAlive + " year, ";
	}
	else {
		writeYears = yearsAlive + " years, ";
	}
	if (monthsAlive == 1) {
		writeMonths = "1 month, ";
	}
	else {
		writeMonths = monthsAlive + " months, ";
	}
	if ((currentDay - formDict['dayofbirth']) == 1) {
		writeDays2 = "1 day, ";
	}
	else {
		writeDays2 = "and " + Math.abs(currentDay - formDict['dayofbirth']) + " days old";
	}
	// What is written for exact age
	if (isNaN(msAlive)) {
		age = fillFormMessage;
	}
	else if (yearsAlive == 0) {
		age = "You are " + writeMonths + writeDays2;
	}
	else {
		age = "You are " + writeYears + writeMonths + writeDays2;
	}
	// Stops fluctuating the length of time figures when number is less than 100 (ie 45 --> 045)
	if (currentSecond < 10) {
		currentSecond = "0" + currentSecond;
	}
	if (currentMinute < 10) {
		currentMinute = "0" + currentMinute;
	}
	// Determines the 'more infomation' section of the page
	if (slope == 0) {
		writeLE = "Your life expectancy is " + Number(lifeExpectancy).toFixed(3);
	}
	else {
		writeLE = "Your life expectancy is " + Number(lifeExpectancy).toFixed(9);
	}
	if ((isNaN(formDict['sex'] + formDict['country'] + decimalYearsAlive)) || (text == invalidDOB) || (isNaN(formDict['sex']))) {
		moreInfo = "";
	}
	else if (text == aboveLE) {
		moreInfo = "<b>More information</b>:<br/>" + age;
	}
	else {
		moreInfo = "<b>More Information</b>:<br/>" + age + "<br/>" + writeLE;
		moreInfo += ' years<br/>Every second you live, your life expectancy increases by ';
		moreInfo += Number(slope).toFixed(2) + " seconds<br/>";
	}
	$('#moreinfo').html(moreInfo);
}