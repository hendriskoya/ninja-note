/*
 * SelectionList class
 */
SelectionList = function(url, title) {
	this.url = url;
	this.title = title;
	this.selections = new buckets.Dictionary();
}

SelectionList.prototype.add = function(selection) {
	var existingSelection = null;
	var values = this.selections.values();
	for (var index in values) {
		if (selection.equals(values[index])) {
			existingSelection = values[index];
			break;
		}
	}
	
	if (existingSelection == null) {
		var maxId = 0, 
			key = 0, 
			keys = this.selections.keys();
			
		for (var index in keys) {
			key = keys[index];
			if (key > maxId) {
				maxId = key;
			}
		}
		
		selection.id = maxId + 1;
		this.selections.set(selection.id, selection);
		return selection;
	} else {
		return existingSelection;
	}
}

SelectionList.prototype.get = function(id) {
	return this.selections.get(id);
}

SelectionList.prototype.remove = function(id) {
	this.selections.remove(id);
}

SelectionList.prototype.forEach = function(callback) {
	this.selections.forEach(callback);
}

SelectionList.prototype.size = function() {
	return this.selections.size();
}

SelectionList.prototype.toJSON = function() {
	var obj = {};
	obj.url = this.url;
	obj.title = this.title;
	obj.selections = [];
	
	var values = this.selections.values();
	for (var index in values) {
		obj.selections.push(values[index].toJSON());
	}
	
	return JSON.stringify(obj);
}

SelectionList.fromJSON = function(data) {
	var obj = JSON.parse(data);
	var selectionList = new SelectionList(obj.url, obj.title);
	for (var index in obj.selections) {
		var value = obj.selections[index];
		
		var selection = new Selection(value.description);
		selection.id = value.id;
		selection.addAll(value.annotations);
		
		selectionList.selections.set(selection.id, selection);
	}
	return selectionList;
}

/*
 * Selection class
 */
Selection = function(description) {
	this.id = null;
	this.description = description;
	this.annotations = new buckets.Dictionary();
}

Selection.prototype.add = function(annotation) {
	console.log('trying add ' + annotation);
	var exists = false;
	
	var values = this.annotations.values();
	for (var index in values) {
		if (annotation.equals(values[index])) {
			exists = true;
			break;
		}
	}
	if (!exists) {
		var maxId = 0, 
			key = 0, 
			keys = this.annotations.keys();
			
		for (var index in keys) {
			key = keys[index];
			if (key > maxId) {
				maxId = key;
			}
		}
		
		annotation.id = maxId + 1;
		this.annotations.set(annotation.id, annotation);
		console.log('inserted...');
		return annotation;
	} else {
		console.log('not inserted...');
		return null;
	}
}

Selection.prototype.addAll = function(annotations) {
	for (var i in annotations) {
		var value = annotations[i];
		var annotation = new Annotation(value.description);
		annotation.id = value.id;
		this.annotations.set(value.id, annotation);
	}
}

Selection.prototype.get = function(id) {
	return this.annotations.get(id);
}

Selection.prototype.remove = function(id) {
	this.annotations.remove(id);
}

Selection.prototype.forEach = function(callback) {
	this.annotations.forEach(callback);
}

Selection.prototype.size = function() {
	return this.annotations.size();
}

Selection.prototype.equals = function(object) {
	if (object && object.description) {
		return this.description === object.description;
	} else {
		return false;
	}
}

Selection.prototype.toString = function() {
	return "[id: " + this.id + ", description: " + this.description + "]";
}

Selection.prototype.toJSON = function() {
	var obj = {};
	obj.id = this.id;
	obj.description = this.description;
	obj.annotations = this.annotations.values();
	return obj;
}

/*
 * Annotation class
 */
Annotation = function(description) {
	this.id = null;
	this.description = description;
}

Annotation.prototype.equals = function(object) {
	if (object && object.description) {
		return this.description === object.description;
	} else {
		return false;
	}
}

Annotation.prototype.toString = function() {
	return "[id: " + this.id + ", description: " + this.description + "]";
}

/*************************************************/

NoteStore = function() {
	this.store = {};
}

NoteStore.prototype.update = function(selectionList) {
	console.log(selectionList);
	console.log(this.store);
	this.store[selectionList.url] = selectionList.toJSON();
	this.save();
}

NoteStore.prototype.remove = function(url) {
	delete this.store[url];
}

NoteStore.prototype.get = function(url) {
	return this.store[url];
}

NoteStore.prototype.list = function() {
	var urls = [];
	for (var url in this.store) {
		console.log('list - ' + url);
		urls.push(url);
	}
	return urls;
}

NoteStore.prototype.loadNative = function(callback) {
	this.load(function(urls) {
		console.log('urls: ' + urls);
		noteStore.store = urls;
		callback(this.store);
	});
}

NoteStore.prototype.load = function(callback) {
	console.log('NoteStore.load was called');
	chrome.storage.sync.get([g_DATA_STORE_NAME], function(items) {
		console.log('saved items: ' + items);
		$.each(items, function(key, value) {
			console.log('key: ' + key + ', value: ' + value);
		});
		//console.log(g_DATA_STORE_NAME + ' items: ' + items[g_DATA_STORE_NAME]);
		if (items == null || items[g_DATA_STORE_NAME] == null) {
			g_noteStore.store = {};
		} else {
			var parsedData = JSON.parse(items[g_DATA_STORE_NAME]);
			g_noteStore.store = parsedData;
		}
		callback(g_noteStore.store);
	});
}

NoteStore.prototype.save = function() {
	/*var dataObj = {};
	dataObj['Origem'] = 'Source';
	dataObj['livre'] = 'free';*/
	//alert('NoteStore - save');
	var dataToSave = {};
	
	//this.insertOrUpdate('preto','black');
	//this.insertOrUpdate('amarelo','yellow');
	//this.insertOrUpdate('vermelho','red');
	
	console.log(JSON.stringify(this.store));
	dataToSave[g_DATA_STORE_NAME] = JSON.stringify(this.store);
	
	chrome.storage.sync.set(dataToSave, function() {
		//message('dados salvos');
		//alert('salvo');
		console.log('salvo');
	});
}