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


// var d=new Date();
// var referenceTime=d.getSeconds();
// if((d.getSeconds()-referenceTime)%10===0){
// 	checkConnection();
// 	referenceTime=d.getSeconds();
// }

$("#signup").on('vclick',function(){
	window.location.href='./signup.html';
});

$("#forgotPassword").on('vclick',function(){
	window.location.href='./forgotPassword.html';
});

$("#skipLogin").on('click',function(){
	window.location.href='./std.html';
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
	// This is a sample server that supports CORS.
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	var referral=JSON.parse(localStorage.getItem('referral'));
	console.log(referral);
	console.log(credentials);
	var mobile,existance;
	if(!credentials){
		mobile='911';
		existance=false;
	}
	else if(credentials.email!=data.email) {
		mobile='911';
		existance=false;
	}
	else{
		mobile=credentials.mobile;
		existance=true;
	}

	var url = 'https://indiafasteners.com/login?mobile='+mobile+"";
	//var url = 'http://192.168.43.31:3000/login?mobile='+mobile+"";
	console.log('url being sent : ',url);
	var xhr = createCORSRequest('POST', url);
	if (!xhr) {
	    alert('CORS not supported');
	    return;
	}
//Response handling ---------------------------------------------------------------------------------------------------------
// Response handlers.--------------------------------------------------------------------------------------------------------
	xhr.onload = function() {
		var credentials2;
		console.log(xhr.responseText);
		var text = JSON.parse(xhr.responseText);
		console.log(text);
		if(text.status==='1e' && !existance){
			credentials2={
				email:data.email,
				authenticated:text.authenticated,
				otpVerified:text.otpVerified,
				image_url:text.image_url,
				addedBy:text.addedBy
			};
			localStorage.setItem('credentials',JSON.stringify(credentials2));
		}
		if(text.status==='1' && !existance){
			credentials2={
				firstName:text.firstName,
				lastName:text.lastName,
				email:text.email,
				mobile:text.mobile,
				userId:text.userId,
				authenticated:text.authenticated,
				otpVerified:text.otpVerified,
				image_url:text.image_url,
				addedBy:text.addedBy
			};
			localStorage.setItem('credentials',JSON.stringify(credentials2));
		}
		if(existance){
			credentials.authenticated=text.authenticated;
			credentials.otpVerified=text.otpVerified;
			credentials.image_url=text.image_url;
			credentials.addedBy=text.addedBy;
			localStorage.setItem('credentials',JSON.stringify(credentials));
		}

		if(text.status==='0'){
			$("#notify").text(text.msg);
			$("#notify").show();
			console.log("inside status=0 case");
			$("#register").removeClass('running');
		}
		else{
			if(text.redirect==='/profile_update'){
				window.location.href='./profile.html';
				localStorage.setItem('loggedIn',true);
			}
			else if(text.redirect==='/otp'){
				alert('You need to verify your phone number');
				window.location.href='./otp.html';
			}
			else{
				alert('You may reset your password');
				//window.location.href='./resetPassword.html';
			}
			console.log("inside status!=0 case");
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
	//document.addEventListener("offline", onOffline, false);


	if(localStorage.getItem('loggedIn')){
		window.location.href='./profile.html';
	}
	console.log("document is ready now");

	$("#register").on('vclick',function(event){
		$("#register").addClass('running');
		$("#notify").hide();
		$("#notify").text("");
		$("#firstName").focus();
		var time=setTimeout(nothing,1000);
		function nothing(){
		var regex=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		var email=$("#email").val().trim();
		var password=$("#password").val().trim();
		console.log(email+" "+password+" ");
		//----------------------------------------verification begins here-------------------------------------------------------------
		if((email==="")||(password===""))
		{
			$("#notify").text("Please fill all fields properly!");
			$("#notify").show();
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
		}
		
		else if(!(regex.test(email))){
			$("#notify").text("Invalid email address");
			$("#notify").show();
			$("#email").val("");
			$("#email").focus();	
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
		}
		else if(password.length<8){
			$("#notify").text("Invalid email address");
			$("#notify").show();
			$("#password").val("");
			$("#password").focus();	
			window.scrollTo(0,$(window).height());
			$("#register").removeClass('running');
		}
		else{
			var credentials={email:email,
		 		password:password
		};
		makeCorsRequest(credentials);
		window.scrollTo(0,$(window).height());
		}
			clearTimeout(time);
		}			
	});

});