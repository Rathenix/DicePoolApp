$(function () {
	$(".up").click(function() {
		var diceToAdd = $(this).siblings(".dice");
		$("#dicePool").append(diceToAdd.clone());
	});
	$(".down").click(function() {
		var diceToRemove = "." + $(this).siblings(".dice").attr("class");
		$("#dicePool").children().remove(diceToRemove);
	});
});