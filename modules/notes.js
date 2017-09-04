modules["notes"] = (function(){
	var Visible = false;
	var Files = JSON.parse(localStorage["files"] || "[]");
	var Sessions = [];
	var Keys = [];
	var Editor;
	var SelectedTab = 0;
	document.Files = Files;
	
	function updateTabs(){
		if(Files.length == 0){
			newFile("New File");
		}
		if(SelectedTab<0 || SelectedTab>=Files.length){
			SelectedTab=0;
		}
		var Tabs = $("#tabs");
		Tabs.html("");
		for(var i=0; i<Files.length; i++){
			var File = Files[i];
			Tabs.append("<div class='tab "+(File.encrypted ? "encrypted " : "")+(File.decrypted ? "decrypted " : "")+(File.temp ? "temp " : "")+(i==SelectedTab ? "selected " : "")+"'>"+File.name+"</div>")
		}
		Editor.setSession(Sessions[SelectedTab]);
		if(Files[SelectedTab].encrypted && !Files[SelectedTab].decrypted){
			$("#cryptLock").show()
			if(Visible){$("#cryptInput").focus()}
		}else{
			$("#cryptLock").hide()
			if(Visible){Editor.focus()}
		}
		$(".tab").click(function(){
			SelectedTab = $(".tab").index($(this));
			updateTabs()
		})
		localStorage["files"]=JSON.stringify(Files);
	}
	
	function isNameAvailable(name){
		for(var i=0; i<Files.length; i++){
			if(Files[i].name==name){
				return false;
			}
		}
		return true;
	}
	
	function newFile(name, content){
		if(!isNameAvailable(name)){
			var i=2;
			while(!isNameAvailable(name+" ("+i+")")){
				i++;
			}
			name = name+" ("+i+")";
		}
		Files.push({
			name: name,
			content: content || "",
			encrypted: false,
			decrypted: false,
			temp: false,
			dirty: true,
			created: Date.now(),
			edited: Date.now(),
			hash: "",
		});
		Sessions.push(new ace.EditSession(content || ""));
		SelectedTab = Files.length-1;
		updateTabs();
	}
	
	function onHide(){
		if(Visible){
			Visible = false
			$("#notesWrap").animate({
				left: -801
			});
		}
	}

	function onResize(){
		$("#editor").css( "right", -scrollbar+"px" )
	}

	$("#bNotes").click(function(){
		$("#notesWrap").animate({
			left: 0
		});
		Visible = true
	});
	
	$("#bNew").click(function(){
		newFile("New File")
	});
	
	$("#bClose").click(function(){
		Files.splice(SelectedTab, 1)
		Sessions.splice(SelectedTab, 1)
		SelectedTab--;
		updateTabs();
	});
	
	$("#bRename").click(function(){
		var name = ""
		do{
			name = prompt("Enter new filename:")
		}while(!isNameAvailable(name) && name != Files[SelectedTab].name)
		if(name != "null" && /\S/.test(name)){
			Files[SelectedTab].name = name
			updateTabs();
		}
	});
	
	$("#bEncrypt").click(function(){
		var file = Files[SelectedTab];
		if(!file.encrypted){
			var key = prompt("Enter encryption key:");
			if(key != null){
				file.encrypted = true;
				file.dirty = true;
				file.hash = CryptoJS.MD5(file.content).toString();
				file.content = CryptoJS.AES.encrypt(file.content, key).toString();
				Editor.setValue("");
			}
		}else if(file.decrypted){
			file.decrypted = false;
			delete Keys[SelectedTab]
			Editor.setValue("");
		}
		updateTabs();
	});
	
	$("#bDecrypt").click(function(){
		var file = Files[SelectedTab];
		if(file.encrypted && file.decrypted){
			file.encrypted = false;
			file.decrypted = false;
			file.dirty = true;
			file.hash = "";
			file.content = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(file.content, Keys[SelectedTab]));
			delete Keys[SelectedTab]
		}
		
		updateTabs();
	});
	
	$("#bDecrypt").click(function(){
		var file = Files[SelectedTab];
		if(file.encrypted && file.decrypted){
			file.encrypted = false;
			file.decrypted = false;
			file.dirty = true;
			file.hash = "";
			file.content = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(file.content, Keys[SelectedTab]));
			delete Keys[SelectedTab]
		}
		
		updateTabs();
	});
	
	$("#bInfo").click(function(){
		var file = Files[SelectedTab];
		var text = "File metadata:\n";
		text += "\tName: " + file.name + "\n";
		text += "\tSize: " + Math.round((CryptoJS.enc.Utf8.parse(JSON.stringify(file)).sigBytes)/10.24)/100 + " KB\n";
		text += "\tLength: " + Editor.getValue().length + " characters\n";
		text += "\tCreated: " + new Date(file.created).toLocaleString() + "\n";
		text += "\tModified: " + new Date(file.edited).toLocaleString() + "\n";
		text += file.encrypted ? ("\tFile is encrypted\n\tHash: " + file.hash + "\n") : "\tFile is not encrypted\n";
		alert(text)
	});
	

	$("#cryptInput").keypress(function(e){
		if (e.which == 13) {
			var file = Files[SelectedTab];
			if(!file.encrypted){return}
			var cryptInput = $("#cryptInput");
			var content = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(file.content, cryptInput.val()));
			if(file.hash == CryptoJS.MD5(content).toString()){
				file.decrypted=true;
				Editor.setValue(content);
				Keys[SelectedTab] = cryptInput.val();
			}else{
				cryptInput.css("border-color", "#f00");
			}
			cryptInput.val("");
			updateTabs();
		}
	});
	
	(function() {
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'ace/ace.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		$(po).on( "load", function(){
			Editor = ace.edit("editor");
			Editor.setTheme("ace/theme/konbanwa");
			Editor.getSession().setMode("ace/mode/text");
			Editor.setOption("vScrollBarAlwaysVisible", true)
			Editor.setOption("wrap", "free")
			Editor.setHighlightActiveLine(false)
			Editor.renderer.setShowPrintMargin(false);
			Editor.on("change", function(){
				Files[SelectedTab].dirty=true;
			})
			for(var i=0; i<Files.length; i++){
				Files[i].decrypted=false;
				session = new ace.EditSession((Files[i].encrypted) ? ("") : (Files[i].content))
				Sessions.push(session);
			}
			updateTabs();
			window.setInterval(function(){
				var dirty = false;
				for(var i=0; i<Files.length; i++){
					file = Files[i];
					if(file.dirty){
						dirty = true;
						file.dirty = false;
						file.edited = Date.now();
						if(file.encrypted && file.decrypted){
							file.content = CryptoJS.AES.encrypt(Sessions[i].getValue(), Keys[i]).toString();
							file.hash = CryptoJS.MD5(Sessions[i].getValue()).toString();
						}else if(file.encrypted && !file.decrypted){
							// nothing
						}else{
							file.content = Sessions[i].getValue();
						}
					}
				}
				if(dirty){
					localStorage["files"]=JSON.stringify(Files);
				}
			}, 1000)
		})
		po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js';
		s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js';
		s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();
	
	onResize();
	
	return{
		onHide: onHide,
		onResize: onResize,
	}
})();