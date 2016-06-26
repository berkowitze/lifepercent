function calculateHealth(timeDict) {
	console.log('uh');
	totalImpact = 0;
	for (var i=0; i <= timeDict.length - 2; i++) {
		object = timeDict[i]
		calculateMinutesDetracted(object, object['activity']);
	}
	impact = 0;
	for (var i=0; i <= timeDict.length-2; i++) {
		impact += timeDict[i]['yearChange'];
	}
	formsOnChange(impact);
}

function calculateMinutesDetracted(object, activity) {
	if (activity.includes('Smoking')) {
		if (activity.indexOf('Pot') >= 0 || activity.indexOf('Marijuana') >= 0) {
			console.log('smokes but only pot');
		}
		else {
			cigaretteSmoker(object);
		}
	}
	else if (activity.includes('Flossing')) {

	}

	else {
		object.yearChange = 0;
	}
}

function cigaretteSmoker(object) {
	minutesSmoking = object.minuteTimeValue;
	percentTimeSmoking = minutesSmoking / 1440;
	yearsSmoking = lifeExpectancy - 17;
	minutesSmoking = percentTimeSmoking * yearsSmoking * minutesPerYear;
	cigarettesSmoked = minutesSmoking / 6;
	minutesLost = cigarettesSmoked * 11;
	yearsLost = minutesLost/minutesPerYear;
	yearChange = -1 * yearsLost;
	extraInfoHTML = 'Decreases your life expectancy by <red>' + String(yearsLost.toFixed(2)) + '</red> years<br/>Click for more information.';
	infoButton = createInfoButton('Health Pages/Cigarettes.html', extraInfoHTML);
	object['yearChange'] = yearChange;
	$(object.parentElement).append(infoButton);
}

function createInfoButton(url, extraInfoHTML) {
	infoButtonWrapper = $('<div class="infobuttonwrapper">');
	infoButton = $('<a>');
	infoButton.text('i');
	infoButton.addClass('infobutton');
	infoButton.attr('href', url);
	infoButton.attr('target', '_blank');
	extraInfo = $('<div class="extrainfo">');
	extraInfo.html(extraInfoHTML);
	infoButtonWrapper.mouseenter(function(event) {
		event.stopPropagation();
		$(this).children('div').addClass('extrainfodisplay');
	}).mouseleave(function(){
		event.stopPropagation();
		$(this).children('div').removeClass('extrainfodisplay');
	});
	infoButtonWrapper.append(extraInfo, infoButton);
	return infoButtonWrapper;
}

