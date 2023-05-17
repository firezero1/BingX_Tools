//取得查看更多按鈕


var isMoreData=true

var finalData=[];
var finalDataDetail=[];
var timeoutBase=1200;

var filterDate;
var filterDateEnd;
var count;
var	isBinance;
var startPage;
var endPage;




// (function() {

    // // Want to retrieve the parameter passed from eventpage.js here

    // chrome.runtime.onMessage.addListener(function(message) {
        // var receivedParameter = message.myVar;

		// // filterDate=message.myVar[0];
        // // filterDateEnd=message.myVar[1];
		// // count=message.myVar[2];
		// // timeoutBase=message.myVar[3]*1000;//每次點擊耗費多少秒
		
		// startPage=message.myVar[0];
		// endPage=message.myVar[1];
		// console.log('myValue1 in addListener:'+startPage);
		// console.log('myValue2 in addListener:'+endPage);
		// mainLoop();

    // });

// })();

chrome.runtime.onMessage.addListener(receiveMessage);

function receiveMessage(message){
	
	try {
		startPage=message.myVar[0];
		endPage=message.myVar[1];
		console.log('startPage in addListener:'+startPage);
		console.log('endPage in addListener:'+endPage);
		mainLoop();

	}
	catch(ex) {
		console.log(ex);
	
	}
	finally {
		//不論有沒有做完都要移除收訊息事件，避免下次使用重複加上事件
		removeReceiveMessageEvent();
	}
}

function removeReceiveMessageEvent(){
	chrome.runtime.onMessage.removeListener(receiveMessage);
}



/* while (isMoreData && i<20) {
var getButtonResult = document.getElementsByClassName("more")
	//alert(getButtonResult.length)
	console.log(getButtonResult.length);
	if (getButtonResult.length!=1) {
    isMoreData=false
	console.log('!=1')
	} else {
		    setTimeout(() => {
               var seemore = getButtonResult[0]
				seemore.click()
				console.log('=1')
				//console.log(i)	
				
        }, 500*i);

	i=i+1
	console.log(i)
	getButtonResult.clear;
	}

}  */

async function mainLoop() {
	
	console.log('into mainloop')
	console.log('myValue1 in mainLoop:'+startPage);
	console.log('myValue2 in mainLoop:'+endPage);
	

	var tabFollowActivate =  document.getElementsByClassName("mtb-item-active");
	//console.log(tabFollowActivate[0]);
	if(tabFollowActivate[0].outerText !== '歷史交易')
	{
		alert('請點選歷史交易');
		return false;
		
	}

	//console.log(data[0].children[0].innerText);
	//確認跟單紀錄有幾頁
	var getPages = document.querySelectorAll('div.page-cell');
	var pageMax=1;
	

	
	//抓標題資料
	var tableHeader  = document.querySelectorAll('thead'); 
	finalData.push(tableHeader[0]);//20230417 BingX網頁改版，跟單設定的class也是Header，導致tableHeader有兩個元素，必須改取第二個才是我要的標題
	
	if(getPages.length===0){
		//只有一頁
		//await clickDropDownFunction(0);//展開明細
		var data = document.querySelectorAll('tr');
		//var dataDetail = document.querySelectorAll('div.card:not(.box)');
		
		for(let i = 0; i < data.length; i++){
			finalData.push(data[i]);
		}
		
		// for(let j = 0; j < dataDetail.length; j++){
			// finalDataDetail.push(dataDetail[j]);
		// }
		
		await outputExcel(0);

	}else{
		//有很多頁
		var currentPageNumber = document.querySelectorAll('div.page-cell.active');
		// if(currentPageNumber[0].innerText !== '1')
		// {
			// alert('請點擊第一頁再進行全部輸出');
			// return false;
			
		// }
		
		
		var pageNumbers =  document.querySelectorAll('div.page-cell');


		pageMax = pageNumbers[pageNumbers.length-1].innerText;
		
		console.log(startPage);
		console.log(pageMax);
		
		if(startPage===null||startPage===''||parseInt(startPage)<1)
		{
			startPage=1;
		}
		
		console.log(startPage);
	
		if(endPage===null||endPage===''||parseInt(endPage)<1)
		{
			endPage=pageMax;
		}
		
		if(parseInt(startPage)>parseInt(pageMax)){
			alert('起始頁數超過最大頁數,請重新輸入');

			return false;
		}
		
		if(parseInt(endPage)>parseInt(pageMax)){
			alert('結束頁數超過最大頁數,請重新輸入');
			return false;
		}
		
		
		
		var currentPage = currentPageNumber[0].innerText
		
		console.log('Change Page Start!');
		while (parseInt(currentPage)!==parseInt(startPage)) {
			await clickPageNumberFunction(1,startPage,currentPage);
			currentPage=document.querySelectorAll('div.page-cell.active')[0].innerText;
			console.log('currentPage: '+currentPage +'startPage: '+startPage);
		}
		
		console.log('Change Page End!');
		
				

		for(let i = startPage-1; i < endPage; i++){
			//console.log(i)	
			

			// if(i<2){
				// await clickFunction(i+1);
			// }else{
				// await clickFunction(i);
			// }
			//await clickDropDownFunction(1);
			
			

			
			console.log('pushdata') 
			var data = document.querySelectorAll('tr');
			//var dataDetail = document.querySelectorAll('div.card:not(.box)');//因為交易員今日收益和累積收益class是box card，抓card會抓到，因此須用not(.box)排除
			
			console.log('第'+(i+1)+'頁data長度:'+data.length);
			//console.log('第'+(i+1)+'頁dataDetail長度:'+dataDetail.length);
		

			for(let j = 0; j < data.length; j++){
				finalData.push(data[j]);
			}
			
			// for(let j = 0; j < dataDetail.length; j++){
				// finalDataDetail.push(dataDetail[j]);
			// }
			
			await clickFunction(1);//因為會等他做完，直接用1帶入即可


			//console.log(finalData);
			//console.log(finalDataDetail);
			
			// console.log(finalData[0].children[1].innerText);
			
		   if(i===endPage-1){

			 await outputExcel(1);//直接用1，因為上面會做完後再輸出
			 //console.log(finalData[1].children);

			 // console.log(finalDataDetail[1].children);
		   }
		}
	
		
		// var btnNextDisable = document.querySelectorAll('button[disabled="disabled"].btn-next');//最後一頁時btn-next會disable
		// var btnNext = document.querySelectorAll('.btn-next');
		//btnNext[0].click()
	}		
	
}



