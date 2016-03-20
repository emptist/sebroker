var movx;
function showopen(w,maxh){
	clearInterval(movx);
	var obj=magicjs("op"+w);
	var objh=parseInt(obj.offsetHeight);
	if (objh==0){
		
	}else{
		maxh=0;
		
	}
	movx=setInterval(mov,5);
	function mov(){
	var objh=parseInt(obj.offsetHeight);
	var v=(maxh<objh)?Math.floor((maxh-objh)/4):Math.ceil((maxh-objh)/4); //算出每次运动量
		obj.style.height=objh+v+"px";
		if(v==0){clearInterval(movx);}
	}
}
(function(){
//-------------------------------------小功能集合
window.Fun=
{
	ie:/*@cc_on!@*/false,//是否为IE
	props:{"class":"className"},
	toarr:function(ul){var ar=[];for(var i=0,n=ul.length;i<n;i++){ar[i]=ul[i];}return ar;},//转为数组
	copy:function(o,ul){if(o._ex){return o;}else{for(var n in ul){o[n]=ul[n];}o._ex=true;return o;}},//扩展属性
	xcopy:function(o,ul){for(var n in ul){reg(n);}function reg(n){o[n]=function(){var c=Fun.toarr(arguments);return ul[n].apply(c.shift(),c);};}}//拷贝属性并将第一个参数作为新属性的this
}
//window.ie=Fun.ie;
//window.magicjsA=Fun.toarr;
window.magicjs=function(id,tag)
{
	var re=id&&typeof id!="string"?id:document.getElementById(id)||document;
	if(!tag){return Fun.copy(re,Element);}else{return Dom.find(re,tag);}
}
Element=
{
	find:function(tag)//查找属性集合[标签及约束 (如：li[bb>li]  *[class=bbb]  *[src=a.jpg] li[src=a.jpg]) ]
	{
		var m=/(.+)\[(\w*)(\W+)(.*)\]/.exec(tag);
		if(!m){var re=this.getElementsByTagName(tag);for(var i=0,n=re.length;i<n;i++){Fun.copy(re[i],Element);};return re;}
		else
		{
			var arr=[],re=this.getElementsByTagName(m[1]==""?"*":m[1]);
			if(Fun.ie&&Fun.props[m[2]]){m[2]=Fun.props[m[2]];}
			for(var i=0,n=re.length;i<n;i++)
			{if(m[3]==">"&&re[i].parentNode.id==m[2]||m[3]=="="&&re[i].getAttribute(m[2])==m[4]||m[3]=="!="&&re[i].getAttribute(m[2])!=m[4]){arr.push(Fun.copy(re[i],Element));}}
			m=null;return arr;
		}
	},
	attr:function(key,v){if(Fun.ie&&Fun.props[key]){key=Fun.props[key];}if(v){this.setAttribute(key,v);}else{return this.getAttribute(key);}},//获取或设置节点属性
	w:function(v){if(v){this.style.width=v+"px";}else{return this.offsetWidth||this.body.offsetWidth||0;}},	//获取或设置节点宽
	h:function(v){if(v){this.style.height=v+"px";}else{return this.offsetHeight||this.body.offsetHeight||0;}},	//获取或设置节点高
	t:function(v){if(v){this.style.top=v+"px";}else{return this.offsetTop||(this.documentElement.scrollTop||this.body.scrollTop||0);}},	//设置或返回上边距
	l:function(v){if(v){this.style.left=v+"px";}else{return this.offsetLeft||(this.documentElement.scrollLeft||this.body.scrollLeft||0);}},	//设置或返回左边距
	v:function(v){if(v){this.innerHTML?this.innerHTML=v:this.value=v;}else{return this.innerHTML||this.value||"";};},	//设置或返回值
	op:function(v){if(Fun.ie){this.filters.alpha.opacity=v;}else{this.style.opacity=(v/100);}}	//设置层的透明度
}
//页面功能，无法针对节点来执行的
window.Dom=Dom=
{	
	addEvent:function(o,s,fun){o.attachEvent?o.attachEvent("on"+s,fun):o.addEventListener(s,fun,false);}, //创建事件
	delEvent:function (o,s,fun){o.detachEvent?o.detachEvent('on'+s,fun):o.removeEventListener(s,fun,false);}, //删除事件
	addDom:function(node,tag,first){var o=node.createElement(tag);first?node.insertBefore(o,node.firstChild):node.appendChild(o);return o;},//创建子节点[节点，要创建的TAG，插入位置]
	delDom:function(node,obj){node.removeChild(obj);},//删除子节点[父节点，要删除节点]
	addImg:function(url){var img=new Image();img.src=url;return img;},//创建缓存图片[图片地址]
	winh:function(){return Math.min(document.documentElement.clientHeight,document.body.clientHeight);},//返回浏览器可用高
	mouseX:function(event){return (event.pageX || (event.clientX +l(document)));},//返回鼠标的X座标
	mouseY:function(event){return (event.pageY || (event.clientY +t(document)));}//返回鼠标的Y座标
}
Fun.xcopy(Dom,Element);

})();




