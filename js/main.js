function sideValues(x) {
	this.success = x.success || 0;
	this.advantage = x.advantage || 0;
	this.triumph = x.triumph || 0;
	this.failure = x.failure || 0;
	this.threat = x.threat || 0;
	this.despair = x.despair || 0;
}

var diceMapping = {
	"abilityDice": new abilityDice(),
	"proficiencyDice": new proficiencyDice(),
	"boostDice": new boostDice(),
	"difficultyDice": new difficultyDice(),
	"challengeDice": new challengeDice(),
	"setbackDice": new setbackDice()
};

function abilityDice() {
	this.sides = 8;
	this.values = [
		new sideValues({}),
		new sideValues({ success:1 }),
		new sideValues({ success:1 }),
		new sideValues({ advantage:1 }),
		new sideValues({ advantage:1 }),
		new sideValues({ success:1, advantage:1 }),
		new sideValues({ success:2 }),
		new sideValues({ advantage:2 })
	]
}

function proficiencyDice() {
	this.sides = 12;
	this.values = [
		new sideValues({}),
		new sideValues({ triumph:1 }),
		new sideValues({ success:1 }),
		new sideValues({ success:1 }),
		new sideValues({ advantage:1 }),
		new sideValues({ success:1, advantage:1 }),
		new sideValues({ success:1, advantage:1 }),
		new sideValues({ success:1, advantage:1 }),
		new sideValues({ success:2 }),
		new sideValues({ success:2 }),
		new sideValues({ advantage:2 }),
		new sideValues({ advantage:2 })
	]
}

function boostDice() {
	this.sides = 6;
	this.values = [
		new sideValues({}),
		new sideValues({ success:0 }),
		new sideValues({ success:1 }),
		new sideValues({ advantage:1 }),
		new sideValues({ success:1, advantage:1 }),
		new sideValues({ advantage:2 })
	]
}

function difficultyDice() {
	this.sides = 8;
	this.values = [
		new sideValues({}),
		new sideValues({ failure:1 }),
		new sideValues({ threat:1 }),
		new sideValues({ threat:1 }),
		new sideValues({ threat:1 }),
		new sideValues({ failure:2 }),
		new sideValues({ failure:1, threat:1 }),
		new sideValues({ threat:2 })
	]
}

function challengeDice() {
	this.sides = 12;
	this.values = [
		new sideValues({}),
		new sideValues({ despair:1 }),
		new sideValues({ failure:1 }),
		new sideValues({ failure:1 }),
		new sideValues({ threat:1 }),
		new sideValues({ threat:1 }),
		new sideValues({ failure:2 }),
		new sideValues({ failure:2 }),
		new sideValues({ threat:2 }),
		new sideValues({ threat:2 }),
		new sideValues({ failure:1, threat:1 }),
		new sideValues({ failure:1, threat:1 })
	]
}

function setbackDice() {
	this.sides = 6;
	this.values = [
		new sideValues({}),
		new sideValues({ failure:0 }),
		new sideValues({ failure:1 }),
		new sideValues({ failre:1 }),
		new sideValues({ threat:1 }),
		new sideValues({ threat:1 })
	]
}

