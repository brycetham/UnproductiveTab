$(document).ready(function() {
	getGreeting();
	loadData(getButtons);
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
	$("#greeting").html("Good " + greeting + ", Bryce.");
	$("#aside").html(comments[Math.floor(Math.random() * comments.length)]);
}

function getButtons(json) {
	var content = "";
	$.each(json, function(category, values){
		var buttons = "";
		$.each(values["items"], function(index, item){
			if (item["enabled"]) {
				buttons += "<a href=\"" + item["url"] + "\" class=\"btn btn-outline-dark\"><i class=\"fa " + item["icon"] + "\" aria-hidden=\"true\"></i> " + item["name"] + "</a> ";
			}
		});
		if (buttons != "") {
			content += "<div class=\"row\"><div class=\"col\"><h6>" + values["tagline"] + "</h6>" + buttons + "</div></div>";
		}
	});
	$("#content").html(content);
}

function saveData(data) {
	chrome.storage.sync.set({"data":data}, function() {
        console.log("Saved data.");
	});
}

function loadData(onSuccess) {
	chrome.storage.sync.get("data", function(data) {
        if (Object.keys(data).length != 0) {
			onSuccess(data)
		} else {
			console.log("Loading default data...");
			$.getJSON("data.json", function(json){
				onSuccess(json);
			});
		}
	});
}