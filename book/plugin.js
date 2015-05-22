require(["gitbook"], function(gitbook) {
	var tweakButton = function() {
		var path = window.location.pathname;
		var host = window.location.protocol + '//' + window.location.host;
		var current_branch = $('#current-branch').text().trim();
		//remove bad url of buttons
		$('button.zk-branch-plugin').each(function(idx, ele) {
			var branch = $(ele).text().trim();
			var link = path.replace('/' + current_branch + '/', '/' + branch + '/');
			$.ajax({
				url: host + link,
				success: function() {},
				error: function() {
					//remove button from web page
					$(ele).remove();
				}
			});
		});
		//regist onClick event to buttons
		$('button.zk-branch-plugin').click(function() {
			var select_branch = $(this).text().trim();
			if (current_branch != select_branch) {
				var link = path.replace('/' + current_branch + '/', '/' + select_branch + '/');
				$.ajax({
					url: host + link,
					success: function() {
						window.location.href = host + link;
					},
					error: function() {
						var index = link.indexOf('/' + select_branch + '/');
						window.location.href = host + link.substring(0, index) + '/' + select_branch;
					}
				});
			}
		});
	};

	var h = $('#zk-document-header').height();
	var b = $('div.book').height();
	gitbook.events.bind("page.change", function() {
		tweakButton();
		$('#zk-swibranch-btn').insertAfter('#font-settings-wrapper');
		//change book search text
		$('.book-search input').attr({
			"placeholder" : "Search this book"
		});
		$(window).scrollTop(0);
		$('div.book-summary > .summary > li:last').remove();
	});

	gitbook.events.bind("start", function() {
		$('.navbar .dropdown > a').click(function(){
            location.href = this.href;
        });
        $('div.book').height(b - h);
	});
});