$(function () {
	//"Static" page items
	var dicePool = $("#dicePool");
	var rollButton = $("#rollButton");
	var resetButton = $("#resetButton");
	var resultsContainer = $("#resultsContainer");
	var successLabel = $("#successLabel");
	var failureLabel = $("#failureLabel");
	var advantageLabel = $("#advantageLabel");
	var threatLabel = $("#threatLabel");
	var numberOfSuccess = $("#numberOfSuccess");
	var numberOfFailure = $("#numberOfFailure");
	var successFailureMargin = $("#successFailureMargin");
	var numberOfAdvantage = $("#numberOfAdvantage");
	var numberOfThreat = $("#numberOfThreat");
	var advantageThreatMargin = $("#advantageThreatMargin");
	var triumphLabel = $("#triumphLabel");
	var triumphRolled = $("#triumphRolled");
	var despairLabel = $("#despairLabel");
	var despairRolled = $("#despairRolled");
	
	//This prevents the browser from highlighting a bunch of stuff if the user clicks too quickly 
	$("body").mousedown(function() { 
		event.preventDefault(); 
	});
	
	//On clicking the up arrows
	$(".up").on("click touchstart", function() {
		var diceToAdd = $(this).siblings(".dice").attr("dice");
		var diceGroup = dicePool.children("." + diceToAdd + ":last");
		if (diceGroup.length == 1) {
			diceGroup.after("<div class='dice " + diceToAdd + "' dice='" + diceToAdd + "'></div>");
		} else {
			dicePool.append("<div class='dice " + diceToAdd + "' dice='" + diceToAdd + "'></div>");
		}
		e.preventDefault();
		e.stopPropagation();
	});
	
	//On clicking the down arrows
	$(".down").on("click touchstart", function() {
		var diceToRemove = $(this).siblings(".dice").attr("dice");
		dicePool.find("." + diceToRemove + ":last").remove();		
		e.preventDefault();
		e.stopPropagation();
	});
	
	//On clicking the roll button
	rollButton.on("click touchstart", function() {
		rollDiceAndCalculate();
		e.preventDefault();
		e.stopPropagation();
	});
	
	//On clicking the reset button
	resetButton.on("click touchstart", function() {
		dicePool.find(".dice").remove();
		resultsContainer.hide();
		e.preventDefault();
		e.stopPropagation();
	});
	
	//"Rolls" dice, gets totals, and updates the screen
	function rollDiceAndCalculate() {
		//Setup defaults
		var totalDicePool = dicePool.children(".dice");
		var totals = new sideValues({});
		var rando = 0;
		
		//Roll each dice and update the totals
		totalDicePool.each(function() {
			var diceType = $(this).attr("dice");
			var dice = diceMapping[diceType];
			rando = Math.floor(Math.random()*dice.sides);
			var value = dice.values[rando];
			totals.success += value.success;
			totals.success += value.triumph; //triumph are counted as success
			totals.advantage += value.advantage;
			totals.triumph += value.triumph;
			totals.failure += value.failure;
			totals.failure += value.despair; //despair are counted as failure
			totals.threat += value.threat;
			totals.despair += value.despair;
		});
		
		//Show success/faliure labels
		numberOfSuccess.text(totals.success);
		numberOfFailure.text(totals.failure);
		if (totals.success > totals.failure) {
			successLabel.show();
			failureLabel.hide();
			successFailureMargin.text(totals.success - totals.failure);
		} else {
			successLabel.hide();
			failureLabel.show();
			successFailureMargin.text(totals.failure - totals.success);
		}
		
		//Show advantage/threat labels
		numberOfAdvantage.text(totals.advantage);
		numberOfThreat.text(totals.threat);
		if (totals.advantage > totals.threat) {
			advantageLabel.show();
			threatLabel.hide();
			advantageThreatMargin.text(totals.advantage - totals.threat);
			advantageThreatMargin.show();
		} else if (totals.threat > totals.advantage) {
			advantageLabel.hide();
			threatLabel.show();
			advantageThreatMargin.text(totals.threat - totals.advantage);
			advantageThreatMargin.show();
		} else {
			advantageLabel.hide();
			threatLabel.hide();	
			advantageThreatMargin.hide();
		}
		
		//Show triumph/despair labels
		if (totals.triumph > 0) {
			triumphRolled.text(totals.triumph);
			triumphLabel.show();
		} else {
			triumphLabel.hide();
		}
		if (totals.despair > 0) {
			despairRolled.text(totals.despair);
			despairLabel.show();
		} else {
			despairLabel.hide();
		}
		
		//Finally, show the results
		resultsContainer.show();
	}
});