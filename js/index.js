// JavaScript Document
function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}

function fnLoad(){
	var iTime = new Date().getTime();
	var oW = id('welcome');
	/*var arr=[
		'https://i01.pictn.sogoucdn.com/415d9981143db5cc',
		'https://i02.pictn.sogoucdn.com/0ac4e19e9bd17eed',
		'https://i02.pictn.sogoucdn.com/7fc05ae993f7dc3c',
		'https://i04.pictn.sogoucdn.com/ee232bb85be15a71',
		'https://i03.pictn.sogoucdn.com/0abc23ae1fcce17c',
		'https://i01.pictn.sogoucdn.com/415d9981143db5cc',
		'https://i02.pictn.sogoucdn.com/0ac4e19e9bd17eed',
		'https://i02.pictn.sogoucdn.com/7fc05ae993f7dc3c',
		'https://i04.pictn.sogoucdn.com/ee232bb85be15a71',
		'https://i03.pictn.sogoucdn.com/0abc23ae1fcce17c'
		];*/
	var oImgLoad = false;
	var oTime = false;
	var oTimer = 0;
	var oImg = new Image();
	var num = 0;
/*
	xunlei();*/

	bind(oW,'webkitTransitionEnd',fn);
	bind(oW,'transitionEnd',fn);

	oTimer = setInterval(function(){
		if (new Date().getTime()-iTime>5000) {
			oTime = true;
		}
		if (oImgLoad&&oTime) {
			oW.style.opacity = 0;
			clearInterval(oTimer);
		}

	},1000)

	function fn() {
		removeClass(oW,'pageshow');
		fnTab();
		score();
	}
/*
	function xunlei(){
		oImg.src = arr[num];
		oImg.onload = function(){
			num++;
			if (num<arr.length) {
				document.title = num+1+'/'+arr.length;
				xunlei()
			}else{
				oImgLoad = true
			}	
		}
	}*/

}

function fnTab(){
	var oTab = id('tabPic');
	var oPic = id('picList');
	var oNav = oTab.getElementsByTagName('nav')[0].children;
	var iNow = 0;
	var iPast = 0;
	var iw = view().w;
	var iX = 0;
	var oTimer = null;
	var startX = 0;
	bind(oPic,'touchstart',start);
	bind(oPic,'touchmove',move);
	bind(oPic,'touchend',end);

	oPic.style.transition = '1s linear';
	oPic.style.webkitTransition = '1s linear';
	auto();

	function auto(){
		oTimer = setInterval(function(){
			iNow++;
			iNow = iNow%oNav.length;
			tab()
			navs()
		},2000)
	}

	function tab(){
		iX = -iNow*iw;
		oPic.style.transition = '1s linear';
		oPic.style.webkitTransition = '1s linear';
		oPic.style.transform = 'translateX('+iX+'px)';
		oPic.style.webkitTransform = 'translateX('+iX+'px)';
	}

	function navs(){
		removeClass(oNav[iPast],'active');
		addClass(oNav[iNow],'active');
		iPast = iNow
	}
	function start(ev){
		clearInterval(oTimer);
		oPic.style.transition = oPic.style.webkitTransition = '0s';
		ev = ev.changedTouches[0];
		startX = ev.pageX;
	}
	function move(ev){
		var disX = ev.changedTouches[0].pageX - startX;
		oPic.style.transform = oPic.style.webkitTransform = 'translateX('+(iX+disX)+'px)';
		iNow = Math.round(Math.abs(iX+disX)/iw);
	}
	function end(ev){
		if (iNow==oNav.length) {
			iNow--;
		}
		if(iNow==-1){
			iNow=0;
		}
		tab();
		navs();
		auto();
	}
}

