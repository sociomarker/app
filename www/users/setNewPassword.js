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
	var referral=JSON.parse(localStorage.getItem('referral'));
	console.log('referral :'+referral);

	var url = 'https://indiafasteners.com/newPassword?mobile=91'+credentials.mobile+"";
	//var url = 'http://10.10.49.15:3000/newPassword?mobile=91'+credentials.mobile+"";
	var xhr = createCORSRequest('POST', url);
	if (!xhr) {
	    alert('CORS not supported');
	    return;
	}

	// Response handlers.
	xhr.onload = function() {
		var text = JSON.parse(xhr.responseText);
		console.log(text);

		if(!text.status){
			$("#notify").text(text.err.response);
			$("#notify").show();
			console.log("inside status=0 case");
			$("#register").removeClass('running');
		}
		else{
			console.log("inside status!=0 case");
			alert('Password updated successfully!');
			window.location.href='./login.html';
		}
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};
	//xhr.withCredentials = true;
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify(data));
}

$(document).on("pageinit",function(event){
	console.log("document is ready now");

	$("#register").on('vclick',function(event){
		$("#register").addClass('running');
		$("#notify").hide();
		$("#notify").text("");
		$("#firstName").focus();
		var time=setTimeout(nothing,1000);
		function nothing(){
		var password=$("#password").val().trim();
		var confirmPassword=$("#confirmPassword").val().trim();
		//----------------------------------------verification begins here-------------------------------------------------------------
		if(password.length<8){
			$("#notify").text("Too short!");
			$("#notify").show();
			$("#password").val("");
			$("#password").focus();	
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
		}
		else if(password!=confirmPassword)
		{
			
			$("#notify").text("Passwords do not match!");
			$("#notify").show();
			$("#confirmPassword").val("");
			$("#password").val("");
			$("#password").focus();
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
			//event.preventDefault();
		}
		else{
			var credentials={
		 		password:password
		};
		makeCorsRequest(credentials);
		window.scrollTo(0,$(window).height());
		}
			clearTimeout(time);
		}			
	});

});