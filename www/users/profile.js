function addNewCompany() {
   var url = 'https://indiafasteners.com/dashboard';
   var target = '_blank';
   var options = "location = yes"
   var ref = cordova.InAppBrowser.open(url, target, options);
   
   ref.addEventListener('loadstart', loadstartCallback);
   ref.addEventListener('loadstop', loadstopCallback);
   ref.addEventListener('loadloaderror', loaderrorCallback);
   ref.addEventListener('exit', exitCallback);

   function loadstartCallback(event) {
      console.log('Loading started: '  + event.url)
   }

   function loadstopCallback(event) {
      console.log('Loading finished: ' + event.url)
   }

   function loaderrorCallback(error) {
      console.log('Loading error: ' + error.message)
   }

   function exitCallback() {
      console.log('Browser is closed...')
   }
}
function gotostd(){
	window.location.href='./std.html';
}

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		    // XHR for Chrome/Firefox/Opera/Safari.
		    xhr.open(method, url, true);
	} 

	else if (typeof XDomainRequest != "undefined") {
		    // XDomainRequest for IE.
		    xhr = new XDomainRequest();
	    xhr.open(method, url);
	} 
	else {
		// CORS not supported.
		xhr = null;
	}
	return xhr;
}
		// Make the actual CORS request.
function makeCorsRequest(data) {
	// This is a sample server that supports CORS.
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	console.log('credentials :'+JSON.stringify(credentials));

	//var url = 'http://192.168.43.31:3000/getUser?mobile='+credentials.mobile+'&userId='+credentials.userId+"";
	var url = 'https://indiafasteners.com/getUser?mobile='+credentials.mobile+'&userId='+credentials.userId+"";
	var xhr = createCORSRequest('POST', url);
	if (!xhr) {
	    alert('CORS not supported');
	    return;
	}

	// Response handlers.
	xhr.onload = function() {
		$("#register").removeClass('running');
		var text = JSON.parse(xhr.responseText);
		console.log(text);
		if(JSON.parse(text.data)){
			var name=(JSON.parse(text.data)).name.split('_');
		}
		else{
			var name="Jane doe";
		}

		if(text.status==='0'){
			$("body").text(text.msg);
			console.log("inside status=0 case");
		}
		else{
			console.log("inside status!=0 case");
			//window.location.href='./otp.html';
			$("#userName").text(name[0]+" "+name[1]);
			$('#email').text(JSON.parse(text.data).email);
			$("#mobile").text(JSON.parse(text.data).mobile);
			$(".profile-pic").attr('src',credentials.image_url);
			alert(credentials.image_url);
			$("#profile").removeClass('running');
		}
	};

	xhr.onerror = function() {
		$("#register").removeClass('running');
		alert('Woops, there was an error making the request.');
	};
	//xhr.withCredentials = true;
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify(data));
}

$(document).on("pageinit",function(event){
	$("#profile").addClass('running');
	console.log("document is ready now");
	var time=setTimeout(nothing,500);
	function nothing(){
		makeCorsRequest({data:0});
		window.scrollTo(0,0);
		clearTimeout(time);
	}
		//----------------------------------------verification begins here-----------------------------------------------------------

});