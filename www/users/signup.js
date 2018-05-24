function checkConnection() {
    var networkState = navigator.connection.type;

    // var states = {};
    // states[Connection.UNKNOWN]  = 'Unknown connection';
    // states[Connection.ETHERNET] = 'Ethernet connection';
    // states[Connection.WIFI]     = 'WiFi connection';
    // states[Connection.CELL_2G]  = 'Cell 2G connection';
    // states[Connection.CELL_3G]  = 'Cell 3G connection';
    // states[Connection.CELL_4G]  = 'Cell 4G connection';
    // states[Connection.CELL]     = 'Cell generic connection';
    // states[Connection.NONE]     = 'No network connection';
 if(networkState=='none')
    	alert('You are offline!!');
}

window.setInterval(function(){
checkConnection();
},1000);

$("#login").on('vclick',function(){
	window.location.href='./login.html';
});
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
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	var referral=JSON.parse(localStorage.getItem('referral'));
	console.log('referral :'+referral);
	data.referralCode=referral.referralCode;
	data.referred=referral.referred;
	console.log('printing credentials'+data);
	// This is a sample server that supports CORS.
	var url = 'https://indiafasteners.com/signup?mobile=911';
	//var url='http://10.10.49.15:3000/signup?mobile=911';
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
			$("#notify").text(text.msg);
			$("#notify").show();
			console.log("inside status=0 case");
			$("#register").removeClass('running');
		}
		else{
			console.log("inside status!=0 case");
			console.log(text.userId);
			data.userId=text.userId;
			localStorage.setItem('credentials', JSON.stringify(data));
			window.location.href='./otp.html';
		}
	};

	xhr.onerror = function() {
		$("#register").removeClass('running');
		alert('Woops, there was an error making the request.');
		return false;
	};
	//xhr.withCredentials = true;
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify(data));
}

