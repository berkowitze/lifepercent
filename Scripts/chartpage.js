var secPerDay = 86400;
var averageDaysPerMonth = 30.4375;

function formsOnChange() {
	expectancyAndAgeDetermination();
	button = $('generate');
	if ((isNaN(lifeExpectancy)) || (lifeExpectancy == dOBError)) {
		button.disabled = true;
		button.innerHTML = 'Complete form above';
		removeLastNodes($$('activityObject'), 'T');
	}
	else {
		button.disabled = false;
		button.innerHTML = 'Done';
	}
	if ((lifeExpectancy != dOBError) && (!isNaN(lifeExpectancy))) {
		$('lifeexpectancy').innerHTML = 'Life expectancy: ' + Number(lifeExpectancy).toFixed(2);
	}
	else {
		$('lifeexpectancy').innerHTML = ' <br/>';
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
	$('daychart').innerHTML = chartHTML;
	ctx = $('chart').getContext('2d');
	pieChart = new Chart(ctx).Pie(dayDataSets, {animationSteps: 50, segmentShowStroke: false});
}

function addInputLine() {
	//Triggers: Plus button pressed; ifEnterContinue if remainder > 0
	if (calculateRemainingTime() > 0) {
		lineAddedOrRemoved();
		inputLine = createInputLine();
		$('customdata').appendChild(inputLine);
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
	removeLastNodes($$('activityObject'), 'T');
	newRemainingHours = remainingTime/3600;
	if (newRemainingHours > 1) {
		remainingHours = newRemainingHours;
		remainingLabel = 'Remaining Hours:'
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
		$('remaininglabel').innerHTML = remainingLabelString;
	}
	else {
		$('remaininglabel').innerHTML = '';
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

function removeLastNodes(list, tagFilter) {
	//Triggers: GenerateData; generateDayData
	for (var i=0; i <= list.length - 1; i++) {
		nodes = list[i].childNodes;
		lastNode = nodes[nodes.length-1];
		if (lastNode.tagName == tagFilter) {
			lastNode.remove();
		}
	}
}

function clean() {
	//Triggers: generateData
	for (var i=$$('activity').length-1; i>=0; i--) {
		activityList = $$('activity');
		timeList = $$('activityTimeValue');

		if (timeList[i].value == '') {
			removeLine(activityList[i]);
		}

		else if (activityList[i].value == '') {
			activityList[i].className += ' error';
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
	clean();
	removeLastNodes($$('activityObject'), 'T');
	remainder = calculateRemainingTime();
	if (remainder != 0) {
		removeOverflow(remainder);
	}

	newDuration = secPerDay;
	for (var i=0; i <= dayDataSets.length - 1; i++) {
		newDuration -= Number(dayDataSets[i]['value']) * 3600;
	}
	$('daychart').innerHTML = '';
	if (calculateRemainingTime() == 0) {
		$('remaininglabel').innerHTML = '';
	}
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
		b = $$$('t');
		b.className = 'yearsoflife';
		c = document.createTextNode(str);
		b.appendChild(c);
		timeDict[i]['parentElement'].appendChild(b);
	}
}

function ifEnterContinue(arg) {
	//Triggers: inputCheck; convertorDropdown keydown
	if (arg.keyCode == 13) {
		if (calculateRemainingTime() <= 0) {
			$('addInputLine').disabled = true;
			if ($('generate').disabled == false) {
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
	if ((!isNaN(lifeExpectancy)) && (lifeExpectancy != dOBError)) {
		$('addInputLine').disabled = false;
	}
	element = arg.path[0];
	if (isNaN(parseInt(element.value)) || parseInt(element.value) <= 0) {
		element.value = '';
	}
	ifEnterContinue(arg);
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
	if ($$('activity').length != 1) {
		try{arg.parentNode.remove();}
		catch(err){arg.path[1].remove();}
	}
	else {
		arg.path[1].childNodes[1].value = '';
		arg.path[1].childNodes[3].value = '';
		arg.path[1].childNodes[4].selectedIndex = 0;
	}
	lineAddedOrRemoved();
	activityList = $$('activity');
	if (activity[activityList.length-1] == '') {
		selectLast();
	}
}

function calculateRemainingTime() {
	//Triggers: Everywhere
	remainingSeconds = secPerDay;
	timeValues = $$('activityTimeValue');
	convertorValues = $$('convertorValues');
	for (var i = 0; i <= timeValues.length - 1; i++) {
		if (convertorValues[i].value == 'Hours') {
			secondsValue = Number(timeValues[i].value) * 3600;
		}
		else {
			secondsValue = Number(timeValues[i].value) * 60;
		}
		remainingSeconds -= secondsValue;
	}
	return remainingSeconds;
}

function activityCheck(arg) {
	//Triggers: activity input keydown
	element = arg.path[0];
	element.className = 'activity';
}

function removeOverflow(remainder) {
	//Triggers: generateData > remainder != 0
	timeDict = returnTimeDict();
	maxObject = timeDict.pop();
	maxElement = maxObject['maxElement'];
	maxValue = maxObject['maxValue'];
	maxConvertor = maxObject['maxConvertor'];
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
	q = $$('activity');
	final_item = q[q.length - 1];
	final_item.select()
}

function createInputLine() {
	//addInputLine > remainder > 0
	activityObject = $$$("p");
	activityObject.className = 'activityObject'
	activityInput = $$$("input");
	activityInput.placeholder = 'running';
	activityInput.addEventListener("keydown", activityCheck)
	activityInput.className = 'activity'

	timeValueInput = $$$("input");
	timeValueInput.type = 'number';
	timeValueInput.className = 'activityTimeValue';
	timeValueInput.addEventListener("keyup", inputCheck);
	timeValueInput.placeholder = '2';

	convertorDropdown = $$$("select");
	convertorDropdown.className = 'convertorValues';
	convertorDropdown.addEventListener('keydown', ifEnterContinue)
	option1 = $$$("option");
	option1.value = 'Hours';
	option1.text = 'Hours';

	option2 = $$$("option");
	option2.value = 'Minutes';
	option2.text = 'Minutes';

	convertorDropdown.add(option1);
	convertorDropdown.add(option2);

	removeLineButton = $$$("button");
	removeLineButton.className = 'removelinebutton'
	emDash = document.createTextNode("\u2014");
	removeLineButton.appendChild(emDash);
	removeLineButton.addEventListener('click', removeLine);

	iAmTextNode = document.createTextNode('I am ');
	forTextNode = document.createTextNode(' for ');
	perDayTextNode = document.createTextNode(' per day. ');
	activityObject.appendChild(iAmTextNode);
	activityObject.appendChild(activityInput);
	activityObject.appendChild(forTextNode);
	activityObject.appendChild(timeValueInput);
	activityObject.appendChild(convertorDropdown);
	activityObject.appendChild(perDayTextNode);
	activityObject.appendChild(removeLineButton);
	
	return activityObject;
}

function returnTimeDict() {
	//Triggers: generateData; generateDayData; removeOverflow
	timeValues = $$('activityTimeValue');
	convertorValues = $$('convertorValues');
	activityList = $$('activity');
	rawValueList = [];
	dict = [];
	c = 0;
	for (var i=0; i <= timeValues.length-1; i++) {
		activity = toTitleCase(activityList[i].value);
		timeValue = parseFloat(timeValues[i].value);
		convertorValue = convertorValues[i].value;
		parentElement = timeValues[i].parentNode;
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
		maxElement = $$('activityObject')[0];
	}

	try {
		maxConvertor = maxElement.childNodes[4].value;
	}
	catch(err) {
		maxConvertor = $$('convertValues')[0];
	}

	dict.push({maxValue: c, maxConvertor: maxConvertor, maxElement: maxElement})
	return dict;
}