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
		var url = 'https://indiafasteners.com/sendOtp?mobile=91'+credentials.mobile+"";
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
				if(text.redirect==='newPassword'){
					// $("#register").removeClass('running');
					window.location.href='./setNewPassword.html';
				}
				else{
					//$("#register").removeClass('running');
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

$(document).on("pageinit",function(event){
	console.log("pageinit occurred");
	console.log("document is ready now");
	var credentials=JSON.parse(localStorage.getItem('credentials'));
	if(!credentials.otpVerified)
	{
		console.log('unverified user');
		window.location.href='./otp.html'
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
		}
	});

});