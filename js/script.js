$(document).ready(function() {
	getGreeting();
	getContent();
	$("#save").click(saveSettings);
	$("#button_Settings").click(loadSettings);
	loadSettings();
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
	$("#greeting").html("Good " + greeting + " <span id=\"Name\"></span>.");
	$("#aside").html(comments[Math.floor(Math.random() * comments.length)]);
}

function getContent() {
	$.getJSON("data.json", function(json){
		var pageContent = "";
		var modalContent = "";
		$.each(json, function(category, values){
			var buttons = "";
			var checkboxes = "";
			$.each(values["items"], function(index, item){
				buttons += "<a href=\"" + item["url"] + "\" class=\"btn btn-outline-dark\" id=\"button_" + item["name"] + "\" style=\"display:none\"><i class=\"fa " + item["icon"] + "\" aria-hidden=\"true\"></i> " + item["name"] + "</a> ";
				checkboxes += "<div class=\"form-check form-check-inline\"><label class=\"form-check-label\"><input class=\"form-check-input\" type=\"checkbox\" id=\"checkbox_" + item["name"] + "\" checked> " + item["name"] + "</label></div>";
			});
			pageContent += "<div class=\"row\" id=\"section_" + category + "\"><div class=\"col\"><h6>" + values["tagline"] + "</h6>" + buttons + "</div></div>";
			modalContent += "<h6>" + category + "</h6><p><small>" + checkboxes + "</small></p>";
		});
		$("#pageContent").html(pageContent);
		$("#modalContent").html(modalContent);
	});
}

function saveSettings() {
	$("#Name").html($("#input_Name")[0].value);
	$.getJSON("data.json", function(json){
		var settings = {"Name":$("#input_Name")[0].value};
		$.each(json, function(category, values){
			var visibilityFlag = false;
			$.each(values["items"], function(index, item){
				if ($("#checkbox_" + item["name"])[0].checked) {
					$("#button_" + item["name"]).css('display', 'inline-block');
					visibilityFlag = true;
				} else {
					$("#button_" + item["name"]).css('display', 'none');
				}
				settings[item["name"]] = $("#checkbox_" + item["name"])[0].checked;
			});
			if (visibilityFlag) {
				$("#section_" + category).css('display', 'block');
			} else {
				$("#section_" + category).css('display', 'none');
			}
		});
		storeValue(settings);
	});
}

function storeValue(value) {
	chrome.storage.sync.set(value, function() {
        console.log(value);
	});
}

function loadCheckbox(name) {
	chrome.storage.sync.get(name, function(value) {
		$("#checkbox_" + name)[0].checked = value[name];
	});
}

function loadSettings() {
	chrome.storage.sync.get("Name", function(value) {
		if (value["Name"] != undefined) {
			$("#Name").html(value["Name"]);
			$("#input_Name")[0].value = value["Name"];
			$.getJSON("data.json", function(json){
				$.each(json, function(category, values){
					$.each(values["items"], function(index, item){
						loadCheckbox(item["name"]);
					});
				});
				saveSettings();
			});
		} else {
			saveSettings();
		}
	});
}