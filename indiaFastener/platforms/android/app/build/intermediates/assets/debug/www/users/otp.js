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
	console.log("inside makeCORS function");
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	var referral=JSON.parse(localStorage.getItem('referral'));
	console.log('credentials: '+JSON.stringify(credentials));

	if(data==='~a*a#b*b~'){
		console.log("inside get request method");
		//var url='http://10.10.49.15:3000/otp?mobile='+credentials.mobile+'&email='+credentials.email+"";
		var url='https://indiafasteners.com/otp?mobile='+credentials.mobile+'&email='+credentials.email+"";
		var xhr = createCORSRequest('GET', url);
		if (!xhr) {
		    alert('CORS not supported');
		    return;
		}
		// Response handlers.
		xhr.onload = function() {
			var text = JSON.parse(xhr.responseText);
			console.log('otp is: '+text.otp);
			localStorage.setItem('otp',text.otp);
			console.log('printing otp from localStorage: '+localStorage.getItem('otp'));
			console.log(text);
		};

		xhr.onerror = function() {
			alert('Woops, there was an error making the request.');
		};
		xhr.send();

	}

	else{
		var details={
			data:data,
			email:credentials.email,
			userId:credentials.userId,
			referred:referral.referred,
			otp:localStorage.getItem('otp'),
			firstName:credentials.firstName,
			forgot_from:credentials.forgot_from
		};
		console.log(JSON.stringify(details));
		var url = 'http://indiafasteners.com/sendOtp?mobile=91'+credentials.mobile+"";
		//var url='http://10.10.49.15:3000/sendOtp?mobile=91'+credentials.mobile+"";
		var xhr = createCORSRequest('POST', url);
		if (!xhr) {
		    alert('Kindly update the App');
		    return;
		}
		// Response handlers.
		xhr.onload = function() {
			var text = JSON.parse(xhr.responseText);
			console.log(text);
			console.log("printing readyState and status inside onload function respectively: "+xhr.readyState+" "+xhr.status);
			if(!text.otpVerified){
				$("#notify").text(text.msg);
				$("#notify").show();
				console.log("inside status=0 case");
				$("#retry").show();
				$("#register").removeClass('running');
			}
			else{
				console.log("inside status!=0 case and should have been redirected");
				credentials.otpVerified=true;
				localStorage.setItem('credentials',JSON.stringify(credentials));
				// $("#register").removeClass('running');
				if(localStorage.getItem('loggedIn')){
					window.location.href='./profile.html';
				}
				else{
					window.location.href='./login.html';
				}
			}
		};

		xhr.onerror = function() {
			$("#register").removeClass('running');
			alert('Woops, there was an error making the request.');
		};
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(JSON.stringify(details));
	}
}

$(document).on("pageinit",function(event){
	console.log("pageinit occurred");
	makeCorsRequest('~a*a#b*b~');
	console.log("document is ready now");
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	if(!credentials.forgot_from){
		console.log('forgot_from was empty now it is being set');
		credentials.forgot_from='register';
		localStorage.setItem('credentials',JSON.stringify(credentials));
	}

	$("#register").on('vclick',function(){
		$("#register").addClass('running');
		var time=setTimeout(nothing,1000);
		function nothing(){
			$("#notify").hide();
			$("#notify").text('');
			var data= $("#otp").val().trim();
			console.log("verify button clicked");
			
			if($.isNumeric(data)){
				console.log("printing isNumeric output"+$.isNumeric(data));
				makeCorsRequest(data);	
			}
			else{
				$("#register").removeClass('running');
				$("#notify").text('Otp should be numeric');
				$("#notify").show();
				window.scrollTo(0,$(window).height());
			}
			clearTimeout(time);
		}
	});

});

//----------------------------------------------------------------------------------------------------------------------------------------------------------
	// var sessionId = localStorage.getItem('myCookieName');
 // 		console.log(localStorage);

	// if (!sessionId) {
	// 	    //sessionId = uuid.v4();
	// 	    //localStorage.setItem('myCookieName', sessionId);
	// 		console.log('no session id found');
	// 	}
		 
	// 	$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
		 
	// 	    // if there is data being sent
	// 	    // add the sessionId to it
	// 	    if (options.data) {
	// 	        options.data += '&sessionId=' + sessionId;
	// 	    }
		 
	// 	    // if there is no data being sent
	// 	    // create the data and add the sessionId
	// 	    else {
	// 	        options.data = 'sessionId=' + sessionId;
	// 	    }
		 
	// 	});
	// 	$.ajax({
			
	// 		type: 'GET',

	// 	  // The URL to make the request to.
	// 		url: 'http://10.10.51.99:3000/otp',

	// 	  // The 'contentType' property sets the 'Content-Type' header.
	// 	  // The JQuery default for this property is
	// 	  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
	// 	  // a preflight. If you set this value to anything other than
	// 	  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
	// 	  // you will trigger a preflight request.
	// 	  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

	// 	  xhrFields: {
	// 	    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
	// 	    // This can be used to set the 'withCredentials' property.
	// 	    // Set the value to 'true' if you'd like to pass cookies to the server.
	// 	    // If this is enabled, your server must respond with the header
	// 	    // 'Access-Control-Allow-Credentials: true'.
	// 	    //withCredentials: false
	// 	  },

	// 	  headers: {
	// 	    // Set any custom headers here.
	// 	    // If you set any non-simple headers, your server must include these
	// 	    // headers in the 'Access-Control-Allow-Headers' response header.
	// 	  },

	// 	  success: function(xhr) {
	// 	 	console.log("status code now is: "+jqXHR.status+" and ready state is "+jqXHR.readyState);
	// 	    // Here's where you handle a successful response.
	// 		console.log("it worked");
	// 	  },

	// 	  error: function(err) {
	// 	    // Here's where you handle an error response.
	// 	    // Note that if the error was due to a CORS issue,
	// 	    // this function will still fire, but there won't be any additional
	// 	    // information about the error.
	// 	    alert('An error occurred'+err);
	// 	  }
	// 	});
//----------------------------------------------------------------------------------------------------------------------------------------------------------

//}