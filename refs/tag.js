//tab切换只改变样式
function tst(id,num,str,css1,css2){
   for(var i=1;i<=num;i++){
     var idStr = str+i;
     if(id==idStr)
         eval("document.all."+idStr+".className ='"+css1+"';")
      else
         eval("document.all."+idStr+".className ='"+css2+"';")
   }
}
//tab切换通过“id”控制显示或隐藏
var $=function(id){return document.getElementById(id);}
function SwitchNews(obj,num,sum,class1,class2)
{
 	ClearNews(obj,sum,class1,class2);
	$("tag" + obj + num).className=class1;
	$(obj+num).style.display = "";								
}
function ClearNews(name, num,class1,class2)
{					
	for(i=1;i<= num;i++)
	{										
		var tag=$("tag"+ name + i).className;
		if(tag==class1){
			$("tag"+ name + i).className=class2; 
			$(name + i).style.display="none";
		}
	}
}

function SwitchNews2(obj,num,sum,class1,class2)
{
 	ClearNews2(obj,sum,class1,class2);
	$("tag" + obj + num).className=class1;
	$(obj+num).style.display = "";								
}
function ClearNews2(name, num,class1,class2)
{					
	for(i=1;i<= num;i++)
	{	var className = class2 + i;									
		var tag=$("tag"+ name + i).className;
		$("tag"+ name + i).className=className; 
		$(name + i).style.display="none";
	}
}
//未完成栏目提示信息
function checkAlert(){
   alert("网站此栏目正在建设中，有不便之处敬请谅解！！！");
   return false;
}
//begin 新加SwitchNews3
function SwitchNews3(obj,num,sum,class11,class12,obj2,sum2,class21,class22,obj3,sum3,class31,class32)
{
 	ClearStyle(obj,sum,class11,class12,obj2,sum2,class21,class22,obj3,sum3,class31,class32);
	$("tag" + obj + num).className=class11;
	$(obj+num).style.display = "";								
}
function EventForMouseOut(name,num,class11,class12,name2, num2,class21,class22,name3, num3,class31,class32)
{
	//alert("fddddddddddddd");
	for(i=1;i<= num;i++)
	{										
		var tag=$("tag"+ name + i).className;  
		if(tag==class11){
			$("tag"+ name + i).className=class12; 
			$(name + i).style.display="none";
		}
	}
		for(i=1;i<= num2;i++)
	{										
		var tag=$("tag"+ name2 + i).className;   
		if(tag==class21){
			$("tag"+ name2 + i).className=class22; 
			$(name2 + i).style.display="none";
		}
	}
		for(i=1;i<= num3;i++)
	{										
		var tag=$("tag"+ name3 + i).className;
		if(tag==class31){
			$("tag"+ name3 + i).className=class32; 
			$(name3 + i).style.display="none";
		}
	}						
}

function ClearStyle(name,num,class11,class12,name2, num2,class21,class22,name3, num3,class31,class32)
{					
	for(i=1;i<= num;i++)
	{										
		var tag=$("tag"+ name + i).className;  
		if(tag==class11){
			$("tag"+ name + i).className=class12; 
			$(name + i).style.display="none";
		}
	}
		for(i=1;i<= num2;i++)
	{										
		var tag=$("tag"+ name2 + i).className;
		if(tag==class21){
			$("tag"+ name2 + i).className=class22; 
			$(name2 + i).style.display="none";
		}
	}
		for(i=1;i<= num3;i++)
	{										
		var tag=$("tag"+ name3 + i).className;
		if(tag==class31){
			$("tag"+ name3 + i).className=class32; 
			$(name3 + i).style.display="none";
		}
	}
}
//end 新加


// 老式标签切换 开始 //
function gi(v){
	return document.getElementById(v);
}
function showOrHide(v, h){
	var show = gi(v).style.visibility;
	if(h == null){
		if(show == "hidden"){
		  gi(v).style.visibility = "visible";
		}else{
		  gi(v).style.visibility = "hidden";
		}
	}else{
	  if(h){
	    gi(v).style.visibility = "visible";
	  }else{
	  	gi(v).style.visibility = "hidden";
	  }
	}
}
function change_bg(obj, isTab){
  gi("bg_1").style.backgroundImage = "url()";
  gi("bg_2").style.backgroundImage = "url()";
  if(isTab){
	  obj.style.backgroundImage = "url()";
  }
  var table_id = obj.id.substr(3, 1);
  
  gi("inf_1").style.display = "none";
  gi("inf_2").style.display = "none";
  gi("inf_" + table_id).style.display = "block";
}
// 老式标签切换 结束 //



// 新闻页面标签背景切换 开始 //
function switch_kline(img){ 
	if (img=="newtags1") 	{ 
		document.images["k_line_title"].src="pic/service/nav_img1.jpg";
<!--	document.images["k_line"].src = "/pic/news/tags_bg2.jpg";-->
 	} 
    else if(img=="newtags2") 	{ 
		document.images["k_line_title"].src="pic/service/nav_img2.jpg";
<!--	document.images["k_line"].src = "/pic/news/tags_bg2.jpg";-->
 	} 
  }
// 新闻页面标签背景切换 结束 //s