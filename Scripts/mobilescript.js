function functionOne() {
	//Determines exact date
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
		msAlive = yearsAlive * msPerYear + monthsAlive * msPerMonth + daysAlive * msPerDay + msSinceMidnight;
		realYearsAlive = msAlive / msPerYear;
	//Determines Life Expectancy
		if ((isNaN(gender + countryValue))) {
			lifeExpectancy = dOBError;
		}
		else {
			ageRange = parseInt((realYearsAlive)/5);
			arrayToUse = lEArray[countryValue][gender];
			slope = (arrayToUse[ageRange + 1] - arrayToUse[ageRange])/5;
			yIntercept = arrayToUse[ageRange] - (slope * (ageRange * 5));
			lifeExpectancy = (slope * realYearsAlive) + yIntercept;
		}
	//Determining Main Return Number
		msPerLife = lifeExpectancy * msPerYear;
		percentLifePassed = (msAlive * 100)/msPerLife;
		derivPercent = (100 * yIntercept) / (lifeExpectancy * lifeExpectancy * msPerYear);
		nextPercent = (parseInt(percentLifePassed)) + 1;
		pUntilNextPercent = nextPercent - percentLifePassed;
		tUntilNextPercent = pUntilNextPercent / derivPercent;
		if (lifeExpectancy > 105) {
			text = aboveLE;
		}
		else if (isNaN(percentLifePassed)) {
			text = dOBError;
		}
		else if (percentLifePassed > 99) {
			text = almostDead;
		}
		else if (percentLifePassed < 0) {
			text = invalidDOB;
		}
		else {
			text = Number(percentLifePassed).toFixed(9) + "% of your life has passed"; 
		}
		document.getElementById("text").innerHTML = text;
		setTimeout(function () {functionOne()}, 50);
	//Done!
}