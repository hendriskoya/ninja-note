WordsTranslator = function() {
	this.createFixedMenu();
	this.bindEvents();
	this.loadSavedData();
};

WordsTranslator.prototype.createFixedMenu = function() {
	var menu = '<div class="fixedElement">'
			+  '	<ul id="menu">'
			+  '		<li><a href="#">LOAD HIGHLIGHTED WORDS</a></li>'
			+  '		<li><input id="translate" type="button" value="TRANSLATE"/></li>'
			+  '		<li><input id="addTranslationToText" type="button" value="ADD TRANSLATION TO TEXT"/></li>'
			+  '		<li><input id="showSelectedText" type="button" value="SHOW SELECTED TEXT"/></li>'
			+  '		<li><input id="saveData" type="button" value="SAVE DATA"/></li>'
			+  '		<li><input id="loadSavedData" type="button" value="LOAD SAVED DATA"/></li>'
			+  '		<li><input id="openNewTab" type="button" value="OPEN NEW TAB"/></li>'
			+  '		<li><input id="getURL" type="button" value="GET URL"/></li>'
			+  '	</ul>'
			+  '</div>';
	$('body').append(menu);
};

WordsTranslator.prototype.getSelectionText = function() {
	return window.getSelection().toString();
};

WordsTranslator.prototype.replaceSelectionWithHtml = function(html) {
    var range, html;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var div = document.createElement("div");
		
		var span = document.createElement("span");
		//span.setAttribute("style","background-color: green;");
		
		chrome.storage.sync.get({highlightColor: '#ffff00'}, function(items) {
			//document.getElementById('highlight_color').value = items.highlightColor;
			span.setAttribute("style","background-color: " + items.highlightColor);
		});
		  
		var text = document.createTextNode(html);
		span.appendChild(text);
		
		div.appendChild(span);
	
        var frag = document.createDocumentFragment(), child;
        while ( (child = div.firstChild) ) {
            frag.appendChild(child);
        }
        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(html);
    }
};

WordsTranslator.prototype.addTranslationToText = function() {
	var translation = prompt("Please enter translation text", "");
	if (translation != null) {
		var selectedText = window.getSelection().toString();
		if (selectedText != undefined && selectedText != '') {
			
			/*wordNote.addNote(selectedText, translation);
			
			console.log(selectedText + " - " + translation);
			wordsStore.insertOrUpdate(selectedText, translation);*/
			
			var selection = new Selection(selectedText);
			selection.add(new Annotation(translation));
			g_selectionList.add(selection);
			g_noteStore.update(g_selectionList);

			wordNote.addNote(selectedText, translation);
		}
	}
};

WordsTranslator.prototype.bindEvents = function() {
	$('#translate').on('click', function(e){
		window.postMessage({ type: "FROM_PAGE", text: "translate" }, "*");
	});

	$('#showSelectedText').on('click', function(e){
		//alert('showSelectedText');
		window.postMessage({ type: "FROM_PAGE", text: "showSelectedText" }, "*");
	});
	$('#addTranslationToText').on('click', function(e){
		//alert('showSelectedText');
		window.postMessage({ type: "FROM_PAGE", text: "addTranslationToText" }, "*");
	});
	$('#saveData').on('click', function(e){
		//alert('showSelectedText');
		window.postMessage({ type: "FROM_PAGE", text: "saveData" }, "*");
	});
	$('#loadSavedData').on('click', function(e){
		//alert('showSelectedText');
		window.postMessage({ type: "FROM_PAGE", text: "loadSavedData" }, "*");
	});
	$('#openNewTab').on('click', function(e){
		//alert('showSelectedText');
		window.postMessage({ type: "FROM_PAGE", text: "openNewTab" }, "*");
	});
	
	$('#getURL').on('click', function(e){
		window.postMessage({ type: "FROM_PAGE", text: "getURL" }, "*");
	});
};

WordsTranslator.prototype.saveData = function() {
	
	/*var dataObj = {};
	//dataObj['risco'] = 'risc';
	//dataObj['perda'] = 'loss';
	dataObj['Origem'] = 'Source';
	dataObj['livre'] = 'free';
	
	chrome.storage.local.set(dataObj, function() {
		//message('dados salvos');
		alert('salvo');
	});*/
	//wordsStore.save();
	
}

