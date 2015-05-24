var exec = require('child_process').execSync;
var headerDOM;
var switchBranchDOM;
module.exports = {
	// Extend ebook resources and html
	book: {
		assets: "./book",
		js: ["./plugin.js", "https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", "./header/js/bootstrap.min.js", "./header/js/bootstrap-hover-dropdown.min.js"],
		css: [
			"https://www.google.com/fonts#UsePlace:use/Collection:Open+Sans:400,600", "./header/css/bootstrap.min.css", "./header/css/style.css"
		],
		html: {
			"html:start": function() {
				return "<!-- Start book " + this.options.title + " -->";
			},
			"html:end": function() {
				return "<!-- End of book " + this.options.title + " -->"
			},
			"head:start": "<!-- head:start -->",
			"head:end": "<link rel='shortcut icon' href='/favicon.ico' type='image/x-icon'><!-- head:end -->",
			"body:start": function() {
				return "<!-- body:start -->" + headerDOM;
			},
			"body:end": function() {
				var gaConfig = this.options.pluginsConfig['google-analytics'];
				if (gaConfig == 'default')
					gaConfig = '<!-- Google  -->' +
						'<script type="text/javascript">var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");' +
 						'document.write(unescape("%3Cscript src=\'" + gaJsHost + "google-analytics.com/ga.js\' type=\'text/javascript\'%3E%3C/script%3E"));' +
						'</script><script type="text/javascript" src="http://www.zkoss.org/resource/js/page/gaz.js"></script><!-- Google  -->'
				return gaConfig + "<!-- body:end -->";
			}
		}
	},
	// Hook process during build
	hooks: {
		// For all the hooks, this represent the current generator
		// This is called before the book is generated
		"init": function() {
			/** system must be Unix-like and install git  **/
			//get current branch
			var current = exec("git branch | sed -e '/^[^*]/d' -e 's/* \\(.*\\)/\\1/'").toString().trim();
			var invisible_div = '<div id="current-branch" style="display: none">' + current + '</div>';
			//get all branch from remote
			var command = "git ls-remote | awk '{print $2}' | awk 'BEGIN {FS=\"/\"} $2==\"heads\" {print $3}'"
			var result = exec(command).toString();
			var branches = result.split('\n');
			var buttons = '';
			for (var i in branches) {
				if (!(typeof branches[i] == 'string')) continue;
				var branch = branches[i].trim();
				var disabled = current == branch ? ' disabled' : '';
				if (branch.length > 0) {
					branch = branch.replace('*', '').trim();
					buttons += '<button class="button zk-branch-plugin ' + branch + '"' + disabled + '>' + branch + '</button>';
				}
			}
			var dropdown = '<div id="zk-swibranch-btn" class="dropdown pull-left">' + 
				'<a href="#" class="btn toggle-dropdown" aria-label="Toggle share dropdown"><i class="fa fa-file-text"></i> current: ' + 
				current + '</a><div class="dropdown-menu font-settings dropdown-left">' + 
				'<div class="dropdown-caret">' + 
				'<span class="caret-outer"></span>' + 
				'<span class="caret-inner"></span>' + '</div>' + 
				'<div class="buttons">' + buttons + '</div>' + '</div>' + '</div>';

			switchBranchDOM = dropdown + invisible_div;

			//get header file
			var fs = require('fs');
			headerDOM = '<div id="zk-document-header">' + fs.readFileSync(__dirname + '/book/header/header.html') + '</div>';
		},
		// This is called after the book generation
		"finish": function() {},
		"page": function(page) {
			page.sections.filter(function(section) {
				return section.type == 'normal';
			}).forEach(function(section) {
				section.content = switchBranchDOM + section.content;
			});
			return page;
		}
	}
};