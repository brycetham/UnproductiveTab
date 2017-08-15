$(document).ready(function() {
	getGreeting();
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