WordsTranslator.prototype.loadSavedData = function() {
	console.log('loadSavedData called');
	/*wordsStore.load(function(words) {
		var value;
		for (var key in words) {
			value = words[key];
			wordNote.addNote(key, value);
		}
	});*/	
	
	g_noteStore.load(function(store) {
		var jsonSelectionList = null;
		for (var url in store) {
			console.log('existing url: ' + url);
			//if (url == tabUrl) {
			if (url == window.location.href) {
				jsonSelectionList = store[url];
				console.log('url: ' + url + ', selection: ' + jsonSelectionList);
				//wordNote.addNote(key, value);
			}
		}
		if (jsonSelectionList == null) {
			//console.log('no selectionList found to url ' + tabUrl);
			console.log('no selectionList found to url ' + window.location.href);
			g_selectionList = new SelectionList(window.location.href, document.title);
		} else {
			//console.log('selectionList found to url ' + tabUrl);
			console.log('selectionList found to url ' + window.location.href);
			console.log(jsonSelectionList);
			g_selectionList = SelectionList.fromJSON(jsonSelectionList);
			wordsTranslator.addNotesOnPage();
		}
	});
}

WordsTranslator.prototype.addNotesOnPage = function() {
	console.log('addNotesOnPage was called');
	g_selectionList.forEach(function(id, selection) {
		//console.log('key: ' + key + ', value: ' + value);
		if (selection.size() > 0) {
			console.log('selection: ' + selection.description + ', annotation: ' + selection.get(1).description);
			wordNote.addNote(selection.description, selection.get(1).description);
		}
	});
}

WordsTranslator.prototype.replaceWordsInPage = function(words) {
	chrome.storage.local.get(null, function(items) {
		console.log(items);
		
		var text = document.body.innerHTML;	
		
		for (key in items) {
			console.log('key: ' + key + ' - value: ' + items[key]);
			
			var patt = eval('/' + key + '/i');
			text = text.replace(patt, '<span class="selectedWord">' + key + '</span>');
		}
		document.body.innerHTML = text;		
	});
}

WordsTranslator.prototype.openNewTab = function() {
	//alert('openNewTab');
	chrome.runtime.sendMessage({action: "NEW_TAB"});
}

WordsTranslator.prototype.translate = function() {
	chrome.storage.sync.get({translateTo: 'en'}, function(items) {
		chrome.runtime.sendMessage({
			action: "TRANSLATE", 
			toLanguage: items.translateTo, 
			text: window.getSelection().toString()
		});
	});
	
	/*var list = wordsStore.list();
	console.log('==== words ====');
	for (i = 0; i < list.length; i++) {
		console.log(list[i] + ' - ' + wordsStore.get(list[i]));
	}*/
}


var wordsTranslator;
var wordsStore;
var divTranslation;
var wordNote;
//var tabUrl;

var g_noteStore;
var g_selectionList;

//alert('content-script');

//registra o listener para os responses do background
/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log(sender.tab ? "from a content script: " + sender.tab.url : "from the extension");
	if (!sender.tab) {
		if (request.action) {
			if (request.action === 'get_url_response') {
				tabUrl = request.url;	
				console.log('url ' + tabUrl + ' returned');
				wordsTranslator.loadSavedData();
			} else {
				console.log('Not implemented.');
			}
		}
	}
});*/

$(function(){
	//solicita ao background a url da tab assim que a página é carregada
	//chrome.runtime.sendMessage({action: "GET_URL"});

	/*****************************/
	//estabelece comunicação entre o content-script e a página
	var port = chrome.runtime.connect();

	window.addEventListener("message", function(event) {
	  // We only accept messages from ourselves
	  if (event.source != window)
		return;

	  if (event.data.type && event.data.type == "FROM_PAGE") {
		if (event.data.text == "translate") {
			wordsTranslator.translate();
		} else if (event.data.text == "showSelectedText") {
			//console.log("Content script received: " + event.data.text);
			//alert(event.data.text);
			alert(wordsTranslator.getSelectionText());
			//port.postMessage(event.data.text);
		} else if (event.data.text == "addTranslationToText") {
			wordsTranslator.addTranslationToText();
		} else if (event.data.text == "saveData") {
			wordsTranslator.saveData();
		} else if (event.data.text == "loadSavedData") {
			wordsTranslator.loadSavedData();
		} else if (event.data.text == "openNewTab") {
			wordsTranslator.openNewTab();
		/*} else if (event.data.text == "getURL") {
			alert(tabUrl);*/
		} else {
			alert("not implemented: " + event.data.text);
		}
	  }
	}, false);
	/*****************************/
	
	g_noteStore = new NoteStore();
	
	wordsStore = new WordsStore();
	
	divTranslation = new DivTranslation();
	
	wordNote = new WordNote();
	
	wordsTranslator = new WordsTranslator();

		//console.log(window.location.href);
		//console.log('title: ' + document.title);
});