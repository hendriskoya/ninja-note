// Saves options to chrome.storage
function save_options() {
  var language = document.getElementById('language').value;
  var color = document.getElementById('highlight_color').value;
  chrome.storage.sync.set({
    translateTo: language,
	highlightColor: color
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    translateTo: 'en',
	highlightColor: '#ffff00'
  }, function(items) {
    document.getElementById('language').value = items.translateTo;
	document.getElementById('highlight_color').value = items.highlightColor;
  });
}

function load_i18n() {
	$('#settings_button').text(chrome.i18n.getMessage("extSettings"));
	$('#annotations_button').text(chrome.i18n.getMessage("extAnnotations"));
	$('#about_button').text(chrome.i18n.getMessage("extAbout"));
}

function remove_all_notes() {
	chrome.storage.sync.remove([g_DATA_STORE_NAME], function() {
		var status = document.getElementById('status');
		status.textContent = 'Notes removed.';
		$('#data tbody > tr').remove();
		setTimeout(function() {
		  status.textContent = '';
		}, 750);
	});
}

function load_notes() {
	chrome.storage.sync.get([g_DATA_STORE_NAME], function(items) {
		if (items != null && items[g_DATA_STORE_NAME] != null) {
			var store = JSON.parse(items[g_DATA_STORE_NAME]);
			$.each(store, function(key, value) {
				//$('#annotations').append('<br>key: ' + key + ', value: ' + value + '</br>'); 
				var selectionList = SelectionList.fromJSON(value);
				/*var text = '<br>';
				text += 'url: ';
				text += selectionList.url;
				text += '</br>';*/
				//$('#annotations').append(text);
				
				selectionList.forEach(function(key, selection) {
					/*var text = '<tr><td>';
					
					text += (key == 1 ? '<a href=' + selectionList.url + '>' + selectionList.title + '</a>' : '');
					text += '</td><td>';
					text += (key == 1 ? selectionList.url : '');
					text += '</td><td>';
					text += selection.description;
					text += '</td><td>';
					selection.forEach(function(index, annotation) {
						if (index == 1) {
							text += annotation.description;
							text += '</td></tr>';
						} else {
							text = '<tr><td></td><td></td><td>';
							text += annotation.description;
							text += '</td></tr>';
						}
					});*/
					//text += '</td></tr>';
					//$('#data > tbody:last').append(text);
					
					$('<tr></tr>').appendTo($('#data > tbody:last'));
					$('<td></td>').appendTo($('#data > tbody > tr:last'));
					//console.log('url: ' + selectionList.urls);
					if (key == 1) {
						$('<a>').attr('href', selectionList.url)
							.attr('target', '_blank')
							.text(selectionList.title).appendTo($('#data > tbody > tr > td:last'));
					}
					
					$('<td>' + selection.description + '</td>').appendTo($('#data > tbody > tr:last'));
					selection.forEach(function(index, annotation) {
						if (index == 1) {
							$('<td>' + annotation.description + '</td>').appendTo($('#data > tbody > tr:last'));
						} else {
							$('<tr></tr>').appendTo($('#data > tbody:last'));
							$('<td></td>').appendTo($('#data > tbody > tr:last'));
							$('<td></td>').appendTo($('#data > tbody > tr:last'));
							$('<td>' + annotation.description + '</td>').appendTo($('#data > tbody > tr:last'));
						}
					});
					
					//$('<td>2</td>').appendTo($('#data > tbody > tr:last'));
					//$('<td>3</td>').appendTo($('#data > tbody > tr:last'));
					
				});
				
				//alert(document.getElementById('data').innerHTML);
			});
		}
	});
}

function content_loaded() {
	load_i18n();
	showSettings();
}

function showSettings() {
	$("#colCentral").empty();
	
	buildTranslateField("colCentral");
	buildHighlightField("colCentral");
	buildStatusField("colCentral");
	buildSaveButton("colCentral");
	
	restore_options();
}

function buildSaveButton(owner) {
	var button = $('<button></button>').attr('id', 'save');
	button.text(chrome.i18n.getMessage("extSave"));
	button.click(save_options);
	
	var p = $('<p></p>');
	p.append(button);
	$("#" + owner).append(p);
}

function buildStatusField(owner) {
	var div = $('<div></div>').attr('id', 'status');
	
	var p = $('<p></p>');
	p.append(div);
	$("#" + owner).append(p);
}

function buildHighlightField(owner) {
	var label = $('<label></label>').attr('id', 'highlight_color_label');
	label.text(chrome.i18n.getMessage("extHighlightColorLabel"));
	
	var select = $('<select></select>').attr('id', 'highlight_color');
	select.append($("<option></option>").attr("value", '#ff0000').text("RED"));
	select.append($("<option></option>").attr("value", '#00ff00').text("GREEN"));
	select.append($("<option></option>").attr("value", '#ffff00').text("YELLOW"));
	
	var p = $('<p></p>');
	p.append(label);
	p.append(select);
	$("#" + owner).append(p);
}

function buildTranslateField(owner) {
	var label = $('<label></label>').attr('id', 'translate_to_label');
	label.text(chrome.i18n.getMessage("extTranslateToLabel"));
	
	var select = $('<select></select>').attr('id', 'language');
	
	var languages = JSON.parse(chrome.i18n.getMessage("extLanguages"));
	$.each(languages, function(key, value) {
		select.append($("<option></option>")
				.attr("value", key)
				.text(value)); 
	});			
	
	var p = $('<p></p>');
	p.append(label);
	p.append(select);
	$("#" + owner).append(p);
}

function showAnnotations() {
	$("#colCentral").empty();
	buildRemoveAnnotationsButton("colCentral");
	buildAnnotationsTable("colCentral");
	load_notes();
}

function buildRemoveAnnotationsButton(owner) {
	var button = $('<button></button>').attr('id', 'removeAllNotes');
	button.text(chrome.i18n.getMessage("extRemoveAllNotes"));
	button.click(remove_all_notes);
	
	var p = $('<p></p>');
	p.append(button);
	$("#" + owner).append(p);
}

function buildAnnotationsTable(owner) {
	var table = $('<table></table>').attr('id', 'data');
	var tr = $('<tr></tr>').append($('<th>URL</th>')).append($('<th>selection</th>')).append($('<th>annotation</th>'));
	var thead = $('<thead></thead>').append(tr);
	var tbody = $('<tbody></tbody>');
	table.append(thead);
	table.append(tbody);
	
	var p = $('<p></p>');
	p.append(table);
	$("#" + owner).append(p);
}

document.addEventListener('DOMContentLoaded', content_loaded);
//document.getElementById('save').addEventListener('click', save_options);
//document.getElementById('remoteAllNotes').addEventListener('click', remove_all_notes);
document.getElementById('settings_button').addEventListener('click', showSettings);
document.getElementById('annotations_button').addEventListener('click', showAnnotations);