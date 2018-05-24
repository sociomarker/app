/*
==============================================================
Template Details
==============================================================
Template Title  	:   Classified
Author Name		    :   Kathan Shah
Author Link			:   https://themeforest.net/user/kathan-shah
Author facebook 	:   https://www.facebook.com/kathan.n.shah

==============================================================
Table of Content for Javascript
==============================================================
01 Drawer menu
02 Img slider
03 open popup
04 close popup
05 Clear form control (search page)
06 Initialize Lazy load
07 Notification
08 Preloader
09 Horizontal menu
10 Toast
11 To Top Button
12 Page on scroll
==============================================================
*/

"use strict";
/* --- Drawer menu --- */
var $drawerOverlay = $(".drawer.overlay");
$(".menu-toggle").on("click",function(e){
	var $target = $($(this).attr("href"));
	if ($target.length){
		$target.toggleClass("opened");
		$drawerOverlay.toggleClass("opened");
		$drawerOverlay.attr("data-reff",$(this).attr("href"));
	}
	e.preventDefault();
});
$drawerOverlay.on("click",function(e){
	var $target = $($(this).attr("data-reff"));
	if ($target.length){
		$target.removeClass("opened");
		$(this).removeClass("opened");
	}
	e.preventDefault();
});

/* --- Img Slider --- */
$(".img-slider").owlCarousel({
	lazyLoad:true,
	loop:true,
    margin:10,
    responsiveClass:true,
    merge:true,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:2,
        },
        1000:{
            items:3,
        }
    }
});

/* --- open popup --- */
$(".openit").on("click",function(){
	var $id = $(this).attr("data-open");
	if ($id){
		$($id).addClass("pop");
	}
});

/* --- close popup --- */
$(".closeit").on("click",function(){
	var $id = $(this).attr("data-close");
	if ($id){
		$($id).removeClass("pop");
	}
});

/* --- Clear form control --- */
$(".form-group span.clear").on("click",function(){
	var e = $.Event("keyup");
	var letterToUse = "";
	e.which=e.keyCode=letterToUse.charCodeAt();
	$(this).parent().find(".form-control").val(letterToUse).trigger(e);
});

/* --- Initialize Lazy load --- */
$(function() {
    $("img.lazy").lazyload({
    	effect : "fadeIn",
    });
});

/* ---- Notification ---- */
var timeOut='';
jQuery.fn.extend({
  notify: function(delay) {
		var node=$(this);
		var height=node.css("height");
		node.css("height","0px");
		$(".notification").css("display","none");
		node.css("display","block");
		node.animate({
			"height":height,
		},200);
		clearTimeout(timeOut);
		if (!isNaN(delay)){
			timeOut=setTimeout(function(){
				node.animate({
					"height":"0px"
				},200,function(){
					node.css("display","none");
					node.css("height",height);
				});
			},delay);
		}
		
		event.preventDefault();
		return false;
  },
  unnotify: function() {
		var node=$(this).parent().parent();
		var height=node.css("height");
		node.animate({
			"height":"0px"
		},200,function(){
			node.css("display","none");
			node.css("height",height);
		});
		event.preventDefault();
		return false;
  }
});


$(".notification-close").on("click",function(){
	clearTimeout(timeOut);
	var node=$(this).parent().parent();
	var height=node.css("height");
	node.animate({
		"height":"0px"
	},200,function(){
		node.css("display","none");
		node.css("height",height);
	});
});


var $parallaxBanner = $(".parallax-banner");
var $parallaxScroller = $(".parallax-scroller");
var $catHeader = $("#cat-header");
var $body = $("body");

/* ---- Preloader ---- */
$(window).on("load",function(){
    $(".cat-loading").fadeOut();

    /* ---- Horizontal menu ---- */
	if ($(".horizontal-scroll").length){
		setTimeout(function(){
			$(".horizontal-scroll").owlCarousel({
				autoWidth:true,
				margin:10,
				lazyload:true
			});
			$(".horizontal-scroll .owl-stage").css("width",$(".horizontal-scroll .owl-stage").width()+1);
		},1);
	}

	parallaxBanner();
});

function parallaxBanner(){
	if ($parallaxBanner.length){
    	var mtop = $parallaxBanner.height();
    	$parallaxScroller.css("margin-top",mtop+"px");
    }
}

/* ---- Toast ---- */
function toast(msg,delay,color){
	var color=(color===undefined ? "rgba(0,0,0,0.7);" : color);
	$("body").find("div.toast").remove();
	$("body").append('<div class="toast" style="display:none"><span class="toast-label" style="background-color:'+color+'">'+msg+'</span></div>');
	setTimeout(function(){
		$("body").find("div.toast").fadeIn("slow");

		if (!isNaN(delay)){
			setTimeout(function(){
				var node=$("body").find('div.toast');
				node.fadeOut("slow",function(){
					node.remove();
				});
			},delay)
		}
	},100);
}

$(".cat-toast").on("click",function(){
	var msg = $(this).attr("data-toast");
	var color = $(this).attr("data-color");
	var delay = $(this).attr("data-delay");

	color=(color===undefined ? undefined : color);
	delay=(delay===undefined ? 1000 : delay);

	if (msg){
		toast(msg,delay,color);
	}
});

/* ---- To Top Button ---- */
$('.totop').on("click",function() {
    $("body,html").animate({
        scrollTop:0
    }, 500);
    return false;
});

/* --- page scroll --- */
$(window).on("scroll",function(){
    var sp = $(this).scrollTop();
    if ($parallaxBanner.length){
    	$parallaxBanner.css("transform","translateY(-"+sp/1.8+"px)");
    }
    if (sp>=150)
        $(".totop").addClass("makevisible");
    else
        $(".totop").removeClass("makevisible");   
});

$(window).on("resize",function(){
	parallaxBanner();
});