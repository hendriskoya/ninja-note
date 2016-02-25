WordNote = function() {
	this.element = document.body;
	this.sequence = 0;
	this.highlightColor = null;
	chrome.storage.sync.get({highlightColor: '#ffff00'}, function(items) {
		wordNote.highlightColor = items.highlightColor;
	});
}

WordNote.prototype.addNote = function(word, translation) {
	var elementText;
    if (typeof this.element.textContent == "string" && document.createRange && window.getSelection) {
        elementText = this.element.textContent;
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElement(this.element);
        elementText = textRange.text;
    }
    
	var startIndex = 0;
	var startPositions = new Array();
	while ((startIndex = elementText.indexOf(word, startIndex)) > -1) {
		startPositions.push(startIndex);
		startIndex += word.length;
	}
	
	var ownerId = null;
	for (var i = startPositions.length - 1; i > -1; i--) {
		this.setSelectionRange(this.element, startPositions[i], startPositions[i] + word.length);
		ownerId = this.highlight();
		this.appendNote(ownerId, translation);
		this.prepareDivTranslation(ownerId, translation);
	}
}

WordNote.prototype.getTextNodesIn = function(node) {
	var textNodes = [];
    if (node.nodeType == 3) {
        textNodes.push(node);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}

WordNote.prototype.setSelectionRange = function(el, start, end) {
    if (document.createRange && window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var textNodes = this.getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;

        for (var i = 0, textNode; textNode = textNodes[i++]; ) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount
                    && (start < endCharCount ||
                    (start == endCharCount && i < textNodes.length))) {
                range.setStart(textNode, start - charCount);
                foundStart = true;
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount);
                break;
            }
            charCount = endCharCount;
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(true);
        textRange.moveEnd("character", end);
        textRange.moveStart("character", start);
        textRange.select();
    }
}

WordNote.prototype.highlight = function() {
	var elementId = null;
	var selection = window.getSelection().toString();
	if (selection != undefined && selection != '') {
		
		range = window.getSelection().getRangeAt(0);
		range.deleteContents();
		
		elementId = "wordTranslation" + ++this.sequence;
		
		/*var div = document.createElement("div");
		div.setAttribute("id", elementId);
		div.setAttribute("style","background-color: yellow; display: inline; position: relative;");
		
		var text = document.createTextNode(selection);
		div.appendChild(text);*/
		
		var div = $('<div></div>').attr('id', elementId);
		//div.css({'position': 'relative', 'display': 'inline', 'background-color': 'yellow'});
		div.addClass('highlight');
		div.css("background-color", wordNote.highlightColor);
		div.text(selection);
		
		var frag = document.createDocumentFragment();
		frag.appendChild(div[0]);
		range.insertNode(frag);
		
		/*if ($( "." + elementId).length) {
			$( "." + elementId).hover(
				function(e) {
					var position = $(e.target).position();
					divTranslation.setText(selection);
					divTranslation.showAt(position.top + $(e.target).height(), position.left);
				},
				function() {
					divTranslation.hide();
				}
			);
		}*/
	}
	return elementId;
}

WordNote.prototype.appendNote = function(ownerId, translation) {
	if ($( "#" + ownerId).length) {
		/*var div = $('<div></div>').attr('id', ownerId + '_note');
		div.addClass('highlight-note');
		div.text(translation);*/
		
		var div = note.create(ownerId, translation);
		
		$( "#" + ownerId).append(div);
		
		div = note.flag(ownerId);
		
		$( "#" + ownerId).append(div);
	}
}

WordNote.prototype.prepareDivTranslation = function(ownerId, translation) {
	if ($( "#" + ownerId).length) {
		$( "#" + ownerId).hover(
			function(e) {
				/*var position = $(e.target).position();
				divTranslation.setText(translation);
				divTranslation.showAt(position.top + $(e.target).height(), position.left);*/
				note.show(ownerId);
			},
			function() {
				//divTranslation.hide();
				note.hide(ownerId);
			}
		);
	}
}

Note = function() {
}

Note.prototype.create = function(id, text) {
	var div = $('<div></div>').attr('id', this.getId(id));
	div.addClass('highlight-note');
	div.text(text);
	return div;
}

Note.prototype.flag = function(id) {
	var div = $('<div></div>').attr('id', id + '_flag');
	div.addClass('highlight-flag');
	return div;
}

Note.prototype.getId = function(id) {
	return id + '_note';
}

Note.prototype.show = function(id) {
	$("#" + this.getId(id)).stop().fadeIn();
	//console.log("display: " + $("#" + this.getId(id)).css("display"));
}

Note.prototype.hide = function(id) {
	$("#" + this.getId(id)).stop().fadeOut();	
	//console.log("display: " + $("#" + this.getId(id)).css("display"));
}

Note.prototype.setBackgroundColor = function(id, color) {
	$("#" + this.getId(id)).css({'background-color': color});
}

var note = new Note();