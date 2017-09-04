var days=[
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thrusday",
	"Friday",
	"Saturday"
];

var BlankModule = {
	onHide: function(){},
	onResize: function(){}
}

var modules={
	feeds: BlankModule,
	plan: BlankModule,
	notes: BlankModule,
	calendar: BlankModule,
}

var localStorage = window.localStorage;
var date = new Date()
var notesExpanded = false
var scrollbar = 0

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

Number.prototype.pad = function(size) {
	var s = String(this);
	if(typeof(size) !== "number"){size = 2;}

	while (s.length < size) {s = "0" + s;}
	return s;
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

Date.prototype.getWeek = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function feedError(feed){
	feed.data = [];
	$("#feedlist").append('<a href="'+feed.url+'" style="border-color: #FF0000;"><span>Unable to load: '+feed.name+'</span></a>')
}

$(function() {
	var n = date.getHours();

	if ( n >= 23 || n < 5) {
			message = "<img src='goodnight.png'></img>";
	} else if ( n >= 5 && n < 12 ) {
			message = "<img src='goodmorning.png'></img>";
	} else if ( n >= 12 && n < 18 ) {
			message = "<img src='goodafternoon.png'></img>";
	} else if ( n >= 18 && n < 23 ) {
			message = "<img src='goodevening.png'></img>";
	}

	$("#message").html(message);
	
	resize();
	
	$(".sidemenu, .button").click(function(e){
		if(e.which != 1){return;}
		e.stopPropagation()
	})
	
	$(document).click(function(e){
		if(e.which != 1){return;}
		for(module in modules){
			modules[module].onHide();
		}
	});
	
	for(module in modules){
		var po = document.createElement('script'); po.async = true;
		po.src = 'modules/' + module + '.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	}
	
	$("#focus").focus();
});

function resize(){
	var width = $(window).width();
	scrollbar = $("#feedlist").width() - $("#scrollTest").width();
	
	for(module in modules){
		modules[module].onResize();
	}
	
	if(width > 1600){
		$(".boxed").css("right", "50%")
		$("h1").css("right", "50%")
		$("body").css("background", "")
	}else if (width > 1200){
		$(".boxed").css("right", "800px")
		$("h1").css("right", "800px")
		$("body").css("background", "")
	}else{
		$(".boxed").css("right", "50%")
		$("h1").css("right", "50%")
		$("body").css("background", "#333")
	}
}
$(window).resize(resize);
