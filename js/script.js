$(document).ready(function() {
	getGreeting();
	getContent();
	loadModal();
	bindEvents();
});

function getGreeting() {
	var hour = new Date().getHours();
	var comments = [];
	var greeting = "";
	if (hour < 6) {
		greeting = "night";
		comments = ["You really should be sleeping right now.",
					"Why are you still awake?",
					"BOO!",
					"Don't let the bed bugs bite!"];
	} else if (hour >= 6 && hour < 12) {
		greeting = "morning";
		comments = ["Something something insert inspirational quote here.",
					"Wow you actually woke up.",
					"WAKEY WAKEY!",
					"Just in time for the most important meal of the day~"];
	} else if (hour >= 12 && hour < 18) {
		greeting = "afternoon";
		comments = ["Don't forget to drink water!",
					"Look at how much of your day you've already wasted.",
					"a.k.a. it's time for a nap!",
					"Is it time for dinner yet?"];	
	} else {
		greeting = "evening";
		comments = ["I hope you didn't just wake up...",
					"Make sure you sleep early tonight <small>(you won't)</small>.",
					"AHHH your assignment is due at 11:59!",
					"It's time to play some video games!"
					]
	}
	$("#greeting").html("Good " + greeting + ", <span id=\"name\"></span>.");
	$("#aside").html(comments[Math.floor(Math.random() * comments.length)]);
}

function getContent() {
	chrome.storage.sync.get("name", function(saved) {
		$("#name").html(saved["name"] ? saved["name"] : "stranger");
	});
	chrome.storage.sync.get("productivity", function(saved) {
		$("#checkbox-productivity")[0].checked = saved["productivity"] ? saved["productivity"] : false;
		toggleProductivity();
	});
	chrome.storage.sync.get("items", function(saved) {
		$.getJSON("data.json", function(data){
			var pageContent = "";
			$.each(data, function(category, values){
				var buttons = "";
				var visibility = "none";
				$.each(values["items"], function(index, item){
					var display = !saved["items"] || saved["items"][item["id"]] ? "inline-block" : "none";
					buttons += "<a href=\"" + item["url"] + "\" class=\"btn btn-outline-dark\" id=\"button-" + item["id"] + "\" style=\"display:" + display + "\"><i class=\"fa fa-" + item["id"] + "\" aria-hidden=\"true\"></i> " + item["name"] + "</a> ";
					visibility = !saved["items"] || saved["items"][item["id"]] ? "block" : visibility;
				});
				pageContent += "<div class=\"row\" id=\"section-" + category + "\" style=\"display:" + visibility + "\"><div class=\"col\"><h6>" + values["tagline"] + "</h6>" + buttons + "</div></div>";
			});
			$("#page-contents").html(pageContent);
			$(".btn-outline-dark").draggable({cancel:false});
		});
	});
}

function saveSettings() {
	$.getJSON("data.json", function(data){
		var settings = {};
		settings["name"] = $("#input-name")[0].value;
		settings["productivity"] = $("#checkbox-productivity")[0].checked;
		settings["items"] = {};
		$.each(data, function(category, values){
			$.each(values["items"], function(index, item){
				settings["items"][item["id"]] = $("#checkbox-" + item["id"])[0].checked;
			});
		});
		chrome.storage.sync.set(settings, function() {
			getContent();
		});
	});
}

function loadModal() {
	chrome.storage.sync.get("name", function(saved) {
		$("#input-name")[0].value = saved["name"] ? saved["name"] : "stranger";
	});
	chrome.storage.sync.get("items", function(saved) {
		$.getJSON("data.json", function(data){
			var modalContent = "";
			$.each(data, function(category, values){
				var checkboxes = "";
				$.each(values["items"], function(index, item){
					var checked = !saved["items"] || saved["items"][item["id"]] ? "checked" : "";
					checkboxes += "<div class=\"form-check form-check-inline\"><label class=\"form-check-label\"><input class=\"form-check-input\" type=\"checkbox\" id=\"checkbox-" + item["id"] + "\" " + checked + "> " + item["name"] + "</label></div>";
				});
				modalContent += "<h6>" + category + "</h6><p><small>" + checkboxes + "</small></p>";
			});
			$("#modal-contents").html(modalContent);
		});
	});
}

function toggleProductivity() {
	if ($("#checkbox-productivity")[0].checked) {
		$("body").css("backgroundColor", "dimgray");
		$("#unproductive-header").css("display", "none");
		$("#page-contents").css("display", "none");
		$("#productive-header").css("display", "block");
		$("#button-settings").prop("display", "inline-block");
		$("#button-settings").prop("disabled", true);
		$("#button-settings").html("<i class=\"fa fa-ban\" aria-hidden=\"true\"></i> Settings");
	} else {
		$("body").css("backgroundColor", "whitesmoke");
		$("#unproductive-header").css("display", "block");
		$("#page-contents").css("display", "block");
		$("#productive-header").css("display", "none");
		$("#button-settings").prop("disabled", false);
		$("#button-settings").html("<i class=\"fa fa-cog\" aria-hidden=\"true\"></i> Settings");
	}
}

function bindEvents() {
	$("#save").click(saveSettings);
	$("#button-settings").click(loadModal);
	$("#checkbox-productivity").change(toggleProductivity);
	$("#checkbox-productivity").change(saveSettings);
	$("input").keypress(function(event) {
		if (event.keyCode == 13) {
			event.preventDefault();
		}
	});
}