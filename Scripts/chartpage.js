function formsOnChange(impact) {
	formComplete(impact)
	button = $('#generate');
	if ((isNaN(lifeExpectancy)) || (lifeExpectancy == fillFormMessage)) {
		button.prop('disabled', true);
		button.text('Complete form above');
		removeLastNodes();
	}
	else {
		button.prop('disabled', false);
		button.text('Done');
	}
	if ((lifeExpectancy != fillFormMessage) && (!isNaN(lifeExpectancy))) {
		$('#lifeexpectancy').html('');
		$('#lifeexpectancy').append('Life expectancy: ', Number(lifeExpectancy).toFixed(2));
		if (impact > 0) {
			p1 = '<br/>Your activities increase your life expectancy by ';
			p2 = $('<green>');
			p2.text(impact.toFixed(2));
			p3 = ' years';
			$('lifeexpectancy').append(p1, p2, p3);
		}
		else if (impact < 0) {
			p1 = '<br/>Your activities decrease your life expectancy by ';
			p2 = $('<red>');
			p2.text(impact.toFixed(2) * -1);
			p3 = ' years.';
			$('#lifeexpectancy').append(p1, p2, p3);
		}
		else if (impact == 0) {
			p1 = '<br/>Calculator did not detect any life expectancy changes based on your inputs.';
			$('#lifeexpectancy').append(p1);
		}
		else {

		}
		if (!isNaN(impact)) {
			$('#lifeexpectancy').append('<br/><a href="calculator.html">Return to main page</a>')
		}
	}
	else {
		$('#lifeexpectancy').html('<br/>');
	}
}

function lineAddedOrRemoved() {
	//Triggers: addInputLine if remainder != 0; removeLine
	dayDataSets = [];
	chartHTML = '<canvas id="chart" width="200" height="200"></canvas>';
	generateDayData();
	dayBreakdownChart();
}

function dayBreakdownChart() {
	//Triggers: dayBreakdownChart
	$('#daychart').html(chartHTML);;
	ctx = $('#chart').get(0).getContext('2d');
	pieChart = new Chart(ctx).Pie(dayDataSets, {animationSteps: 50, segmentShowStroke: false});
}

function addInputLine() {
	//Triggers: Plus button pressed; ifEnterContinue if remainder > 0
	if (calculateRemainingTime() > 0) {
		lineAddedOrRemoved();
		inputLine = createInputLine();
		$('#customdata').append(inputLine);
		selectLast();
	}
	else {
		generateData();
	}
}

function updateGenerator() {
	//Triggers: Personal Form onchange
	if (calculateRemainingTime() <= 0) {
		generateData();
	}
}

function generateDayData() {
	//Triggers: lineAddedOrRemoved; 
	remainingTime = calculateRemainingTime();
	if (remainingTime <= 0) {
		generateData();
		return;
	}
	removeLastNodes();
	newRemainingHours = remainingTime/3600;
	if (newRemainingHours > 1) {
		remainingHours = newRemainingHours;
		remainingLabel = 'Remaining Hours:';
	}
	else if (newRemainingHours > 0) {
		remainingHours = newRemainingHours*60;
		remainingLabel = 'Remaining Minutes:';
	}
	else {}
	dayDataSets.push({
		value: newRemainingHours.toFixed(2),
		color: "#D3D3D3",
		label: "Remaining Hours"
	});
	remainingLabelString = remainingLabel + ' ' + Number(remainingHours).toFixed(2);
	if (remainingHours != 0) {
		$('#remaininglabel').text(remainingLabelString);
	}
	else {
		$('#remaininglabel').html('');
	}

	timeDict = returnTimeDict();

	for (var i = 0; i <= timeDict.length-2; i++) {
		if (timeDict[i]['defined']) {
			dayDataSets.push({
				value: (timeDict[i]['minuteTimeValue'] / 60).toFixed(2),
				color: timeDict[i]['color'],
				label: timeDict[i]['activity']
			})
		}
	}
}

