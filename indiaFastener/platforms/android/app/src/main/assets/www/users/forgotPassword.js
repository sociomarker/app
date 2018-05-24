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
	var url = 'https://indiafasteners.com/forgotPassword?mobile=911';
	//var url='http://10.10.49.15:3000/forgotPassword?mobile=911';
	var xhr = createCORSRequest('POST', url);
	if (!xhr) {
	    alert('CORS not supported');
	    return;
	}

	// Response handlers.
	xhr.onload = function() {
		var text = JSON.parse(xhr.responseText);
		console.log(text);

		if(text.status==='0'){
			$("#notify").text(text.message);
			$("#notify").show();
			window.scrollTo(0,$(window).height());
			console.log("inside status=0 case");
			if(text.case==='1'){
				$("#case1").show();
			}
			$("#register").removeClass('running');
		}
		else{
			var otp1=localStorage.getItem('otp');
			console.log('otp as of now: '+otp1);
			localStorage.setItem('otp',text.otp);
			console.log('otp after update: '+localStorage.getItem('otp'));
			window.location.href='./otpPostOnly.html';
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
	$("#case1").hide();
	console.log("document is ready now");
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	credentials.forgot_from='forgotPassword';
	localStorage.setItem('credentials',JSON.stringify(credentials));

	$("#register").on('vclick',function(event){
		$("#register").addClass('running');
		$("#notify").hide();
		$("#notify").text("");
		var time=setTimeout(nothing,1000);
		function nothing(){
		
		var mobile=$("#mobile").val().trim();
		//----------------------------------------verification begins here-------------------------------------------------------------
		if((mobile==="")||(mobile.length!=10))
		{
			$("#notify").text("Mobile No. should have 10 digits!");
			$("#notify").show();
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
		}
		
		else if(!(/[0-9]/.test(mobile))){
			$("#notify").text("Invalid mobile number");
			$("#notify").show();
			$("#email").val("");
			$("#email").focus();	
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
		}
		else{
			var credentials={mobile:mobile
		};
		makeCorsRequest(credentials);
		window.scrollTo(0,$(window).height());
		}
			clearTimeout(time);
		}			
	});

});