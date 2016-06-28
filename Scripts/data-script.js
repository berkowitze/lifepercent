function leTable() {
	array = leDict[Object.keys(leDict)[formDict['country']]][formDict['sex']];
	for (i = 0; i < array.length; i++) {
		tr = $('<tr>');
		firstTD = $('<td>');
		firstTD.text((5 * i).toString());
		secondTD = $('<td>');
		secondTD.text(Number(array[i]).toFixed(1).toString());
		tr.append(firstTD, secondTD);
		$("#learray").append(tr);
	}
}

function dataChange(select) {
	$('#learray').html('<tr id="header-row"><td>Age</td><td>Life Expectancy</td></tr>');
	select = $(select);
	id = select.prop('id');
	val = parseInt(select.val());
	formDict[id] = val;
	sessionStorage.setItem(id, val);
	if (!isNaN(Number(formDict['country'])) && !isNaN(Number(formDict['sex']))) {
		leTable();
	}
	else {
		$('tr').not('#header-row').remove();
	}
}