function removeLastNodes() {
	//Triggers: GenerateData; generateDayData
	activityObjectList = $('.activityObject').get();
	for (i=0; i<=activityObjectList.length-1; i++) {
		childrenList = $('.activityObject').get(i);
		for (m=activityObjectList[i].childNodes.length-1; m>=7; m--) {
			activityObjectList[i].childNodes[m].remove();
		}	
	}
}

function clean() {
	//Triggers: generateData
	for (var i=$('.activity').length-1; i>=0; i--) {
		activityList = $('.activity');
		timeList = $('.activityTimeValue');

		if (timeList.eq(i).val() == '') {
			removeLine(activityList.get(i));
		}
		else if (activityList.eq(i).val() == '') {
			activityList.eq(i).addClass('error');
		}
		else {}

	}
}

function generateData() {
	/*Triggers:
		Done buttom pressed; ifEnterContinue > enter > remainder <= 0;
		addInputLine > remainder < 0;
		updateGenerator > remainder <= 0;
		generateDayData > remainder <= 0
	*/
	if (calculateRemainingTime() > 0) {
		return;
	}
	clean();
	expectancyAndAgeDetermination();
	removeLastNodes();
	remainder = calculateRemainingTime();
	if (remainder > 0) {
		removeOverflow(remainder);
	}

	newDuration = secPerDay;
	dayDataSets.map(function(dataSet){
		newDuration -= dataSet.value;
	});

	$('#daychart').html('');
	$('#remaininglabel').html('');
	if (isNaN(lifeExpectancy)) {
		formsOnChange();
		return;
	}
	timeDict = returnTimeDict();
	
	for (var i=0; i <= timeDict.length - 2; i++) {
		originalValue = timeDict[i]['minuteTimeValue'] / 1440 * lifeExpectancy;
		value = originalValue;

		worded_value = Number(value).toFixed(2) + ' years';
		if (value < 1) {
			value *= 12;
			worded_value = Number(value).toFixed(2) + ' months';
		}
		if (value < 1) {
			value *= averageDaysPerMonth;
			worded_value = Number(value).toFixed(2) + ' days'
		}
		itemPercentOfLife = Number(originalValue/lifeExpectancy * 100).toFixed(2)
		str = '\t\t' + worded_value + ' (' + itemPercentOfLife + '%) of your life';
		b = $('<t class="yearsoflife">');
		b.text(str);
		$(timeDict[i]['parentElement']).append(b);
	}
	if ($('#allowActivityImpact').prop('checked')) {
		calculateHealth(timeDict);
	}
}

function ifEnterContinue(arg) {
	//Triggers: inputCheck; convertorDropdown keydown
	if (arg.keyCode == 13) {
		if (calculateRemainingTime() <= 0) {
			$('#addInputLine').prop('disabled', true);
			if (!$('#generate').prop('disabled')) {
				generateData();
			}
		}
		else {
			addInputLine();
		}
	}
}

