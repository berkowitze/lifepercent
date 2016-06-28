// Constants
var msPerYear = 3.15569e10;
var msPerMonth = 2.62974e9;
var msPerWeek = 604800000;
var msPerDay = 86400000;
var msPerHour = 3600000;
var msPerMinute = 60000;
var msPerSecond = 1000;
var minutesPerYear = 525949;
var secPerDay = 86400;
var averageDaysPerMonth = 30.4375;

// Messages
var fillFormMessage = "Please enter your birth country, date of birth, and gender";
var almostDead = "You're in your last moments";
var invalidDOB = "You're not alive... please enter a real date of birth";
var aboveLE = "You lived over your average life expectancy - Congratulations!";

var monthsOfYear = ['January', 'February', 'March',
					'April', 'May', 'June', 'July',
					'August', 'September', 'October',
					'November', 'December'];

formDict = {
	'yearofbirth': undefined,
	'monthofbirth': undefined,
	'dayofbirth': undefined,
	'sex': undefined,
	'country': undefined
}