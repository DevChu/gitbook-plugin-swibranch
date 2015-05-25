var isIE = document.documentMode;
if (isIE && isIE <= 9) {
	alert('Some functionality not supported on IE' + isIE +
		'\nPlease upgrade to IE10+ or Chrome');
}