function inputCheck(arg) {
	//Triggers: activityTimeValue Keyup
	if (calculateRemainingTime() > 0) {
		$('#addInputLine').prop('disabled', false);
	}
	element = $(arg.target);
	if (element.val() != '' && element.siblings('input').val() != '') {
		ifEnterContinue(arg);
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

function removeLine(arg) {
	//Triggers: clean > timeList[i] == ''; minus button pressed
	if ($('.activity').length != 1) {
		try{arg.parentNode.remove();}
		catch(err){arg.path[1].remove();}
	}
	else {
		clearFirstLine();
	}
	lineAddedOrRemoved();
	activityList = $('.activity');
	if (activity[activityList.length-1] == '') {
		selectLast();
	}
}

function clearFirstLine() {
	//Triggers: removeLine > activityList.length == 1
	line = $('.activityObject').first();
	line.children('input').val('');
	line.children('select').get(0).selectedIndex = 1;
}

function calculateRemainingTime() {
	//Triggers: Everywhere
	remainingSeconds = secPerDay;
	timeValues = $('.activityTimeValue');
	convertorValues = $('.convertorValues');
	timeValues.map(function(l){
		timeVal = timeValues.eq(l);
		convertorVal = convertorValues.eq(l);
		if (convertorVal.val() == 'Hours') {
			remainingSeconds -= timeVal.val() * 3600;
		}
		else {
			remainingSeconds -= timeVal.val() * 60;
		}
	});
	return remainingSeconds;
}

function activityCheck(arg) {
}

function removeOverflow(remainder) {
	//Triggers: generateData > remainder != 0
	timeDict = returnTimeDict();
	maxObject = timeDict.pop();
	maxElement = maxObject.maxElement;
	maxValue = maxObject.maxValue;
	maxConvertor = maxObject.maxConvertor;
	if (maxConvertor == 'Hours') {
		maxValue /= 60
		remainder /= 3600;
	}
	else {
		remainder /= 60;
	}
	newValue = maxValue + remainder;
	maxElement.childNodes[3].value = newValue;
}

function selectLast() {
	//Triggers: addInputLine > remainder >=0; removeLine > last activity == ''
	q = $('.activity').last().focus();
}

function createInputLine() {
	//addInputLine > remainder > 0
	activityObject = $('<p class="activityObject">');
	activityInput = $('<input class="activity">');
	activityInput.attr('placeholder', 'running');
	activityInput.keydown(activityCheck);

	timeValueInput = $('<input type="number" class="activityTimeValue">');
	timeValueInput.keyup(inputCheck);
	timeValueInput.attr('placeholder', '2');

	convertorDropdown = $('<select class="convertorValues">');
	convertorDropdown.keydown(ifEnterContinue);
	option1 = $('<option>');
	option1.val('Hours');
	option1.text('Hours');

	option2 = $('<option>');
	option2.val('Minutes');
	option2.text('Minutes');

	convertorDropdown.append(option1, option2);

	removeLineButton = $('<button class="removelinebutton">');
	removeLineButton.text('\u2014');
	removeLineButton.click(removeLine);

	activityObject.append('I am ', activityInput, ' for ',
		timeValueInput, convertorDropdown, ' per day. ', removeLineButton)
	
	return activityObject;
}

function returnTimeDict() {
	//Triggers: generateData; generateDayData; removeOverflow
	timeValues = $('.activityTimeValue');
	convertorValues = $('.convertorValues');
	activityList = $('.activity');
	rawValueList = [];
	dict = [];
	c = 0;
	for (var i=0; i <= timeValues.length-1; i++) {
		activity = toTitleCase(activityList.eq(i).val());
		timeValue = parseFloat(timeValues.eq(i).val());
		convertorValue = convertorValues.eq(i).val();
		parentElement = timeValues.eq(i).parent();
		if (convertorValue == 'Hours') {
			minuteTimeValue = parseFloat(timeValue) * 60;
		}
		else {
			minuteTimeValue = parseFloat(timeValue);
		}
		rawValueList.push(minuteTimeValue);
		if (minuteTimeValue > c) {
			c = minuteTimeValue;
		}

		if (isNaN(minuteTimeValue)) {
			defined = false;
		}
		else {
			defined = true;
		}

		dict.push({
			i: i,
			activity: activity,
			minuteTimeValue: minuteTimeValue,
			originalValue: timeValue,
			parentElement: parentElement,
			color: rainbow(timeValues.length, i),
			secondsValue: minuteTimeValue * 60,
			defined: defined
		});
	}
	try{
		maxElement = timeValues[rawValueList.indexOf(c)].parentNode;
	}
	catch(err) {
		maxElement = $('.activityObject').first();
	}

	try {
		maxConvertor = maxElement.children().eq(4).val();
	}
	catch(err) {
		maxConvertor = $('.convertValues')[0];
	}

	dict.push({maxValue: c, maxConvertor: maxConvertor, maxElement: maxElement})
	return dict;
}