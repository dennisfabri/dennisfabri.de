---
layout: null
excluded_in_search: true
---
(function () {
	function getQueryVariable(variable) {
		var query = window.location.search.substring(1),
			vars = query.split("&");

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");

			if (pair[0] === variable) {
				return decodeURIComponent(pair[1].replace(/\+/g, '%20')).trim();
			}
		}
	}

	function getPreview(query, content, previewLength) {
		previewLength = previewLength || (content.length * 2);

		var parts = query.split(" "),
			match = content.toLowerCase().indexOf(query.toLowerCase()),
			matchLength = query.length,
			preview;

		// Find a relevant location in content
		for (var i = 0; i < parts.length; i++) {
			if (match >= 0) {
				break;
			}

			match = content.toLowerCase().indexOf(parts[i].toLowerCase());
			matchLength = parts[i].length;
		}

		// Create preview
		if (match >= 0) {
			var start = match - (previewLength / 2),
				end = start > 0 ? match + matchLength + (previewLength / 2) : previewLength;

			preview = content.substring(start, end).trim();

			if (start > 0) {
				preview = "..." + preview;
			}

			if (end < content.length) {
				preview = preview + "...";
			}

			// Highlight query parts
			preview = preview.replace(new RegExp("(" + parts.join("|") + ")", "gi"), "<strong>$1</strong>");
		} else {
			// Use start of content if no match found
			preview = content.substring(0, previewLength).trim() + (content.length > previewLength ? "..." : "");
		}

		return preview;
	}

	function displaySearchResults(results, query) {
		var searchResultsEl = document.getElementById("search-results");
		var searchProcessEl = document.getElementById("search-process");

		if (results.length) {
			var resultsHTML = "";
			results.forEach(function (result) {
				var item = window.data[result.ref];
                if (item.title) {
					var contentPreview = getPreview(query, item.content, 450);
					var titlePreview = getPreview(query, item.title);
					var url = "{{ site.baseurl }}" + item.url.trim();
					resultsHTML += "<li>";
					resultsHTML += "<p style='margin-bottom: 0em; color: #4d5156;'><small>" + item.url.trim() + " - " + item.type + "</small></p>";
					resultsHTML += "<h4 style='margin-top: 0em; margin-bottom: 0.1em;'><a href='" + url + "'>" + titlePreview + "</a></h4>";
					resultsHTML += "<p style='color: #4d5156;'>" + contentPreview + "</p>";
					resultsHTML += "</li>";
				}
			});

			searchResultsEl.innerHTML = resultsHTML;
			searchProcessEl.innerText = "Zeige";
		} else {
			searchResultsEl.style.display = "none";
			searchProcessEl.innerText = "Keine";
		}
	}

	var documents = [];
	for (var key in window.data) {
		documents.push(window.data[key]);
	}

	var idx = lunr(function () {
		this.ref("id");
		this.field("title", {boost: 10});
		this.field("categories");
		// this.field("url");
		this.field("content");
		this.field("type");
	  
		documents.forEach(doc => this.add(doc));
	  });

	  var query = decodeURIComponent((getQueryVariable("q") || "").replace(/\+/g, "%20")),
	  searchQueryContainerEl = document.getElementById("search-query-container"),
	  searchQueryEl = document.getElementById("search-query");

	  searchQueryEl.innerText = query;
	  if (query != ""){
		 searchQueryContainerEl.style.display = "inline";
	  }
	  
	  displaySearchResults(idx.search(query), query); // Hand the results off to be displayed	  
})();