window.Effect=
{
	//隔行样式[对象名称,子标签名,隔行的样式,步长(要大于2)]
	SwitchCss:function(id,tag,cName,sp){var c=magicjs(id,tag);sp=sp||2;for(var i=0,n=c.length;i<n;i+=sp){c[i].className=cName;}},
	//选项卡[标题框子元素("id/li/_"),内容框子元素("id/li/_"),事件(mouseover/click),默认显示第几条(-1表示在鼠标移出全部隐藏,仅在事件mouseover有效),轮播时间(1秒=1000)]
	SwitchTag:function(tit,box,s,show,time)
	{
		var t=tit.split('/'),b=box.split("/"),ts=magicjs(t[0],t[1]),bs=magicjs(b[0],b[1]),s=s||"onmouseover",now=show=show||0,c;
		for(var i=0,n=ts.length;i<n;i++){ts[i].old=ts[i].className.replace("show","");bs[i].old=bs[i].className.replace("show","");reg(i);}
		init();if(show!=-1&&time){go();}function init(){for(var i=0,n=ts.length;i<n;i++)
		{ts[i].className=ts[i].old;bs[i].className=bs[i].old;}if(now!=-1){ts[now].className+=(t[2]||"")+" show";bs[now].className+=(b[2]||"")+" show";}}
		function reg(i){ts[i][s]=function(){clearInterval(c);now=i;init();};if(show!=-1&&time){bs[i].onmouseover=function(){clearInterval(c);};bs[i].onmouseout=function(){go();};}
		if(show==-1&&s=="onmouseover"){ts[i].onmouseout=function(){now=-1;init();};}}function go(){c=setInterval(function(){(now<ts.length-1)?now++:now=0;init();},time);}
	},
	//事件样式切换[对像名称,子标签,移上时的标记样式,默认选中,点击后的标记样式,轮播支持]
	SwitchSeal:function(id,tag,cName,show,clickName,time)
	{
		var c=magicjs(id,tag),now=(show!=-1)?show:0,o;for(var i=0;i<c.length;i++){c[i].old=c[i].className.replace(cName,"");c[i].seal=false;reg(i);}
		if(show!=-1){init();c[now].className=cName;if(time){go();}}
		function reg(i){if(show!=-1){c[i].onmouseover=function(){clearInterval(o);now=i;init();this.className=this.seal?clickName:cName;};if(time){c[i].onmouseout=function(){go();}}}
		else{c[i].onmouseover=function(){now=i;this.className=this.seal?clickName:cName;};c[i].onmouseout=function(){this.className=this.seal?clickName:this.old;};}
		if(clickName){c[i].onclick=function(){this.seal=!this.seal;this.className=this.seal?clickName:this.old;}}}
		function init(){for(var i=0,n=c.length;i<n;i++){c[i].className=c[i].seal?clickName:c[i].old;}}
		function go(){o=setInterval(function(){(now<c.length-1)?now++:now=0;init();c[now].className=c[now].seal?clickName:cName;},time);}
	},
	//焦点滚动图[切换时间,数据集合,大图及链接id,切换的效果,小图及链接ID,文字说明及链接ID]
	FocusImg:function(time,foc,fbimg,show,fsimg,ftext)
	{
		var au=magicjs(foc,"a"),bimgs=magicjs(foc,"img[alt!=simg]"),ba=magicjs(fbimg,"dt")[0].find("a")[0],now=1,tm,len=au.length;
		ba.appendChild(Dom.addImg(bimgs[0].src));ba.href=au[0].href;var bi=ba.find("img")[0];bi.alt=bimgs[0].alt;
		var fi=["progid:DXImageTransform.Microsoft.Fade()","progid:DXImageTransform.Microsoft.Wipe(GradientSize=1.0,motion=forward)",
		"progid:DXImageTransform.Microsoft.RandomDissolve(enable=true)","progid:DXImageTransform.Microsoft.Slide(bands=1,SlideStyle=swap)",
		"progid:DXImageTransform.Microsoft.RandomBars(orientation=vertical)","progid:DXImageTransform.Microsoft.Slide(slidestyle=push,bands=1)"];
		var bp=magicjs(fbimg,"dd")[0].find("ul")[0];for(var i=0;i<len;i++){bp.innerHTML+="<li>"+(i+1)+"</li>";}
		var bps=bp.find("li");bps[0].className="show";function pfn(i){bps[i].onclick=function(){go(i);}};for(var i=0;i<len;i++){pfn(i);}
		if(fsimg){var simgs=magicjs(foc,"img[alt=simg]"),simg=magicjs(fsimg);for(var i=0;i<len;i++){simg.innerHTML+="<dl><dt><img src="+simgs[i].src+" /></dt><dd>"+au[i].title+"</dd></dl>";}
		var sx=magicjs(simg,"dl");sx[0].className="show";function sfn(i){sx[i].onclick=function(){go(i);}};for(var i=0;i<len;i++){sfn(i);}}
		if(ftext){var fte=magicjs(ftext);fte.innerHTML="<dt><a href="+au[0].href+">"+bimgs[0].alt+"</a></dt><dd>"+au[0].title+"</dd>";}
		function xunhuan(){if(Fun.ie){bi.style.filter=fi[show];bi.filters[0].Apply();bi.filters[0].Play(duration=1);}
		ba.href=au[now].href;bi.src=bimgs[now].src;bi.alt=bimgs[now].alt;for(var i=0;i<len;i++){bps[i].className="";}bps[now].className="show";
		if(fsimg){for(var i=0;i<len;i++){sx[i].className="";}sx[now].className="show";}
		if(ftext){magicjs(ftext).innerHTML="<dt><a href="+au[now].href+">"+bimgs[now].alt+"</a></dt><dd>"+au[now].title+"</dd>";}(now<len-1)?now++:now=0;}
		function init(){tm=setInterval(xunhuan,time);}function go(n){clearInterval(tm);now=n;xunhuan();init();}init();
	},
	//滚动/切屏效果，[id,子容器/孙容器,方向,速度,上按钮,下按钮,分页切换时间,每次切屏的条数]
	HtmlMove:function(id,tag,path,rate,upbt,downbt,pgtime,lis)
	{
		var c,mous=false,fg=tag.split('/'),o=magicjs(id),as=o.find(fg[1]),fx=(path=="scrollRight"||path=="scrollLeft")?"scrollLeft":"scrollTop",ow=fx=="scrollTop"?as[0].h():as[0].w();
		o.onmouseover=function(){mous=true;};o.onmouseout=function(){mous=false;}
		if(pgtime==null)
		{
			var mx=ow*as.length,mi=0,oldra=rate,os=o.find(fg[0])[0];os.innerHTML+=os.innerHTML;
			if(upbt){magicjs(upbt).onmousedown=function(){down();rate+=3;};magicjs(upbt).onmouseup=function(){rate=oldra;};}
			if(downbt){magicjs(downbt).onmousedown=function(){up();rate+=3;};magicjs(downbt).onmouseup=function(){rate=oldra;};}
			function up(){clearInterval(c);c=setInterval(function(){if(mous){return;}(o[fx]-rate>0)?(o[fx]-=rate):(o[fx]=mx);},30);}
			function down(){clearInterval(c);c=setInterval(function(){if(mous){return;}(o[fx]+rate<mx)?(o[fx]+=rate):(o[fx]=0);},30);}
			if(path=="scrollTop"||path=="scrollLeft"){down();}else{up();}
		}
		else
		{
			var pw=fx=="scrollTop"?o.h():o.w(),pgli=lis||Math.floor((pw+ow/2)/ow),pg=Math.floor((as.length+(pgli-1))/pgli),pgmx=ow*pgli,now=0,mx,d;
			var os=o.find(fg[0])[0];os.innerHTML+=os.innerHTML;d=setInterval(function(){go_to((path=="scrollTop"||path=="scrollLeft")?true:false);},pgtime);
			if(upbt){magicjs(upbt).onmousedown=function(){clearInterval(d);go_to(true);d=setInterval(function(){go_to(true);},pgtime);}}
			if(downbt){magicjs(downbt).onmousedown=function(){clearInterval(d);go_to(false);d=setInterval(function(){go_to(false);},pgtime);}}
			if(fg[2]){var pf=o.find(fg[2])[0];};function pfs(vs){if(fg[2]){pf.style.display="block";pf.style.left=vs+"px";}};function pfscl(){if(fg[2]){pf.style.display="none";}}
			function go_to(fxs)
			{
				if(mous){return;};var ex;
				if(fxs){if(now<pg){now++;}else{now=1;o[fx]=0;}pfs((now-1)*pgmx);mx=now*pgmx;ex=setInterval(function(){(o[fx]+rate<mx)?(o[fx]+=rate):o[fx]=mx;if(o[fx]==mx){clearInterval(ex);ex=null;pfscl();}},5);}
				else{if(now>0){now--;}else{now=pg-1;o[fx]=pg*pgmx;}pfs((now+1)*pgmx);mx=now*pgmx;ex=setInterval(function(){(o[fx]-rate>mx)?(o[fx]-=rate):o[fx]=mx;if(o[fx]==mx){clearInterval(ex);ex=null;pfscl();}},5);}
			}
		}
	},
	//滚动/切屏效果，[id,子容器/孙容器,方向,速度,上按钮,下按钮,分页切换时间,每次切屏的条数]
	xyMove:function(id,tag,path,rate,upbt,downbt,pgtime,lis)
	{
		var c,mous=false,fg=tag.split('/'),o=magicjs(id),as=o.find(fg[1]),fx=(path=="scrollRight"||path=="scrollLeft")?"scrollLeft":"scrollTop",ow=fx=="scrollTop"?as[0].h():as[0].w();
		o.onmouseover=function(){mous=true;};o.onmouseout=function(){mous=false;}
		if(pgtime==null)
		{
			var mx=ow*as.length,mi=0,oldra=rate,os=o.find(fg[0])[0];
			if(upbt){magicjs(upbt).onmousedown=function(){down();rate+=3;};magicjs(upbt).onmouseup=function(){rate=oldra;};}
			if(downbt){magicjs(downbt).onmousedown=function(){up();rate+=3;};magicjs(downbt).onmouseup=function(){rate=oldra;};}
			function up(){clearInterval(c);c=setInterval(function(){if(mous){return;}(o[fx]-rate>0)?(o[fx]-=rate):(o[fx]=mx);},30);}
			function down(){clearInterval(c);c=setInterval(function(){if(mous){return;}(o[fx]+rate<mx)?(o[fx]+=rate):(o[fx]=0);},30);}
			if(path=="scrollTop"||path=="scrollLeft"){down();}else{up();}
		}
		else
		{
			var pw=fx=="scrollTop"?o.h():o.w(),pgli=lis||Math.floor((pw+ow/2)/ow),pg=Math.floor((as.length+(pgli-1))/pgli),pgmx=ow*pgli,now=0,mx,d;
			var os=o.find(fg[0])[0];d=setInterval(function(){go_to((path=="scrollTop"||path=="scrollLeft")?true:false);},pgtime);
			if(upbt){magicjs(upbt).onmousedown=function(){clearInterval(d);go_to(true);d=setInterval(function(){go_to(true);},pgtime);}}
			if(downbt){magicjs(downbt).onmousedown=function(){clearInterval(d);go_to(false);d=setInterval(function(){go_to(false);},pgtime);}}
			if(fg[2]){var pf=o.find(fg[2])[0];};function pfs(vs){if(fg[2]){pf.style.display="block";pf.style.left=vs+"px";}};function pfscl(){if(fg[2]){pf.style.display="none";}}
			function go_to(fxs)
			{
				if(mous){return;};var ex;
				if(fxs){if(now<pg){now++;}else{now=1;o[fx]=0;}pfs((now-1)*pgmx);mx=now*pgmx;ex=setInterval(function(){(o[fx]+rate<mx)?(o[fx]+=rate):o[fx]=mx;if(o[fx]==mx){clearInterval(ex);ex=null;pfscl();}},5);}
				else{if(now>0){now--;}else{now=pg-1;o[fx]=pg*pgmx;}pfs((now+1)*pgmx);mx=now*pgmx;ex=setInterval(function(){(o[fx]-rate>mx)?(o[fx]-=rate):o[fx]=mx;if(o[fx]==mx){clearInterval(ex);ex=null;pfscl();}},5);}
			}
		}
	},
	//flash插入代码[flash地址,宽度,高度]
	Writeswf:function(url,w,h,id){
		document.write("<object id='"+id+"' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,24,0' width='"+w+"' height='"+h+"'><param name='movie' value='"+url+"'><param name='wmode' value='transparent'><param name='quality' value='high'><param name='menu' value='false'><embed width='"+w+"' height='"+h+"' src='"+url+"' id='"+id+"' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' wmode='transparent' type='application/x-shockwave-flash'></embed></object>");
	},

	//跟随鼠标移动[内容区ID，内容区单个对象，漂浮ID，y轴偏移量,x轴偏移量]
	Drift:function(id,tag,ctid,toppx,leftpx){
		//if(document.all){window.onerror=function(){return true;};}
		var obj=magicjs(id,tag);
		var objList=obj.length;
		for(var i=0;i<objList;i++){mDir(i);}

		function mDir(i){
			Dom.addEvent(obj[i],"mouseover",function(){
				magicjs(ctid).innerHTML=obj[i].getAttribute("texts");
			});
			Dom.addEvent(obj[i],"mouseout",function(){
				magicjs(ctid).style.display="none";
			});
			Dom.addEvent(obj[i],"mousemove",function(e){
				e= e || window.event; 
				magicjs(ctid).style.display="block";
				if(document.all){
				var x=event.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
				var y=event.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
				}else{var x=e.pageX;var y=e.pageY;}
				magicjs(ctid).style.top =y+toppx+'px'; 
				magicjs(ctid).style.left =x+leftpx+'px';
			});
		}
	},

	//缓冲：id，要设置的图片ID，节点移动速度，要移动到的目的支持：['width:100','height:100','left:100','top:100','opacity:100','scrollTop:100','scrollLeft:100']，移动完成后回调方法名不支持参数，可选
	//如果事件中有opacity属性：则页面样式中要定义：opacity:0.1;filter:alpha(opacity=10);
	SpaceTo:function(id,slot,mx,fun)
	{
		var o=magicjs(id),over=0,ar=Array(),len=mx.length,temp;
		for(var i=0;i<len;i++){ar[i]=mx[i].split(":");ar[i]=ar[i].concat(li(ar[i][0]));ar[i][1]=parseInt(ar[i][1]);ar[i][1]>ar[i][2]&&(ar[i][1]+=(slot-1));ar[i][5]=true;}
		clearInterval(window[id+"spaceTo"]);window[id+"spaceTo"]=setInterval(mov,10);
		function mov()
		{
			for(var i=0;i<len;i++)
			{
				if(ar[i][5])
				{
					ar[i][2]+=(temp=Math.floor((ar[i][1]-ar[i][2])/slot));
					ar[i][3][ar[i][0]]=ar[i][0]=='opacity' && !(/*@cc_on!@*/false)?ar[i][2]*0.01:ar[i][2]+ar[i][4];
					if(temp==0){ar[i][5]=false;over++;}
				}
			}
			if(over==len){clearInterval(window[id+"spaceTo"]);if(fun){fun();}}
		}
		//属性元素及初始值
		function li(name)
		{
			switch (name)
			{ 
				case "width":return [o.offsetWidth,o.style,"px"];
				case "height":return [o.offsetHeight,o.style,"px"];
				case "left":return [o.offsetLeft,o.style,"px"];
				case "top":return [o.offsetTop,o.style,"px"];
				case "scrollTop":return [o.scrollTop,o,0];
				case "scrollLeft":return [o.scrollLeft,o,0];
				case "opacity":return /*@cc_on!@*/false?[o.filters.alpha.Opacity,o.filters.alpha,0]:[o.style.opacity*100,o.style,0];
			}
		}
	},
	//浮动广告，效率较差
	FixedMove:function(id,x,y,content)
	{
		document.write("<div id='"+id+"' style='z-index:100;position:absolute;"+x+":0px;top:"+y+"px;'>"+content+"</div>");
		ids=magicjs(id);setInterval(plays,10);	
		function plays(){var olds=ids.t(),news=(document.body.scrollTop||document.documentElement.scrollTop)+y;if(olds!=news){var dy=(news-olds)*0.15;dy=(dy>0?1:-1)*Math.ceil(Math.abs(dy));ids.t(olds+dy);}}
	},
	//下拉列表
	SelectList:function(id,putid,now){
		var inbor=magicjs(id),indt=magicjs(id,"dt")[0],indd=magicjs(id,"dd")[0],listi=magicjs(id,"li");if(putid){var putid=magicjs(putid);}
		if ((listi[0].offsetHeight)*listi.length<indd.offsetHeight){indd.style.height="auto";}
		indd.className="noshow";
		indt.onclick=indd.onmouseover=function(){indd.className="show";indt.className="dt2";};
		inbor.onmouseout=indd.onclick=function(){indd.className="noshow";indt.className="";};
		for(var i=0;i<listi.length;i++){isel(i);}
		function isel(i){
			if(now && now==listi[i].getAttribute("value")){
				if(putid){indt.innerHTML=listi[i].innerHTML;putid.value=listi[i].getAttribute("value");}else{indt.innerHTML=magicjs(listi[i],"a")[0].innerHTML;}
				for(var num=0;num<listi.length;num++){listi[num].id=(i==num)?"open":"";}
			}
			listi[i]["onmouseover"]=function(){listi[i].className="show";}
			listi[i]["onmouseout"]=function(){listi[i].className="";};
			listi[i]["onclick"]=function(){
				if(putid){indt.innerHTML=this.innerHTML;putid.value=this.getAttribute("value");}else{indt.innerHTML=magicjs(listi[i],"a")[0].innerHTML;}
				for(var num=0;num<listi.length;num++){listi[num].id=(i==num)?"open":"";}
			}
		}
	},
	//弹出窗口 [ID,上下位置,偏移值]
	openwin:function(id,path,dist){
		var stopbug=document.documentElement.scrollTop || document.body.scrollTop;
		var objid=magicjs(id);
		magicjs("winmask").style.height=document.documentElement.scrollHeight+"px"; //设遮罩层高度
		objid.style.display=magicjs("winmask").style.display=(objid.style.display=="none")?"block":"none"; //判断窗口显示隐藏  判断遮罩层显示隐藏
		function getleft(){objid.style.left=(document.documentElement.clientWidth-objid.offsetWidth)/2+"px"} //打开时取得窗口left居中值
		function gettop(){objid.style.top=(document.documentElement.clientHeight-objid.offsetHeight)/2+"px";} //打开时取得窗口top居中值
		function ie6gettop(){objid.style.top=document.documentElement.scrollTop+dist+"px";} //ie6取得top值
		function ie6getbottom(){objid.style.top=document.documentElement.clientHeight+document.documentElement.scrollTop-objid.offsetHeight-dist+"px";} //ie6取得top值，得到bottom值
		function ie6getcen(){objid.style.top=(document.documentElement.clientHeight-objid.offsetHeight)/2+document.documentElement.scrollTop+"px";} //ie6取得top居中值
		getleft();gettop();
		var b_version=navigator.appVersion;
		var version=b_version.split(";");
		var trim_Version = "";
		if(version.length > 1){
			trim_Version = version[1].replace(/[ ]/g,""); 
		}
		if(path){ //当为固定样式时
			if(trim_Version=="MSIE6.0"){ //判断IE6
				if(path=="top"){ie6gettop();window.onresize=window.onscroll=function(){getleft();ie6gettop()}}else{ie6getbottom();window.onresize=window.onscroll=function(){getleft();ie6getbottom()}}
			}else{
				window.onresize=function(){getleft();}
				if(path=="top"){objid.style.top=dist+"px";}else{objid.style.top="auto";objid.style.bottom=dist+"px";}
			}
		}else{ //当为非固定样式时
			if(trim_Version=="MSIE6.0"){ //判断IE6
				window.onresize=window.onscroll=function(){getleft();if(!dist){ie6getcen()};}
				if(dist){ie6gettop()}else{ie6getcen();}
			}else{
				window.onresize=function(){getleft();gettop();}
				if(dist){objid.style.top=stopbug+dist+"px";}
			}
		}
		
	},
	//弹出窗口 [ID,上下位置,偏移值]
	openwin2:function(id,divid,path,dist){
		var stopbug=document.documentElement.scrollTop || document.body.scrollTop;
		var objid=magicjs(id);
		magicjs(divid).style.height=document.documentElement.scrollHeight+"px"; //设遮罩层高度
		objid.style.display=magicjs(divid).style.display=(objid.style.display=="none")?"block":"none"; //判断窗口显示隐藏  判断遮罩层显示隐藏
		function getleft(){objid.style.left=(document.documentElement.clientWidth-objid.offsetWidth)/2+"px"} //打开时取得窗口left居中值
		function gettop(){objid.style.top=(document.documentElement.clientHeight-objid.offsetHeight)/2+"px";} //打开时取得窗口top居中值
		function ie6gettop(){objid.style.top=document.documentElement.scrollTop+dist+"px";} //ie6取得top值
		function ie6getbottom(){objid.style.top=document.documentElement.clientHeight+document.documentElement.scrollTop-objid.offsetHeight-dist+"px";} //ie6取得top值，得到bottom值
		function ie6getcen(){objid.style.top=(document.documentElement.clientHeight-objid.offsetHeight)/2+document.documentElement.scrollTop+"px";} //ie6取得top居中值
		getleft();gettop();
		var b_version=navigator.appVersion;
		var version=b_version.split(";");
		var trim_Version = "";
		if(version.length > 1){
			trim_Version = version[1].replace(/[ ]/g,""); 
		}
		if(path){ //当为固定样式时
			if(trim_Version=="MSIE6.0"){ //判断IE6
				if(path=="top"){ie6gettop();window.onresize=window.onscroll=function(){getleft();ie6gettop()}}else{ie6getbottom();window.onresize=window.onscroll=function(){getleft();ie6getbottom()}}
			}else{
				window.onresize=function(){getleft();}
				if(path=="top"){objid.style.top=dist+"px";}else{objid.style.top="auto";objid.style.bottom=dist+"px";}
			}
		}else{ //当为非固定样式时
			if(trim_Version=="MSIE6.0"){ //判断IE6
				window.onresize=window.onscroll=function(){getleft();if(!dist){ie6getcen()};}
				if(dist){ie6gettop()}else{ie6getcen();}
			}else{
				window.onresize=function(){getleft();gettop();}
				if(dist){objid.style.top=stopbug+dist+"px";}
			}
		}
		
	},
	//拖拽功能
	Mdrag:function(id,event){
	    var dragid=magicjs(id) //窗口ID
		//var pX=(document.all)?event.x - dragid.offsetLeft:event.pageX - dragid.offsetLeft; //计算窗口当前位置
		//var pY=(document.all)?event.y - dragid.offsetTop:event.pageY - dragid.offsetTop;
		var winobj=(document.all)?document:window;
		/*if(document.all){dragid.setCapture()}
		winobj.onmousemove=function(event){ //注册移动事件
			dragid.style.left=(document.all)?(window.event.x - pX)+"px":(event.pageX - pX)+"px"; //设置窗口位置
			dragid.style.top =(document.all)?(window.event.y - pY)+"px":(event.pageY - pY)+"px"
		}*/
	 winobj.onmouseup=function(event){winobj.onmousemove=null;if(document.all){dragid.releaseCapture()}} //弹起释放移动事件
	},

	//滚动条[内容区ID，虚拟滚动条ID]
	ScrollBar:function(conid,barid){
		var dragid=magicjs(barid,"p")[0]; //滚动条
		var conObg=magicjs(conid);
		var tops;
		dragid.style.height=(magicjs(barid).offsetHeight*conObg.offsetHeight/conObg.scrollHeight)+"px"; //算出滚动块的长度
		conObg.onscroll=function(){dragid.style.top=(conObg.scrollTop / conObg.scrollHeight * magicjs(barid).offsetHeight)+"px";};
		dragid.onmousedown=function(e){
			var pY=(document.all)?event.y - dragid.offsetTop:e.pageY - dragid.offsetTop;
			var winobj=(document.all)?document:window;
			if(document.all){dragid.setCapture()}
			winobj.onmousemove=function(e){ //注册移动事件
				tops =(document.all)?(window.event.y - pY):(e.pageY - pY);
				conObg.scrollTop=(tops / magicjs(barid).offsetHeight * conObg.scrollHeight);
			};
			winobj.onmouseup=function(e){winobj.onmousemove=null;if(document.all){dragid.releaseCapture();}}; //弹起释放移动事件
		};
	},

	//缓冲滚动图 [ID,左边按钮,右边按钮,滚动方向,滚动条数,自动播放时间,当前样式,滚动速度]
	ScrollPic:function(id,leftbut,rightbut,path,page,autoPlayTime,nowClass,rate){
		var nowPage=0,setout,setIn,speed,remain,now_num,target_num,obj=id.split("/"),xy="+",rate=rate||10;
		var scrollId=magicjs(obj[0]);
		if(nowClass){page=1;magicjs(obj[0],"div")[0].innerHTML+=magicjs(obj[0],"div")[0].innerHTML;} //如果有当前样式，复制内容
		var scroll_List=magicjs(obj[0],obj[1]);
		var scroll_List_Total=scroll_List.length; //列表总数
		var offset_scrollId=(path=="scrollLeft")?scrollId.offsetWidth:scrollId.offsetHeight; //取外容器宽或高
		var offset_single=(path=="scrollLeft")?scroll_List[0].offsetWidth:scroll_List[0].offsetHeight; //取内部单个列表宽或高
		var frameInList=Math.round(offset_scrollId/offset_single); //外容器可见区域列表数
		if(nowClass){scroll_List[nowPage+nowClass].className="nowclass";}
		magicjs(leftbut).onmousedown=function(){xy="-";ScrollSpace();};
		magicjs(rightbut).onmousedown=function(){xy="+";ScrollSpace();};
		if(autoPlayTime){ScrollAutoPlay();}
		function ScrollAutoPlay(){if(remain!=0){setout=setTimeout(ScrollSpace,autoPlayTime);}} //自动播放函数
		function ScrollSpace(){  //执行函数
			clearInterval(setIn);clearInterval(setout);
			remain=(xy=="+")?scroll_List_Total-frameInList-nowPage:nowPage; //计算左右被隐藏的剩余列表数
			if(xy=="+"){nowPage=remain<page?nowPage+remain:nowPage+page;}else{nowPage=remain<page?remain-nowPage:remain-page;} //加向左,减向右
			setIn=setInterval(ScrollBuffer,5);
			if(nowClass){ //加当前样式
				if(xy=="+"&&scroll_List_Total/2+1<=nowPage){scrollId[path]=0;nowPage=1;}
				if(xy=="-"&&nowPage<=0){scrollId[path]=scroll_List_Total*offset_single/2+offset_single;nowPage=scroll_List_Total/2;}
				for(var n=0;n<scroll_List_Total;n++){scroll_List[n].className="";} 
				scroll_List[nowPage+nowClass].className="nowclass";
			}
		}
		function ScrollBuffer(){ //缓冲函数
			now_num=scrollId[path]; //当前值
			target_num=nowPage*offset_single; //目标值
			speed=(target_num<now_num)?Math.floor((target_num-now_num)/rate):Math.ceil((target_num-now_num)/rate); //目标值-当前值
			scrollId[path]+=speed;
			if(speed==0){clearInterval(setIn);ScrollAutoPlay();}
		}
	}

}


// tab标签切换
function getNames(obj,name,tij)
	{	
		var p = document.getElementById(obj);
		var plist = p.getElementsByTagName(tij);
		var rlist = new Array();
		for(i=0;i<plist.length;i++)
		{
			if(plist[i].getAttribute("name") == name)
			{
				rlist[rlist.length] = plist[i];
			}
		}
		return rlist;
	}

function fod(obj,name)
		{
			var p = obj.parentNode.getElementsByTagName("li");
			var p1 = getNames(name,"f","div"); // document.getElementById(name).getElementsByTagName("div");
			for(i=0;i<p1.length;i++)
			{
				if(obj==p[i])
				{
					p[i].className = "aboutBodyBg curr";
					p1[i].className = "dis";
				}
				else
				{
					p[i].className = "aboutBodyBg";
					p1[i].className = "hidden";
				}
			}
}