$(document).on("pageinit",function(event){

	// document.addEventListener("offline", onOffline, false);

	// function onOffline() {
	//     // Handle the offline event
	//     alert('You are offline!');
	// }
	
	$("#firstName").focus();
	var referral=localStorage.getItem('referral');
	if(!referral){
		referral={
			referred:0,
			referralCode:''
		}
		localStorage.setItem('referral',JSON.stringify(referral));
	}
	console.log("document is ready now");

	$("#register").on('vclick',function(event){
		$("#register").addClass('running');
		$("#notify").hide();
		$("#notify").text("");
		
		var time=setTimeout(nothing,1000);
		function nothing(){
			console.log('timeout time');
			console.log($("#register"));
		var regex=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		var firstName=$("#firstName").val().trim();
		var lastName=$("#lastName").val().trim();
		var companyName=$("#companyName").val().trim();
		var email=$("#email").val().trim();
		var mobile=$("#mobile").val().trim();
		var password=$("#password").val().trim();
		var confirmPassword=$("#confirmPassword").val().trim();
		console.log(firstName+" "+lastName+" "+email+" "+mobile+" "+password+" "+confirmPassword);
		//----------------------------------------verification begins here-------------------------------------------------------------
		if((firstName==="")||(lastName==="")||(email==="")||(mobile.length!=10)||(password.length<8))
		{
			$("#notify").text("Please fill all fields properly!");
			$("#notify").show();
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
			//event.preventDefault();
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
		else if(/[^A-Z]/i.test(firstName))
		{
			if(firstName.match(/ /g))
			{
				$("#notify").text("Spaces not allowed in First Name!");
				$("#notify").show();
			}
			else{
				$("#notify").text("Only Letters allowed in First Name!");
				$("#notify").show();	
			}
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');	
			//event.preventDefault();
		}
		else if(/[^A-Z]/i.test(lastName))
		{
			if(lastName.match(/ /g))
			{
				$("#notify").text("Spaces not allowed in Last Name!");
				$("#notify").show();
			}
			else{
				$("#notify").text("Only Letters allowed in Last Name!");
				$("#notify").show();	
			}
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
			//event.preventDefault();
		}
		else if(/[^0-9]/.test(mobile))
		{
			$("#notify").text("Invalid Mobile No.");
			$("#notify").show();
			$("#mobile").val("");
			$("#mobile").focus();
			window.scrollTo(0,$(window).height());
    		//event.preventDefault();
    		$("#register").removeClass('running');
		}
		else if(!(regex.test(email))){
			$("#notify").text("Invalid email address");
			$("#notify").show();
			$("#email").val("");
			$("#email").focus();	
			window.scrollTo(0,$(window).height());
			//event.preventDefault();
			$("#register").removeClass('running');
		}
		else{
			var credentials={email:email,
			 	firstName:firstName,
			 	lastName:lastName,
				company_name:companyName,
		 		code:"91",
		 		mobile:mobile,
		 		passwordRetype:confirmPassword,
		 		role:'vendor',
		 		password:password
		};
		makeCorsRequest(credentials);
		window.scrollTo(0,$(window).height());
		}
			clearTimeout(time);
		}
		
		// $.ajax({
			
		// 	type: 'POST',

		//   // The URL to make the request to.
		// 	url: 'http://10.10.51.99:3000/signup',
		// 	data:credentials,

		//   // The 'contentType' property sets the 'Content-Type' header.
		//   // The JQuery default for this property is
		//   // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
		//   // a preflight. If you set this value to anything other than
		//   // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
		//   // you will trigger a preflight request.
		//   contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

		//   xhrFields: {
		//     // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
		//     // This can be used to set the 'withCredentials' property.
		//     // Set the value to 'true' if you'd like to pass cookies to the server.
		//     // If this is enabled, your server must respond with the header
		//     // 'Access-Control-Allow-Credentials: true'.
		//     //withCredentials: false
		//   },

		//   headers: {
		//     // Set any custom headers here.
		//     // If you set any non-simple headers, your server must include these
		//     // headers in the 'Access-Control-Allow-Headers' response header.
		//   },

		//   success: function(text) {
		//     // Here's where you handle a successful response.
		//   	//var text = JSON.parse(xhr);
		// 	console.log(text);
		// 	if(text.status==='0'){
		// 		$("#notify").text(text.msg);
		// 		$("#notify").show();
		// 		console.log("inside status=0 case");
		// 	}
		// 	else{
		// 		console.log("inside status!=0 case");
		// 		window.location.href='./otp.html';
		// 	}
		//   },

		//   error: function(err) {
		//     // Here's where you handle an error response.
		//     // Note that if the error was due to a CORS issue,
		//     // this function will still fire, but there won't be any additional
		//     // information about the error.
		//     alert('An error occurred'+err);
		//   }
		// });
		
		//$("#register1").hide();
		//$("#register2").show();
		//event.preventDefault();
		// Create the XHR object.
		
			// $.post("http://indiafasteners.com/signup",credentials,function(body){
			// 	if(body.status==='0')
			// 	{
			// 		//$("#myModal").modal('hide');
			// 		window.scrollTo(0, 0);
			// 		$("#notify").text(body.msg);
			// 		$("#notify").show();
			// 		$("#email").val("");
			// 		$("#mobile").val("");
			// 		$("#email").focus();
			// 		}
			// 	else {
			// 		//$("#myModal").modal('hide');
			// 		window.location.href="./otp.html";
			// 	}
			// });
				
	});

	// $("#register").on('vclick',function(e){
	// 	var regex=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	// 	var firstName=$("#firstName").val().trim();
	// 	var lastName=$("#lastName").val().trim();
	// 	var companyName=$("#companyName").val().trim();
	// 	var email=$("#email").val().trim();
	// 	var mobile=$("#mobile").val().trim();
	// 	var password=$("#password").val().trim();
	// 	var confirmPassword=$("#confirmPassword").val().trim();
	// 	console.log(firstName+" "+lastName+" "+email+" "+mobile+" "+password+" "+confirmPassword);
	// 	//----------------------------------------verification begins here-------------------------------------------------------------
	// 	if((firstName==="")||(lastName==="")||(email==="")||(mobile==="")||(password===""))
	// 	{
	// 		$("#notify").text("Please fill all fields properly!");
	// 		$("#notify").show();
	// 	}
	// 	else if(password!=confirmPassword)
	// 	{
			
	// 		$("#notify").text("Passwords do not match!");
	// 		$("#notify").show();
	// 		$("#confirmPassword").val("");
	// 		$("#password").val("");
	// 		$("#password").focus();
	// 	}
	// 	else if(/[^A-Z]/i.test(firstName))
	// 	{
	// 		if(firstName.match(/ /g))
	// 		{
	// 			$("#notify").text("Spaces not allowed in First Name!");
	// 			$("#notify").show();
	// 		}
	// 		else{
	// 			$("#notify").text("Only Letters allowed in First Name!");
	// 			$("#notify").show();	
	// 		}	
	// 	}
	// 	else if(/[^A-Z]/i.test(lastName))
	// 	{
	// 		if(lastName.match(/ /g))
	// 		{
	// 			$("#notify").text("Spaces not allowed in Last Name!");
	// 			$("#notify").show();
	// 		}
	// 		else{
	// 			$("#notify").append("Only Letters allowed in Last Name!");
	// 			$("#notify").show();	
	// 		}	
	// 	}
	// 	else if(/[^0-9]/.test(mobile))
	// 	{
	// 		$("#notify").append("Invalid Mobile No.");
	// 		$("#notify").show();
	// 		$("#mobile").val("");
	// 		$("#mobile").focus();
	// 	}
	// 	else if(!(regex.test(email))){
	// 		$("#notify").append("Invalid email address");
	// 		$("#notify").show();
	// 		$("#email").val("");
	// 		$("#email").focus();	
	// 	}
	// 	else{
	// 		var credentials={email:email,
	// 				firstName:firstName,
	// 				lastName:lastName,
	// 				company_name:companyName,
	// 				code:"91",
	// 				mobile:mobile,
	// 				passwordRetype:confirmPassword,
	// 				role:'vendor',
	// 				password:password
	// 		};	
	// 		$.post("http://indiafasteners.com/signup",credentials,function(body){
	// 			if(body.status==='0')
	// 			{
	// 				//$("#myModal").modal('hide');
	// 				window.scrollTo(0, 0);
	// 				$("#notify").text(body.msg);
	// 				$("#notify").show();
	// 				$("#email").val("");
	// 				$("#mobile").val("");
	// 				$("#email").focus();
	// 				}
	// 			else {
	// 				//$("#myModal").modal('hide');
	// 				window.location.href="./otp.html";
	// 			}
	// 		});
	// 	}		
	// });
});