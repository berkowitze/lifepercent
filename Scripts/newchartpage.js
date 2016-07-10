function addInputLine() {
	$('#customInputSection').append(createInputLine());
	$('.activity').last().focus();
}

function createInputLine() {
	activityObject = $('<p class="activityObject">');
	activityInput = $('<input class="activity">');
	activityInput.attr('placeholder', 'running');
	//activityInput.keydown(activityCheck);

	timeValueInput = $('<input class="activityTime">');
	timeValueInput.keyup(validTime);
	timeValueInput.attr('placeholder', '2');

	convertorDropdown = $('<select class="timeConvertor">');
	convertorDropdown.keydown(ifEnterContinue);
	option1 = $('<option>');
	option1.val('60');
	option1.text('Hours');

	option2 = $('<option>');
	option2.val('1');
	option2.text('Minutes');

	convertorDropdown.append(option1, option2);

	removeLineButton = $('<button class="removelinebutton">');
	removeLineButton.text('\u2014');
	removeLineButton.click(removeClick);

	activityObject.append('I am ', activityInput, ' for ',
		timeValueInput, convertorDropdown, ' per day. ', removeLineButton)
	
	return activityObject;
}

function inputCheck(arg) {
	//Triggers: activityTime Keyup
	if (remainingTime() > 0) {
		$('#addInputLine').prop('disabled', false);
	}
	element = $(arg.target);
	if (element.val() != '' && element.siblings('input').val() != '') {
		ifEnterContinue(arg);
	}
}

function ifEnterContinue(arg) {
	if (arg.keyCode != 13) {
		return;
	}
	remainder = remainingTime();
	if (remainder <= 0) {
		$('#addInputLine').prop('disabled', true);
		removeOverflow(remainder);
		if (!$('#generate').prop('disabled')) {
			generateData();
		}
	}
	else {
		addInputLine();
	}
}

function removeClick(arg) {
	removeLine($(arg.target).parent().find('.activity'));
}

function removeLine(activity) {
	activity.parent().remove();
	if ($('.activity').length == 0) {
		addInputLine();
	}
	//activity.parent().remove();
	//if ($('.activity').length != 1) {
	//	try{arg.parentNode.remove();}
	//	catch(err){arg.path[1].remove();}
	//}
	//else {
	//	clearFirstLine();
	//}
	//lineAddedOrRemoved();
	//activityList = $('.activity');
	//if (activity[activityList.length-1] == '') {
	//	selectLast();
	//}
}

function remainingTime() {
	remaining = 1440;
	timeDict().map(function(i, obj) {
		remaining -= obj['timeValue'];
	});
	return remaining;
}

function timeDict() {
	//Triggers: generateData; generateDayData; removeOverflow
	timeValues = $('.activityTime');
	timeConvertor = $('.timeConvertor');
	activityList = $('.activity');
	return timeValues.map(function(i) {
		activity = toTitleCase(activityList.eq(i).val());
		timeValue = timeValues.eq(i).val()
				  * timeConvertor.eq(i).val();
		parentElement = timeValues.eq(i).parent();
		return {
			i: i,
			activity: activity,
			timeValue: timeValue,
			convertor: timeConvertor.eq(i).val(),
			elem: parentElement,
			color: rainbow(timeValues.length, i),
			defined: !isNaN(timeValue)
		}
	});
}

function generateData() {
	clean(remainingTime());
	removeOverflow(remainingTime());
	if (remainingTime() != 0) {
		alert('REMAINING TIME IS NOT ZERO WHY');
	}
	console.log('generateData called');
}

function clean(remainder) {
	$('.activity').get().reverse().map(function(activity, i) {
		activity = $(activity);
		time = $($('.activityTime').get().reverse()[i]);
		if (time.val() == '') {
			removeLine(activity);
		}
		else if (activity.val() == '') {
			activity.addClass('error');
			activity.focus();
		}
		else {}
	});
}

function removeOverflow(remainder) {
	timeList = timeDict();
	times = timeList.map(function(a, b) {
		return b.timeValue;
	}).toArray();
	maxObject = timeList[times.indexOf(Math.max(...times))];
	if (remainder % 60 == 0 && maxObject.convertor == '60') {
		convertor = '60';
		newValue = maxObject.timeValue / 60 + remainder / 60;
	}
	else {
		convertor = '1';
		newValue = maxObject.timeValue + remainder;
	}
	maxObject.elem.find('.timeConvertor').val(convertor);
	maxObject.elem.find('.activityTime').val(newValue);
}

function getImpact() {

}

function textEdit(impact) {
	le = lifeExpectancy.toFixed(2);
	if (impact == undefined) {
		text = 'Your life expectancy is ' + le + ' years.';
	}
	else if (impact > 0) {
		leText = $('<green>').text(le)[0].outerHTML
		impactText = $('<green>').text(impact + ' years.')[0].outerHTML;
		text = 'Your life expectancy is '
			 + leText
			 + ' years. Your activities increase this by '
			 + impactText
	}
	else if (impact < 0) {
		leText = $('<red>').text(le)[0].outerHTML
		impactText = $('<red>').text((impact * -1) + ' years.')[0].outerHTML;
		text = 'Your life expectancy is '
			 + leText
			 + ' years. Your activities decrease this by '
			 + impactText
	}
	else {
		text = 'Your life expectancy is ' + $('<green>').text(le)[0].outerHTML;
		text += ' years, and is uneffected by your activities.';
	}
	$('#lifeexpectancy').html(text);
}

// Helper functions

function validTime(event) {
	elem = $(event.currentTarget);
	val = elem.val();
	// if invalid time input
	if (!Number.isInteger(Number(val)) || val.includes('.') || val.includes(' ')) {
		elem.val(val.slice(0, -1));
	}
	// otherwise
	else {
		ifEnterContinue(event);
	}
}

function toTitleCase(str) {
	//Triggers: returnTimeDict
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function rainbow(numOfSteps, step) {
	//Triggers: returnTimeDict
	// Adam Cole, 2011-Sept-14
	// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	var r, g, b;
	var h = step / numOfSteps;
	var i = ~~(h * 6);
	var totaled_seconds = h * 6 - i;
	var q = 1 - totaled_seconds;
	switch(i % 6){
		case 0: r = 1, g = totaled_seconds, b = 0; break;
		case 1: r = q, g = 1, b = 0; break;
		case 2: r = 0, g = 1, b = totaled_seconds; break;
		case 3: r = 0, g = q, b = 1; break;
		case 4: r = totaled_seconds, g = 0, b = 1; break;
		case 5: r = 1, g = 0, b = q; break;
	}
	var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
	return (c);
}
