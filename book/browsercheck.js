var isIE = document.documentMode;
if (isIE) {
	if (isIE == 9) {
		//show bootstrap alert, and remove swibranch button
		var btn = document.getElementById('zk-swibranch-btn');
		btn.parentNode.removeChild(btn);
		var alert = '<div class="alert alert-warning">' + 
		'<a href="#" class="close" data-dismiss="alert">&times;</a>' + 
		'<strong>Warning!</strong> Some functionality not supported on IE' + isIE +
		'. Please upgrade to IE10+ or Chrome.</div>';
		document.body.innerHTML = alert + document.body.innerHTML;

	} else if (isIE < 9) {
		//show alert and remove body
		var alert = '<div class="alert alert-danger">' + 
		'<strong>Error!</strong> You can not read this book on IE' + isIE +
		'. Please upgrade to IE10+ or Chrome.</div>';
		var allDiv = document.querySelectorAll('body > div');
		for (var i = 0; i < allDiv.length; i++) {
			allDiv[i].innerHTML = '';
		}
		document.body.innerHTML = alert + document.body.innerHTML;
	}
}