function score(){
	var oScore = id('scoreList');
	var aLi = oScore.getElementsByTagName('li');
	var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];

	for(var i=0;i<aLi.length;i++){
		fnScore(aLi[i])
	}

	function fnScore(obj){
		var oA = obj.getElementsByTagName('a');
		var oInput = obj.getElementsByTagName('input')[0];
		for (var i = 0; i < oA.length; i++) {
			oA[i].index = i;
			bind(oA[i],'touchstart',function(){
				oInput.value = arr[i];
				for (var i = 0; i < oA.length; i++){
					if (i<=this.index) {
						addClass(oA[i],'active')
					}else{
						removeClass(oA[i],'active')
					}
				}
			})
		}
	}
	submit();
}

function submit(){
	var oIndex = id('index');
	var oSubmit = id('submit');
	var oP = id('info');
	var btn = true;

	oSubmit.addEventListener('touchend',fnEnd,false);

	function fnEnd(){
		btn = check();
		if (!btn) {
			info(oP,'请给景区评分');
		}else{
			if (!isTag()) {
				info(oP,'请给景区添加标签');
			}else{
				indexOut()
			}
		}
	}
	function check(){
		var oScore = id('scoreList');
		var aInput = oScore.getElementsByTagName('input');

		for (var i = 0; i < aInput.length; i++) {
			if (aInput[i].value==0) {
				return false;
			}	
		}
		return true;
	}
	function isTag(){
		var oTag = id('tags');
		var aInput = oTag.getElementsByTagName('input');
		for (var i = 0; i < aInput.length; i++) {
			if (aInput[i].checked==true) {
				return true
			}
		}
		return false
	}

}

function indexOut(){
	var oMask = id('mask');
	var oIndex = id('index');
	var oNews = id('news');
	addClass(oMask,'pageshow');
	addClass(oNews,'pageshow');
	news();
	//解决none变为block，重新渲染，导致的transition失效的问题.
	setTimeout(function(){
		oMask.style.opacity = 1;
		oIndex.style.WebkitFilter=oIndex.style.filter='blur(5px)';
	},14)

	setTimeout(function(){
		oMask.style.opacity = 0;
		oNews.style.opacity = 1;
		oIndex.style.WebkitFilter=oIndex.style.filter='blur(0px)';
		removeClass(oMask,'pageshow');
	},4000)

}

function info(obj,info){
	obj.innerHTML = info;
	obj.style.webkitTransform = obj.style.transform = 'scale(1)';
	obj.style.opacity = 1;
	setTimeout(function(){
		obj.style.webkitTransform = obj.style.transform = 'scale(0)';
		obj.style.opacity = 0;
	},2000)

}

function news(){
	var oNews = id('news');
	var oP = id('info1');
	var aInput = oNews.getElementsByTagName('input');

	aInput[0].onchange = function(){
		if (this.files[0].type.split('/')[0]=='video') {
			newsOut();
			this.value = '';
		}else{
			info(oP,'请上传视频');
		}
	}
	aInput[1].onchange = function(){
		if (this.files[0].type.split('/')[0]=='image') {
			newsOut();
			this.value = '';
		}else{
			info(oP,'请上传图片');
		}
	}
}

function newsOut(){
	var oNews = id('news');
	var oForm = id('form');
	addClass(oForm,'pageshow');
	oNews.style.cssText = '';
	removeClass(oNews,'pageshow');
	formIn();	
}

function formIn(){
	var oForm = id('form');
	var over = id('over');
	var aTags = id('tags1').getElementsByTagName('label');
	var oBtn=oForm.getElementsByClassName("btn")[0];
	var btn = false;

	for (var i = 0; i < aTags.length; i++) {
		bind(aTags[i],'touchend',function(){
			btn = true;
			addClass(oBtn,'submit');
		})
	}

	bind(oBtn,'touchend',function(){
		if (btn) {
			for (var i = 0; i < aTags.length; i++) {
				aTags[i].getElementsByTagName('input')[0].style.checked = false;
			}
			btn = false;
			addClass(over,'pageshow');
			removeClass(oForm,'pageshow');
			removeClass(oBtn,"submit");
			fnOver();
		}
	})
}


function fnOver(){
	var over = id('over');
	var oBtn=over.getElementsByTagName('input')[0];

	bind(oBtn,'touchend',function(){
		removeClass(over,"pageshow");
	})
}



