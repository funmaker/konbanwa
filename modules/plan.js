modules["plan"] = (function(){
	var Visible = false;
	var lessonsColors = {
		W: "#E2DD1B",
		C: "#1AE02B",
		L: "#45B1CC",
	}

	function onHide(){
		if(Visible){
			Visible = false;
			$("#bMore").html("▶")
			$("#timetableWrap").animate({
				width: 300
			});
			$("#timetable").animate({
				width: 1500
			});
			$("#timetableWrapWrap").animate({
				left: -351
			});
		}
	}

	function onResize(){
		$("#timetableWrap").css("height", "calc( 100% + "+scrollbar+"px )")
	}

	$.ajax({
		url: 'plan.json',
		dataType: 'json',
		success: function(data) {
			var plan = data.entries;
			var timetable = $("#timetable")
			for(var i=0; i<plan.length; i++){
				var lesson = plan[i]
				$("<div class='lesson "+((1+(date.getWeek()%2)==lesson.week || lesson.week==3) ? 'ghost' : '')+"'>").appendTo(timetable.children()[lesson.week_day])
					.css("top", (lesson.start_min/60 + lesson.start_hour-6)*6.5+"%")
					.css("height", (lesson.end_min/60 + (lesson.end_hour) - lesson.start_min/60 - (lesson.start_hour))*6.5+"%")
					.css("border-color", lessonsColors[lesson.course_type])
					.append("<div class='type'>"+lesson.course_type+"</div>")
					.append("<div class='name'>"+lesson.course_name+"</div>")
					.append("<div class='lecturer'>"+lesson.lecturer+"<div class='code'>"+lesson.course_code+" - "+lesson.group_code+"</div></div>")
					.append("<div class='room'>"+lesson.building+" / "+lesson.room+"</div><br>")
					.append("<div class='time'>"+lesson.start_hour.pad()+"<sup>"+lesson.start_min.pad()+"</sup>-"+lesson.end_hour.pad()+"<sup>"+lesson.end_min.pad()+"</div>")
			}
		},
		error: function(_, error){
			feedError({url:"plan.json", name: "timetable"});
		}
	});

	$("#timetableWrap").css("width", $(".day").width()+1+"px")
	$("#timetableWrapWrap").css("left", -$("#timetableWrapWrap").width()-1+"px")

	var day = date.getDay()-1;
	if( day>=0 && day<=4 && date.getHours()>=7 && date.getHours()<=21){
		$("<div id='dayTimeline'></div>").appendTo($($("#timetable").children()[day]))
				.css("top", (date.getHours()+date.getMinutes()/60-6)*6.5+"%")
	}else if(day<0 || day>4 && date.getHours()>=7){
		day = 0;
	}

	$("#bTimetable").click(function(){
		$("#timetableWrap").scrollLeft(day*300);
		$("#timetableWrapWrap").animate({
			left: 0
		});
		Visible = true
	});

	$("#bMore").click(function(e){
		if($(e.target).html()=="▶"){
			$(e.target).html("◀")
			$("#timetableWrap").animate({
				width: Math.min($(window).width()*0.8, 1500),
				scrollLeft: 0,
			}, function(){$("#timetableWrap").css("width", "auto")});
			$("#timetable").animate({
				width: Math.min($(window).width()*0.8, 1500)
			});
		}else{
			$(e.target).html("▶")
			$("#timetableWrap").animate({
				width: 300,
				scrollLeft: day*300
			});
			$("#timetable").animate({
				width: 1500
			});
		}
	});

	window.setInterval(function(){
		var date = new Date();
		$("#dayTimeline").css("top", ( date.getHours()+date.getMinutes()/60+date.getSeconds()/60/60-6)*6.5+"%");
	}, 1000)

	onResize()

	return{
		onHide: onHide,
		onResize: onResize,
	}
})();