function clickFunction(i){
	return new Promise((resolve,reject)=>{//用promise才有辦法讓呼叫clickFunction的程式等他完成才進行下一步
		setTimeout(() => {
		console.log('into clickFunction') 
		var btnNextDisable = document.querySelectorAll('div.jump-cell.jump-cell_next.rtl-element-reverse.disabled');//最後一頁時btn-next會disable
		if(btnNextDisable.length>0){
			
		}else{
			var btnNext = document.querySelectorAll('div.jump-cell.jump-cell_next.rtl-element-reverse');
			btnNext[0].click()
			console.log('clickFinish') 
		}
		
		resolve();
		

		
		}, timeoutBase*i );
	});
    
}

function clickPageNumberFunction(i,pageNumber,currentPage){
	return new Promise((resolve,reject)=>{//用promise才有辦法讓呼叫此Function的程式等他完成才進行下一步
		setTimeout(() => {
		console.log('into clickPageNumberFunction') 
		
		var pageToClick = contains('div.page-cell',pageNumber);
		console.log('pageNumber:'+pageNumber);
		console.log('currentPage'+currentPage);
		var pageNumberInt =parseInt(pageNumber);
		var currentPageInt = parseInt(currentPage);
	
		if(pageToClick.length>0 && pageToClick[0].innerText===pageNumber){
			pageToClick[0].click();
			console.log('pageToClick Click') 
		}else if(currentPageInt<pageNumberInt){
			var btnQuickNext = document.querySelectorAll('div.expand-cell.expand-cell_next.rtl-element-reverse');
			btnQuickNext[0].click()
			console.log('btnQuickNext Click') 
		}else{
			var btnQuickPrev = document.querySelectorAll('.expand-cell.expand-cell_prev.rtl-element-reverse');
			btnQuickPrev[0].click()
			console.log('btnQuickPrev Click') 
		}

		console.log('clickPageNumberFunction Finish') 
		resolve();
		

		
		}, timeoutBase*i );
	});
    
}

//尋找特定字串元素
function contains(selector, text) {
  var elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function(element){
    return RegExp(text).test(element.textContent);
  });
}


//展開每一筆下拉選單
function clickDropDownFunction(i){
	return new Promise((resolve,reject)=>{//用promise才有辦法讓呼叫clickDropDownFunction的程式等他完成才進行下一步
		setTimeout(() => {
		console.log('into clickDropDownFunction') 
		var btnDropDown = document.querySelectorAll('div.line.fold');
		for(let j = 0; j < btnDropDown.length; j++){
			btnDropDown[j].click();
		}
		resolve();
		

		
		}, timeoutBase*i );
	});
    
}

function outputExcel(i){
	setTimeout(() => {

		// if(isBinance){
			// outputBinance();
		// }else{
			// outputBingX();
		// }
		
		//outputBingXFollow();
		outputBingXFollowNew();
		
    }, timeoutBase*i);
}

