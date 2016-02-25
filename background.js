//constructor
BackgroundEvents = function() {
};

//tabId property
BackgroundEvents.prototype.tabId = 0;

//createNewTab function
BackgroundEvents.prototype.createNewTab = function() {
	chrome.tabs.get(backgroundEvents.tabId, function (tab) {
		if (tab == undefined) {
			chrome.tabs.create({url: 'https://translate.google.com.br/#auto/pt/house'}, function (tab) {
				backgroundEvents.tabId = tab.id;
			});
		} else {
			chrome.tabs.update(backgroundEvents.tabId, {url: 'https://translate.google.com.br/#en/pt/family', active: true});
		}
	});
};

BackgroundEvents.prototype.translate = function(language, text) {
	chrome.tabs.get(backgroundEvents.tabId, function (tab) {
		var translateUrl = 'https://translate.google.com.br/#auto/';
		translateUrl += language;
		translateUrl += '/';
		translateUrl += text;
		if (tab == undefined && language != '' && text != '') {
			
			chrome.tabs.create({url: translateUrl}, function (tab) {
				backgroundEvents.tabId = tab.id;
			});
		} else {
			chrome.tabs.update(backgroundEvents.tabId, {url: translateUrl, active: true});
		}
	});
};

var backgroundEvents = new BackgroundEvents();

//alert('background');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//alert('receiving request...');
	//alert(sender.tab ? "from a content script: " + sender.tab.url :
	//		"from the extension");
	//alert(request.greeting);
	if (request.action) {
		if (request.action == 'NEW_TAB') {
			backgroundEvents.createNewTab();
		} else if (request.action == 'TRANSLATE') {
			backgroundEvents.translate(request.toLanguage, request.text);
		} else if (request.action == 'GET_URL') {
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				//alert('tab id: ' + sender.tab.id);
				chrome.tabs.sendMessage(sender.tab.id, {action: 'get_url_response', url: tabs[0].url});
			});
		}
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	alert('teste');
});