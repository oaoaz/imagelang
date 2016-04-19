;(function($){
	
	var LightBox = function(){
		var self = this;	
	
		//创建遮罩和弹出框
		this.popupMask = $('<div id= "lightbox-mask">');
		this.popupWin = $('<div id="lightbox-popup">');

		//保存到BODY
		this.bodyNode = $(document.body);

		//渲染剩余的DOM并且插入到BODY
		this.renderDOM();

		this.picViewArea = this.popupWin.find("div.lightbox-btn-view");//图片预览区域
		this.popupPic = this.popupWin.find("img.lightbox-pic");//图片
		this.picCaption = this.popupWin.find("div.lightbox-caption");//图片文字描述
		this.nextBtn = this.popupWin.find("span.next-show");//左按钮
		this.prevBtn = this.popupWin.find("span.prev-show");//右按钮
		this.captionText = this.popupWin.find("p.lightbox-desc");//图片描述
		this.currentIndex = this.popupWin.find("span.lightbox-index");//图片当前索引
		this.closeBtn = this.popupWin.find("lightbox-close");//关闭按钮

		//准备开发时事件委托，获取组数据
		// var Lightbox = $("js-main,[data-role=lightbox]");
		// Lightbox.click(function(){
		// 	alert('a');
		// })
		this.groupName = null;
		this.groupData=[];//放置同一组数据;
	 	this.bodyNode.delegate(".js-main,[data-role=lightbox]","click",function(e){
	 		//阻止事件冒泡
	 		e.stopPropagation();
	 		// alert($(this).attr("data-group"));
	 		var currentGroupName = $(this).attr("data-group");
	 		
	 		if(currentGroupName != self.groupName){
	 			self.groupName = currentGroupName;
	 			//根据当前组名获取同一组数据
	 			self.getGroup();
	 		};
	 			//初始化弹框
	 			self.initPopup($(this));
	 	});

	 			//关闭弹窗
	 			this.popupMask.click(function(){
	 				$(this).fadeOut();
	 				self.popupWin.fadeOut();
	 			});

	 			this.closeBtn.click(function(){    //////存在问题！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
	 				alert("1");
	 				self.popupMask.fadeOut();
	 				self.popupWin.fadeOut();
	 			});
	 			//绑定上下切换按钮事件

	 			this.flag = true; //防多点

	 			this.nextBtn.hover(function(){

	 				if(!$(this).hasClass('disabled')&&self.groupData.length>1){
	 					$(this).addClass("next-show");
	 				};


	 			},function(){

	 				if(!$(this).hasClass('disabled')&&self.groupData.length>1){
	 					$(this).removeClass("next-show");
	 				};	
	 			}).click(function(e){
	 				if(!$(this).hasClass('disabled')&&self.flag){
	 					self.flag = false;
	 					e.stopPropagation();
	 					self.goto("next");
	 				}

	 			});
	 			this.prevBtn.hover(function(){

	 				if(!$(this).hasClass('disabled')&&self.groupData.length>1){
	 					$(this).addClass("prev-show");
	 				};


	 			},function(){

	 				if(!$(this).hasClass('disabled')&&self.groupData.length>1){
	 					$(this).removeClass("prev-show");
	 				};

	 			}).click(function(e){
	 				if(!$(this).hasClass('disabled')&&self.flag){
	 					self.flag = false;
	 					e.stopPropagation();
	 					self.goto("prev");
	 				}

	 			});

	 			

	};
	
	LightBox.prototype = {

		goto:function(dir){
			if(dir ==="next"){
				
				this.index++;
				if(this.index>=this.groupData.length-1){
					this.nextBtn.addClass("disabled").removeClass("next-show");
				};
				if(this.index!=0){
					this.prevBtn.removeClass("disabled");
				};

				var src = this.groupData[this.index].src;

				this.loadPicSize(src);

			}else if(dir ==="prev"){
				this.index--;
				if(this.index <= 0){
					this.prevBtn.addClass("disabled").removeClass("prev-show");
				};
				if(this.index !=this.groupData.length-1){
					this.nextBtn.removeClass("disabled");
				};

				var src = this.groupData[this.index].src;

				this.loadPicSize(src);
			};
		},

		loadPicSize:function(sourceSrc){
			var self = this;
			self.popupPic.css({width:"auto",height:"auto"}).hide();
			
			this.preLoadImg(sourceSrc,function(){
				
				self.popupPic.attr("src",sourceSrc);
				var picWidth = self.popupPic.width(),
					picHeight = self.popupPic.height();

				self.changePic(picWidth,picHeight);	

			});
		},
		changePic:function(width,height){

			var self = this,
				winWidth = $(window).width(),
				winHeight = $(window).height();

				//如果图片的宽高大于浏览器视口的宽高比例,看下是否溢出
				var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

				width = width*scale;
				height = height*scale;

			this.picViewArea.animate({
									width:width-10,
									height:height-10
									});
			this.popupWin.animate({
								 width:width,
								 height:height,
								 marginLeft:-(width/2),
								 top: (winHeight-height)/2
								 },function(){
								 	self.popupPic.css({
								 					 width:width-10,
								 					 height:height-10,	
								 					 }).fadeIn();
								 	self.picCaption.fadeIn();
								 	self.flag = true;
								 });
			//设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);

			this.currentIndex.text("当前索引:"+(this.index+1)+" of "+this.groupData.length);
		},

		preLoadImg:function(src,callback){

			var img =new Image();
			if(!!window.ActiveXObject){ //ie
				img.onreadystatechange = function(){
					if(this.readyState == "complete"){
						callback();
					};
				};
			}else{
				img.onload = function(){
					callback();

				};
			};
			img.src = src;
		},

		showMaskAndPoppup:function(sourceSrc,currentId){
			// console.log(sourceSrc);
			var self = this;
			this.popupPic.hide();
			this.picCaption.hide();
			
			this.popupMask.fadeIn();

			var winWidth = $(window).width();
			var winHeight = $(window).height();

			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});

			this.popupWin.fadeIn();
			
			var viewHeight = winHeight/2+10; // 加上边框
			var viewWidth = winWidth/2+10;
			
			this.popupWin.css({
				width:viewWidth,
				height:viewHeight,
				marginLeft:-viewWidth/2,
				top:-viewHeight
			}).animate({
				top:(winHeight-viewHeight)/2
				},function(){
					//加载图片
					self.loadPicSize(sourceSrc);

				});
			//根据当前点击的元素id获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);
			
			var groupDataLength = this.groupData.length;
			if(groupDataLength > 1){

				if(this.index === 0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index === groupDataLength - 1){
					this.prevBtn.removeClass("disabled");
					this.nextBtn.addClass("disabled");
				}else{
					this.nextBtn.removeClass("disabled");
					this.prevBtn.removeClass("disabled");
				}


			}


		},
		getIndexOf:function(currentId){
			
			var index = 0;
			
			$(this.groupData).each(function(i){
				index = i;
				if(this.id === currentId){
					return false;
				}
			});
			return index;
		},

		initPopup:function(currentObj){
 
			var self = this;
			sourceSrc = currentObj.attr("data-source");
			currentId = currentObj.attr("data-id");

			this.showMaskAndPoppup(sourceSrc,currentId);
		},


		getGroup:function(){

			var self = this;
			
			//根据当前组别的名称获取同一组数据
			var groupList = this.bodyNode.find("[data-group="+this.groupName+"]"); 	
			// alert(groupList.size());

			//清空数组数据
			self.groupData.length = 0;
			groupList.each(function(){
				self.groupData.push({
									src:$(this).attr("data-source"),
									id:$(this).attr("data-id"),
									caption:$(this).attr("data-caption")
									});
			});
			// console.log(self.groupData);
		},

		renderDOM:function(){
		 var strDom = 
		 	'<div class="lightbox-btn-view">'+
				'<span class="lightbox-prev lightbox-btn prev-show"></span>'+
				'<img src="images/2-2.jpg" class="lightbox-pic"  >'+
				'<span class="lightbox-next lightbox-btn next-show"></span>'+
			'</div>'+
			'<div class="lightbox-caption">'+
				'<div class="lightbox-area">'+
		    	'<p class="lightbox-desc"></p>'+
		    	'<span class="lightbox-index">当前索引: 0 of 0</span>'+
				'</div>'+
				'<span class="lightbox-close"></span>'+
			'</div>'

			//插入到popupWin
			this.popupWin.html(strDom);

			//把遮罩和弹出框保存到BODY
			this.bodyNode.append(this.popupMask,this.popupWin);
		}
	};
	window['LightBox'] = LightBox;
})(jQuery);