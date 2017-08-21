$(document).ready(function() {
	getGreeting();
	getContent();
	$("#save").click(saveSettings);
	$("#button_Settings").click(loadModal);
});

function getGreeting() {
	var hour = new Date().getHours();
	var comments = [];
	var greeting = "";
	if (hour < 6) {
		greeting = "night";
		comments = ["You really should be sleeping right now.",
					"Why are you still awake?",
					"BOO!"];
	} else if (hour >= 6 && hour < 12) {
		greeting = "morning";
		comments = ["Something something insert inspirational quote here.",
					"Wow you actually woke up.",
					"WAKEY WAKEY!"];
	} else if (hour >= 12 && hour < 18) {
		greeting = "afternoon";
		comments = ["Don't forget to drink water!",
					"Look at how much of your day you've already wasted.",
					"a.k.a. it's time for a nap!"];	
	} else {
		greeting = "evening";
		comments = ["I hope you didn't just wake up...",
					"Make sure you sleep early tonight <small>(you won't)</small>.",
					"AHHH your assignment is due at 11:59!"
					]
	}
	$("#greeting").html("Good " + greeting + ", <span id=\"Name\"></span>.");
	$("#aside").html(comments[Math.floor(Math.random() * comments.length)]);
}

function getContent() {
	chrome.storage.sync.get("name", function(saved) {
		$("#Name").html(saved["name"] ? saved["name"] : "stranger");
	});
	chrome.storage.sync.get("items", function(saved) {
		$.getJSON("data.json", function(data){
			var pageContent = "";
			$.each(data, function(category, values){
				var buttons = "";
				var visibility = "none";
				$.each(values["items"], function(index, item){
					var display = !saved["items"] || saved["items"][item["name"]] ? "inline-block" : "none";
					buttons += "<a href=\"" + item["url"] + "\" class=\"btn btn-outline-dark\" id=\"button_" + item["name"] + "\" style=\"display:" + display + "\"><i class=\"fa " + item["icon"] + "\" aria-hidden=\"true\"></i> " + item["name"] + "</a> ";
					visibility = !saved["items"] || saved["items"][item["name"]] ? "block" : visibility;
				});
				pageContent += "<div class=\"row\" id=\"section_" + category + "\" style=\"display:" + visibility + "\"><div class=\"col\"><h6>" + values["tagline"] + "</h6>" + buttons + "</div></div>";
			});
			$("#pageContent").html(pageContent);
		});
	});
}

function saveSettings() {
	$.getJSON("data.json", function(data){
		var settings = {"name":$("#input_Name")[0].value,"items":{}};
		$.each(data, function(category, values){
			$.each(values["items"], function(index, item){
				settings["items"][item["name"]] = $("#checkbox_" + item["name"])[0].checked;
			});
		});
		chrome.storage.sync.set(settings, function() {
			getContent();
		});
	});
}

function loadModal() {
	chrome.storage.sync.get("name", function(saved) {
		$("#input_Name")[0].value = saved["name"] ? saved["name"] : "stranger";
	});
	chrome.storage.sync.get("items", function(saved) {
		$.getJSON("data.json", function(data){
			var modalContent = "";
			$.each(data, function(category, values){
				var checkboxes = "";
				$.each(values["items"], function(index, item){
					var checked = !saved["items"] || saved["items"][item["name"]] ? "checked" : "";
					checkboxes += "<div class=\"form-check form-check-inline\"><label class=\"form-check-label\"><input class=\"form-check-input\" type=\"checkbox\" id=\"checkbox_" + item["name"] + "\" " + checked + "> " + item["name"] + "</label></div>";
				});
				modalContent += "<h6>" + category + "</h6><p><small>" + checkboxes + "</small></p>";
			});
			$("#modalContent").html(modalContent);
		});
	});
}