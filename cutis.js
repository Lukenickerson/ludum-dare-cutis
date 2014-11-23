/*
	cutis.js
*/

var cutis = {
	id : "cutis",
	baseUrl : "http://lukenickerson.github.io/ludum-dare-cutis/",
	skins : [],
	$elt : null,
	selectedSkinIndex : -1,
	loadCSS : function(url, classes){
		$('<link class="' + classes + '"></link>')
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', c.baseUrl + url)
			.ready(function(){ console.log("Loaded", url); })
		;
	},
	loadJS : function(url, classes){
		$('<script class="' + classes + '"></script>')
			.appendTo('body')
			.attr('src', c.baseUrl + url)
			.ready(function(){ console.log("Loaded", url); })
		;
	},
	selectSkin : function(si){
		var c = this;
		c.$elt.find("cutis_skin_" + c.selectedSkinIndex).removeClass("selected");
		c.selectedSkinIndex = si;
		c.loadSkin();
		c.$elt.find("cutis_skin_" + si).addClass("selected");
	},
	loadSkin : function(){
		var c = this;
		var s = c.skins[c.selectedSkinIndex];
		console.log("Load Skin", c.selectedSkinIndex, s);
		c.removeSkins();
		if (!s.dir) s.dir = s.base;
		c.loadCSS("skins/" + s.dir + "/" + s.base + ".css", "cutis_skin_file");
		c.loadJS("skins/" + s.dir + "/" + s.base + ".js", "cutis_skin_file");
	},
	removeSkins : function(){
		$('.cutis_skin_file').remove();
	},
	loadSkinList : function(){
		var c = this;
		//c.loadJS("skin_list.js", "cutis_skin_list");
		
		// TEST 1
		/*
		$.getJSON(
			c.baseUrl + "skin_list.json" 
			+ "?callback=data" // Make JSONP (http://stackoverflow.com/a/10872804/1766230)
		).done(function(d){
			console.log("Loaded", d);
			c.skins = d;
			c.drawSkinList();
		}).fail(function(){
			console.error("AJAX Fail", arguments);
		});
		*/
		
		// TEST 2
		$.ajax({
			url: c.baseUrl + "skin_list.jsonp"
			,contentType : "application/json"
			,dataType: "jsonp"
			,jsonpCallback : "data"
		}).done(function(d){
			console.log(arguments);
			console.log("Loaded", d);
			c.skins = d;
			c.drawSkinList();
		}).fail(function(){
			console.error("AJAX Fail", arguments);
		});

	},
	drawSkinList : function(){
		var c = this;
		var h = '<li><a href="#!REMOVE-SKIN" data-skinindex="-1">Original</a></li>';
		for (var i = 0; i < c.skins.length; i++){
			h += '<li><a href="#!LOAD-NEW-SKIN" data-skinindex="' + i + '" '
				+' class="cutis_skin_' + i + '">' 
				+ c.skins[i].display + '</a></li>';
		}
		c.$elt.find('.skinList').html(h);
	},
	build : function(){
		var c = this;
		var $s = $(
			'<div class="skins"><p>Select a skin:</p>'
			+ '<ul class="skinList"></ul>'
			+ '<p>Skins provided by <a href="' + c.baseUrl + '">Cutis</a>.</p>'
			+ '</div>'
			);
		$s.find('.skinList').on("click", "a", function(e){
				var si = parseInt($(this).data("skinindex"));
				if (si < 0) {
					c.removeSkins();
				} else {
					c.selectSkin(si);
				}
				e.preventDefault();
			});
		var $b = $('<button type="button"><b></b><b></b>Skins</button>')
			.click(function(){
				// *** toggle open / closed
			});
		
		c.$elt = $('<div id="' + c.id + '"></div>')
			.append($s).append($b)
		;		
	},
	init : function(){
		var c = this;
		c.build();
		c.loadSkinList();
		c.loadCSS("cutis.css");
		$('body')
			.find('#' + c.id).remove().end()
			.append(c.$elt);
	}
}
$(document).ready(function(){
	cutis.init();	
});