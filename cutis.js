/*
	cutis.js
*/

var cutis = {
	id : "cutis",
	baseUrl : "http://lukenickerson.github.io/ludum-dare-cutis/",
	skins : [],
	$elt : null,
	selectedSkinIndex : -1,
	initAttempt : 0,
	$ : null, // jQuery reference
	loadCSS : function(url, classes){
		var c = this;
		url = c.baseUrl + url;
		c.$('<link class="' + classes + '"></link>')
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', url)
			.ready(function(){ 
				//console.log("Loaded", url); 
			})
		;
	},
	loadJS : function(url, classes){
		var c = this;
		url = c.baseUrl + url;
		c.$('<script class="' + classes + '"></script>')
			.appendTo('body')
			.attr('src', url)
			.ready(function(){ 
				//console.log("Loaded", url); 
			})
		;
	},
	loadjQuery : function(callback){
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			callback();
		}
		head.appendChild(script);
	},
	loadSkin : function(){
		var c = this;
		var s = c.skins[c.selectedSkinIndex];
		//console.log("Load Skin", c.selectedSkinIndex, s);
		if (!s.dir) s.dir = s.base;
		c.loadCSS("skins/" + s.dir + "/" + s.base + ".css", "cutis_skin_file");
		c.loadJS("skins/" + s.dir + "/" + s.base + ".js", "cutis_skin_file");
	},
	removeSkins : function(){
		this.$('.cutis_skin_file').remove();
	},
	loadSkinList : function(callback){
		var c = this;
		this.$.ajax({
			url: c.baseUrl + "skin_list.json.js"
			,contentType : "application/javascript"
			,dataType: "jsonp"
			,jsonpCallback : "data"
		}).done(function(d){
			c.skins = d;
			callback();
		}).fail(function(){
			console.error("AJAX Fail", arguments);
		});

	},
	selectSkin : function(si){
		var c = this;
		c.$elt.find(".skinList a").removeClass("selected");
		c.selectedSkinIndex = si;
		var s = c.skins[c.selectedSkinIndex];
		c.removeSkins();
		c.loadSkin();
		c.$elt.find(".cutis_skin_" + si).addClass("selected");
		localStorage.setItem("cutis_selected_skin_base", s.base);
	},
	selectSkinByBase : function(b){
		var c = this;
		if (b == "original") {
			c.removeSkins();
		} else {
			for(var i = 0; i < c.skins.length; i++){
				//console.log(i, b, c.skins[i].base);
				if (c.skins[i].base == b) {
					c.selectSkin(i);
					return;
				}
			}
			console.log("No skin found:", b);
			c.removeSkins();
		}
	},
	loadSelectedSkin : function(){
		var skinBase = localStorage.getItem("cutis_selected_skin_base");
		//console.log("Loading last saved skin", skinBase);
		this.selectSkinByBase(skinBase);
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
		var $s = c.$(
			'<div class="skins"><p>Select a skin:</p>'
			+ '<ul class="skinList"></ul>'
			+ '<p>Skins provided by the community via <a href="' + c.baseUrl + '">Cutis</a>.</p>'
			+ '</div>'
			);
		$s.find('.skinList').on("click", "a", function(e){
				var si = parseInt(c.$(this).data("skinindex"));
				if (si < 0) {
					c.selectSkinByBase("original");
				} else {
					c.selectSkin(si);
				}
				e.preventDefault();
			});
		var $b = c.$('<button type="button"><b></b><b></b>Skins</button>')
			.click(function(){
				// *** toggle open / closed
			});
		
		c.$elt = c.$('<div id="' + c.id + '"></div>')
			.append($s).append($b)
		;		
	},
	init : function(){
		var c = this;
		c.initAttempt++;
		if (typeof jQuery == 'undefined') { // Check for jQuery
			if (c.initAttempt < 3) {
				cutis.loadjQuery(function(){
					cutis.init();
				});
			} else {
				console.error("Couldn't find jQuery so couldn't initialize cutis.");
			}
		} else {
			if (!window.localStorage) {
				console.error("Your browser does not support localStorage."
					+ " Cutis will be unable to save your skin selections."
				);
			}
			jQuery(document).ready(function($){
				c.$ = $;
				c.build();
				c.loadSkinList(function(){
					c.drawSkinList();
					c.loadSelectedSkin();
				});
				c.loadCSS("cutis.css", "cutis_main_style");
				$('body')
					.find('#' + c.id).remove().end()
					.append(c.$elt);
				
			});
		}
	}
}
cutis.init();

