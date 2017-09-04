modules["feeds"] = (function(){
	var Visible = false;
	var feeds={};
	var entries=[];
	var entriesUsed = 0;
	var seenfeeds = JSON.parse(localStorage["seenfeeds"] || "[]");
	var day = -1;

	function str2time(str){
		return (new Date(str)).getTime()
	}

	function fillFeed(){
		var today = date.getDate();
		var curMonth = date.getMonth();
		var listDiv = $("#feedlist");
		var seen = 0;
		var notseen = 0;
		while(listDiv.prop('scrollHeight')-500<listDiv.scrollTop()+listDiv.height() && entriesUsed<entries.length){
			var i = entriesUsed;
			entriesUsed = entriesUsed + 1
			var time = new Date(entries[i].timestamp);
			if(time.getTime()<date.getTime()){
				var entry = entries[i];
				var feedNameMatch = /[^-]*-[^-]*-(.*)/.exec(entry.feedName);
				if(entry.extra && entry.extra.displayName){
					entry.feedName = entry.extra.displayName
				}else if(feedNameMatch != null) {
					entry.feedName = feedNameMatch[1]
				}
				if(time.getDate() != day){
					day = time.getDate();
					var str = "";
					if(day == today) str = "Today";
					else if(day == today - 1) str = "Yesterday";
					else if(today - day < 7 && time.getMonth() == curMonth) str = days[time.getDay()];
					else str = time.toLocaleDateString();
					listDiv.append('<div class="dateDivider"><span>'+str+'</span></div>');
				}
				if( seenfeeds.indexOf(entry.guid) != -1 ){
					listDiv.append('<a class="seen" href="'+entry.link+'" style="border-left-color:'+entry.color+'" data-hash="'+entry.guid+'"><span>'+entry.feedName+': </span>'+entry.title+'<div class="time">'+time.getHours().pad()+':'+time.getMinutes().pad()+'</div></a>')
				}else{
					notseen++;
					listDiv.append('<a onclick="seeEntry($(this), event, false)" href="'+entry.link+'" style="border-left-color:'+entry.color+'" data-hash="'+entry.guid+'"><span>'+entry.feedName+': </span>'+entry.title+'<div class="hide" onclick="seeEntry($(this).parent(), event, true)">✖</div><div class="time">'+time.getHours().pad()+':'+time.getMinutes().pad()+'</div></a>')
				}
				$("#feedlist a").last().mousedown(function(e){
					if(e.which == 2){
						seeEntry($(e.target), e)
					}
					return true;
				});
			}
		}
	}

	function seeEntry(target, e, prevent){
		if(prevent){
			e.preventDefault();
		}
		if(seenfeeds.indexOf(target.data("hash"))==-1){
			seenfeeds.unshift(target.data("hash"));
			target.addClass("seen");
			seenfeeds = seenfeeds.slice(0,100);
			localStorage["seenfeeds"] = JSON.stringify(seenfeeds);
		}
		target.find(".hide").hide();
	}

	function getFeed() {
		var ws = new WebSocket("ws://funmaker.me:9039");
		
		ws.onmessage = event => parseFeed(JSON.parse(event.data));
		
		var request = {
			command: "fetch",
			flat: true,
			feeds: ["funmaker-*"]
		}
		
		ws.onopen = () => ws.send(JSON.stringify(request))
	}
	
	function parseFeed(feeds) {
		$("#bFeed").css("background-image", "url('rss.png')");
		entries = feeds.notifications
		entries.sort((a, b) => b.timestamp - a.timestamp)
		statusFeed(feeds.status)
		fillFeed()
	}
	
	function statusFeed(statusVec) {
		var threadsDiv = $("#threads");
		
		function compare(a, b){
			if(a == undefined || b == undefined) return 0;
		    if(a < b) return -1;
		    if(a > b) return 1;
		    return 0;
		}
		
		for(status of statusVec) {
			if (status.extra == undefined) {
				status.extra = {}
			}
		}
		statusVec.sort((a, b) => compare(a.extra.board, b.extra.board) * 100 + compare(a.extra.page, b.extra.page))
		
		for(i in statusVec) {
			var status = statusVec[i]
			if(status.extra !== undefined && status.extra.replies !== undefined) {
				status.feedName = "/" + status.extra.board + "/"
				status.timestamp = status.extra.replies + "/" + status.extra.images + "/" + status.extra.page
			} else {
				var time = new Date(status.timestamp);
				status.timestamp = time.getHours().pad()+':'+time.getMinutes().pad()
				var feedNameMatch = /[^-]*-[^-]*-(.*)/.exec(status.feedName);
				if(feedNameMatch != null) {
					status.feedName = feedNameMatch[1]
				}
			}
			threadsDiv.append('<a onmouseenter="showHover(\''+status.imageURL+'\', '+i+');" onmouseleave="hideHover();" href="'+status.link+'" style="border-left-color:'+status.color+'"><span>'+status.feedName+'</span> - '+status.title+'<div class="time">'+status.timestamp+'</div></a>');
		}
	}
	
	function showHover(img, thread){
		var imageDiv = $("#imagehover");
		imageDiv.detach()
		imageDiv.show();
		imageDiv.attr("src", img);
		$($("#threads").children()[thread]).append(imageDiv);
	}

	function hideHover(){
		$("#imagehover").hide();
	}

	function onHide(){
		if(Visible){
			$("#feedlistWrap").animate({
				left: -801
			});
		}
	}

	function onResize(){
		$("#feedlist").css("width", "calc( 100% + "+scrollbar+"px )")
	}
	
	getFeed()
	
	$("#bFeed").click(function(){
		$("#cFeed").html("");
		localStorage["lastseen"] = entries[0] ? entries[0].hash : 0;
		$("#feedlistWrap").animate({
			left: 0
		});
		Visible = true
	});

	$("#feedlist").scroll(fillFeed)

	onResize()

	return{
		onHide: onHide,
		onResize: onResize,
		seeEntry: seeEntry,
		showHover: showHover,
		hideHover: hideHover,
	}
})();

seeEntry = modules["feeds"].seeEntry
showHover = modules["feeds"].showHover
hideHover = modules["feeds"].hideHover
