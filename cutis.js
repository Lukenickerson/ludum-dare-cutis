/* TO DO
	
	* Visually show which is selected
	* deploy via Github
	* Extension
	
	* Save choice to localStorage and reload
	* X for closing
	
	* Get interest from other designers
	
	
	* Write contributing doc
	* License doc
	* Hide capability
	* Reset capability	
	* Test in IE
	* don't double-load anything
*/

var cutis = {
	id : "cutis",
	skins : [],
	$elt : null,
	selectedSkinIndex : -1,
	loadCSS : function(url, classes){
		console.log("Load " + url);
		$('<link class="' + classes + '"></link>')
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', url)
			.ready(function(){ console.log("Loaded", url); })
		;
	},
	loadJS : function(url, classes){
		$('<script class="' + classes + '"></script>')
			.appendTo('body')
			.attr('src', url)
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
		$.getJSON(
			"skin_list.json"
		).done(function(d){
			console.log("Loaded", d);
			c.skins = d;
			c.drawSkinList();
		}).fail(function(){
			
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
			+ '<p>Skins provided by <a href="">Cutis</a>.</p>'
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