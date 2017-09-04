modules["calendar"] = (function(){
	var Visible = false;
	var Notifications = JSON.parse(localStorage["notifications"] || "[]");
	for(var i=0; i<Notifications.length; i++){
		Notifications[i].date = newDate(Notifications[i].date);
	}
	var date = new Date();

	function onHide(){
		if(Visible){
			Visible = false;
			$("#calendarWrap").animate({
				left: -80+"%"
			});
		}
	}

	function onResize(){}
	
	function newNotif(time){
		var notif = {
			title: "",
			desc: "",
			icon: 0,
			repeat: "once",
			date: new Date(time),
			days: [false, false, false, false, false, false, false],
			oddWeeks: false,
			showTime: false,
		};
		notif.days[(notif.date.getDay()-1).mod(7)] = true;
		notif.oddWeeks = notif.date.getWeek() % 2 == 0;
		Notifications.push(notif);
		editNotif(notif);
	}
	
	function editNotif(notif){
		$("#notifTitle").val(notif.title);
		$("#notifDesc").val(notif.desc);
		var icons = $("#notifIcons td:not(:last-child)");
		icons.removeClass("active");
		$(icons[notif.icon]).addClass("active");
		$("#notifRepeat").val(notif.repeat);
		$("#notifRepeat").change();
		$("#notifDay input").val(notif.date.getDate());
		$("#notifMonth input").val(notif.date.getMonth());
		$("#notifYear input").val(notif.date.getFullYear());
		for(var i=0; i<7; i++){
			if(notif.days[i]){
				$($("#notifDays td")[i]).addClass("active");
			}else{
				$($("#notifDays td")[i]).removeClass("active");
			}
		}
		if(notif.oddWeeks){
			$($("#notifWeeks td")[0]).removeClass("active");
			$($("#notifWeeks td")[1]).addClass("active");
		}else{
			$($("#notifWeeks td")[0]).addClass("active");
			$($("#notifWeeks td")[1]).removeClass("active");
		}
		$("#notifEditor").show();
	}
	
	function rebuild(date){
		var table = $("#month");
		var date = date || new Date();
		var month = date.getMonth();
		date.setDate(1);
		date.setDate(1-(date.getDay()-1).mod(7));
		while(date.getMonth() <= month){
			var week = $("<tr></tr>").appendTo(table);
			for(var i=0; i<7; i++){
				var day = $("<td></td>").addClass((date.getMonth() == month) ? "" : "oldDay")
					.append("<span>"+date.getDate()+"</span>")
					.append($("<div class='notifAdd' data-date='"+date.getTime()+"'></div>").click(function(){newNotif($(this).data("date"));}))
				
				day.appendTo(week);
				date.setDate(date.getDate()+1);
			}
		}
	}
	
	$("#bCalendar").click(function(){
		$("#calendarWrap").animate({
			left: 0
		});
		Visible = true
	});
	
	$("#notifRepeat").change(function(e){
		var date = $("#notifDate");
		var weeks = $("#notifWeeks");
		var days = $("#notifDays");
		var day = $("#notifDay");
		var month = $("#notifMonth");
		var year = $("#notifYear");
		switch($(this).val()) {
			case "once":
				date.show();
				weeks.hide();
				days.hide();
				month.addClass("active").children().prop('disabled', false);
				year.addClass("active").children().prop('disabled', false);
				break;
			case "year":
				date.show();
				weeks.hide();
				days.hide();
				month.addClass("active").children().prop('disabled', false);
				year.removeClass("active").children().prop('disabled', true);
				break;
			case "month":
				date.show();
				weeks.hide();
				days.hide();
				month.removeClass("active").children().prop('disabled', true);
				year.removeClass("active").children().prop('disabled', true);
				break;
			case "week":
				date.hide();
				weeks.hide();
				days.show();
				break;
			case "biweek":
				date.hide();
				weeks.show();
				days.hide();
				break;
		} 
	});
	
	$("#notifIcons td:not(:last-child)").click(function(e){
		var icons = $("#notifIcons td:not(:last-child)");
		icons.removeClass("active");
		$(this).addClass("active");
	});
	
	$("#notifWeeks td").click(function(e){
		var icons = $("#notifWeeks td");
		icons.removeClass("active");
		$(this).addClass("active");
	});
	
	$("#notifDays td").click(function(e){
		var This = $(this);
		if(This.hasClass("active")){
			This.removeClass("active");
		}else{
			This.addClass("active");
		}
	});
	
	onResize();
	rebuild();
	$("#notifRepeat").change();
	
	return{
		onHide: onHide,
		onResize: onResize,
	}
})();