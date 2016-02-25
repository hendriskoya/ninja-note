WordsStore = function() {
	this.words = {};
	//this.load();
}

WordsStore.prototype.insertOrUpdate = function(word, translation) {
	/*chrome.tabs.getCurrent(function (tab) {
		var url = tab.url;
		console.log('active url: ' + url);
	});*/
	
	chrome.runtime.sendMessage({action: "GET_URL"}, function (url) {
		console.log('active url: ' + url);
	});

	console.log(word + ' - ' + translation);
	console.log(this.words);
	this.words[word] = translation;
	this.save();
}

WordsStore.prototype.delete = function(word) {
	delete this.words[word];
}

WordsStore.prototype.get = function(word) {
	return this.words[word];
}

WordsStore.prototype.list = function() {
	var wordsList = [];
	for (var word in this.words) {
		console.log('list - ' + word);
		wordsList.push(word);
	}
	return wordsList;
}

WordsStore.prototype.loadNative = function(callback) {
	this.load(function(wordsList) {
		console.log('wordsList: ' + wordsList);
		wordsStore.words = wordsList;
		callback(this.words);
	});
}

WordsStore.prototype.load = function(callback) {
	chrome.storage.local.get({data: null}, function(items) {
		if (items == null || items['data'] == null) {
			wordsStore.words = {};
		} else {
			var parsedData = JSON.parse(items['data']);
			wordsStore.words = parsedData;
		}
		callback(wordsStore.words);
	});
}

WordsStore.prototype.save = function() {
	/*var dataObj = {};
	dataObj['Origem'] = 'Source';
	dataObj['livre'] = 'free';*/
	//alert('WordsStore - save');
	var dataToSave = {};
	
	//this.insertOrUpdate('preto','black');
	//this.insertOrUpdate('amarelo','yellow');
	//this.insertOrUpdate('vermelho','red');
	
	console.log(JSON.stringify(this.words));
	dataToSave['data'] = JSON.stringify(this.words);
	
	chrome.storage.local.set(dataToSave, function() {
		//message('dados salvos');
		//alert('salvo');
		console.log('salvo');
	});
}