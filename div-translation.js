DivTranslation = function() {
	this.id = 'divTranslation';
	this.create();
}

DivTranslation.prototype.create = function() {
	var div = $('<div></div>').attr('id', this.id); //talvez seja necessário trocar o id fixo por um randomico
	//div.addClass('divTranslation');
	div.css({'position': 'absolute', 'display': 'none', 'background-color': 'orange'});
	$('body').append(div);
}

DivTranslation.prototype.setText = function(text) {
	$('#' + this.id).text(text);
}

DivTranslation.prototype.showAt = function(top, left) {
	left = left + "px";
	top = top + "px";
	$("#" + this.id).css({top: top, left: left});
	$("#" + this.id).stop().fadeIn();
}

DivTranslation.prototype.hide = function() {
	$("#" + this.id).stop().fadeOut();	
}

DivTranslation.prototype.setBackgroundColor = function(color) {
	$("#" + this.id).css({'background-color': color});
}