function outputBingXFollowNew(){
	var csvAll=[];
	for(var j=0; j<finalData.length; j++){ 
		var row = [];
		for(var k=0; k<finalData[j].children.length; k++){
			if(j===0){//處理標題
				if(k===0){
					row.push(finalData[j].children[k].innerText);
					
					row.push('方向');
					row.push('倉別');
					row.push('槓桿倍數');
				}else if (k===1){
					row.push(finalData[j].children[k].innerText);
					row.push('收益百分比');	
				}else if (k===4){
					row.push(finalData[j].children[k].innerText);
					//row.push('保證金單位');	
				}else if (k===5){
					row.push(finalData[j].children[k].innerText);
					//row.push('交易總額單位');	

				}else{
					row.push(finalData[j].children[k].innerText);
				}
			}
			else if(k===0){
				//20230410 BingX又改版，將槓桿倍數改用正規表示式來尋找並取代，另外先去空白後，有一個地方會有連續兩個換行符號，因此先將他們換成逗號，再將一個換行符號的換成逗號
				var textData = finalData[j].children[k].innerText
				var leverageStartIndex = textData.search(/\d+X/g)
				var leverageEndIndex = textData.indexOf("X",leverageStartIndex)
				var leverageNumber=textData.slice(leverageStartIndex,leverageEndIndex)

				//var leverageNumber = leverage.replace(/X/g, '')

				//console.log(finalData[j].children[k].innerText.replace(/ /g, '').replace(/\d+X/g, leverageNumber).replace(/\n\n/g, ',').replace(/\n/g, ','))
				row.push(finalData[j].children[k].innerText.replace(/ /g, '').replace(/\d+X/g, leverageNumber).replace(/\n\n/g, ',').replace(/\n/g, ','))

			}else{
				row.push(finalData[j].children[k].innerText);				
			}
			
		}
		csvAll.push(row.join(','))
	}
	
	var csvString = csvAll.join("\n");
	var a = document.createElement('a');
	a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvString);
	a.target      = '_blank';
	a.download    = 'FollowOutput.csv';

	document.body.appendChild(a);
	a.click();
	
}

function outputBingXFollow(){
	
		var csvAll=[];
		for(var j=0; j<finalData.length; j++){ 
			var row = [];
			

			//Data
			for(var k=0; k<finalData[j].children.length; k++){ 
				if(j===0){//處理標題
					if(k===0){
						row.push(finalData[j].children[k].innerText);
						
						row.push('方向');
						row.push('倉別');
						row.push('槓桿倍數');
					}else if (k===1){
						row.push(finalData[j].children[k].innerText);
						row.push('收益百分比');	
					}else if (k===4){
						row.push(finalData[j].children[k].innerText);
						//row.push('保證金單位');	
					}else if (k===5){
						row.push(finalData[j].children[k].innerText);
						//row.push('交易總額單位');	

					}else{
						row.push(finalData[j].children[k].innerText);
					}
				}
				else if(k===0){
					//20230410 BingX又改版，將槓桿倍數改用正規表示式來尋找並取代，另外先去空白後，有一個地方會有連續兩個換行符號，因此先將他們換成逗號，再將一個換行符號的換成逗號
					var textData = finalData[j].children[k].innerText
					var leverageStartIndex = textData.search(/\d+X/g)
					var leverageEndIndex = textData.indexOf("X",leverageStartIndex)
					var leverageNumber=textData.slice(leverageStartIndex,leverageEndIndex)

					//var leverageNumber = leverage.replace(/X/g, '')

					//console.log(finalData[j].children[k].innerText.replace(/ /g, '').replace(/\d+X/g, leverageNumber).replace(/\n\n/g, ',').replace(/\n/g, ','))
					row.push(finalData[j].children[k].innerText.replace(/ /g, '').replace(/\d+X/g, leverageNumber).replace(/\n\n/g, ',').replace(/\n/g, ','))

				}
				else if (k===1){
					row.push(finalData[j].children[k].innerText.replace(/\(/g, ',').replace(/\)/g, '').replace(/\n/g, ''))//將(換成逗點、將)拿掉，區分收益和收益百分比，並將前後換行符號拿掉
					
				}
				else if (k===2 || k===3){
					row.push(finalData[j].children[k].innerText.replace(/,/g, ''))//2023.03.27開倉價和平倉價多了千分位逗點，必須去掉
				}
				else if (k===4 || k===5){
					//2023.03.27交易總額多了千分位逗點，必須先去掉，再將空白取消，將USDT(VST)換成USDT(VST)+逗點，將保證金和交易總額之數字與單位分開，並取消換行符號
					//2023.04.17保證金和交易總額沒有單位了，取消
					row.push(finalData[j].children[k].innerText.replace(/,/g, '').replace(/ /g, '').replace(/\n/g, ''))
					
					
				}
				else if (k===6){
					//下拉展開按鈕也包含在children內，因此在k===6時要避免放入，並改用槓桿取代
					//2022.09.20 BingX網頁改版，有提供槓桿資料，因此無須再計算
					
					
					// var leverage = getLeverage(finalData[j].children[4].innerText,finalData[j].children[5].innerText);
					// row.push(leverage);

				}
				else{
					row.push(finalData[j].children[k].innerText)
				}
				
				//console.log(finalData[j].children[k].innerText)
			}
			

			//DataDetail(注意Data因為有標題，所以children數目會比DataDetail多1，因此必須在j>0之後才放值
			if(j===0){
				//放標題
				for(var k=0; k<finalDataDetail[j].children.length; k++){ 
					if(k===0){
						row.push('止損百分比');
						row.push(finalDataDetail[j].children[k].children[0].innerText)
					}else if(k===1){
						row.push('止盈百分比');
						row.push(finalDataDetail[j].children[k].children[0].innerText)
					}else if (k===7){
						row.push(finalDataDetail[j].children[k].children[0].innerText)
						
						//2022.09.21 新增開倉日和收倉日標題
						row.push('開倉日');	
						row.push('收倉日');	
					}
					else{
						row.push(finalDataDetail[j].children[k].children[0].innerText)
					}
					
				}
			}else{
				//放值，用j-1
				for(var k=0; k<finalDataDetail[j-1].children.length; k++){ 
					if(k===0 || k===1){
						var originData = finalDataDetail[j-1].children[k].children[1].innerText;
						if(originData === '--'){
							row.push(originData);
							row.push(originData);//push兩次是因為止損和止盈切成兩個欄位
						}else{
							//2023.03.27觸發價多了千分位逗點，因此先拿掉，然後將(換成逗點、將)拿掉，區分止損(盈)百分比和止損(盈)價，並將空白拿掉
							originData=originData.replace(/,/g, '').replace(/ /g, '').replace(/\(/g, ',').replace(/\)/g, '');
							row.push(originData);
						}
						
					}else if (k===7){
						//2022.09.21 新增開倉日和收倉日
						row.push(finalDataDetail[j-1].children[k].children[1].innerText)
						row.push(formatDate(finalDataDetail[j-1].children[2].children[1].innerText))//開倉日
						row.push(formatDate(finalDataDetail[j-1].children[3].children[1].innerText))//收倉日
					}
					else if (k===8){
						row.push(finalDataDetail[j-1].children[k].children[1].innerText.replace(/\n/g, ''))
					}
					else{
						row.push(finalDataDetail[j-1].children[k].children[1].innerText)
					}

				}
			}
			
			
			csvAll.push(row.join(','))
		}

		var csvString = csvAll.join("\n");
		var a         = document.createElement('a');
		a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvString);
		a.target      = '_blank';
		a.download    = 'FollowOutput.csv';

		document.body.appendChild(a);
		a.click();
		
		
	
}


function formatDate(date) {
	var today =new Date(),
		todayMonth = today.getMonth() + 1,
		todayYear = today.getFullYear()
		
    var d = new Date(date),
        month =  (d.getMonth() + 1),
        day = d.getDate()
        //year = d.getFullYear();
	
	if(month>todayMonth)
	{
		todayYear=todayYear-1;
	}
	var outputMonth = '' + month
	var outputDay =''+day
	

	
    if (outputMonth.length < 2) 
        outputMonth = '0' + month;
    if (outputDay.length < 2) 
        outputDay = '0' + day;

	
	
    return [todayYear, outputMonth, outputDay].join('/');
}

function getDateDiffByDays(date1,date2){
	var d1 = new Date(date1)
	var d2 = new Date(date2)
	var diffDays = (d2-d1) / (1000 * 60 * 60 * 24);
		console.log(diffDays);
	return diffDays;
}


function getLeverage(margin, total) {//用保證金和交易金額計算槓桿
	var a = margin.split(' USDT')[0].split(' VST')[0];
	var b = total.split(' USDT')[0].split(' VST')[0];
	var leverage = b/a;
	return leverage;
}

function getPrinciple(inputData) {
	if (inputData.includes('*****')){
		return '100';
	}
	
	var a = inputData.split('\n');
	//var b = a[1].split('X)');
	var principle = a[0].replace(/,/g, '');//避免1000以上會有千分位逗點問題
	return principle;
}



