//取得查看更多按鈕


var isMoreData=true

var timeoutBase;
var filterDate;
var filterDateEnd;
var count;
var	isBinance;



// (function() {

    // // Want to retrieve the parameter passed from eventpage.js here


    // chrome.runtime.onMessage.addListener(function(message) {
        // var receivedParameter = message.myVar;

		// filterDate=message.myVar[0];
        // filterDateEnd=message.myVar[1];
		// count=message.myVar[2];
		// timeoutBase=message.myVar[3]*1000;//每次點擊耗費多少秒
		// //isBinance = message.myVar[4];


    // });

// })();


chrome.runtime.onMessage.addListener(receiveMessage);

function receiveMessage(message){
	
	try {
		
		filterDate=message.myVar[0];
        filterDateEnd=message.myVar[1];
		count=message.myVar[2];
		timeoutBase=message.myVar[3]*1000;//每次點擊耗費多少秒
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
	//console.log(filterDate);
	var getButtonResult = document.getElementsByClassName("more");
	
	
	
	//確認是否為幣安合約
	var tabActivate =  document.getElementsByClassName("tab active");
	//console.log(tabActivate)
	if(tabActivate[0].outerText==='Binance-1 合約' || tabActivate[0].outerText==='BingX 專業合約')
	{
		isBinance=true;
	}else
	{
		isBinance=false;
	}

	
	if(getButtonResult.length===0){
		alert('請點選歷史交易');
		return false;
	}
	
	for(let i = 0; i < count; i++){
		//console.log(i)	
       await clickFunction(1);
	   if(i===count-1){
		  //await outputExcel(i+1);//用i+1是確保最後一次click做完後再轉csv
		  await outputExcel(1);//直接用1，因為上面會做完後再輸出

	   }
    }
	//alert('finish');
}



function clickFunction(i){
	return new Promise((resolve,reject)=>{//用promise才有辦法讓呼叫clickFunction的程式等他完成才進行下一步
	    setTimeout(() => {
			console.log('into clickFunction') 
			var getButtonResult = document.getElementsByClassName("more");
			if (getButtonResult.length!=1) {
				isMoreData=false
				//console.log('set isMoreData false') 
				//console.log(i)			
			} else {
				var seemore = getButtonResult[0]
				seemore.click()	
				//console.log('click') 
				//console.log(i)
			}	

			resolve();
			
		}, timeoutBase*i );
	
	});

}

function outputExcel(i){
	setTimeout(() => {

		if(isBinance){
			outputBinance();
		}else{
			outputBingX();
		}
		
		
    }, timeoutBase*i );
}

function outputBingX(){
	
			//var historyDataOrigin = document.getElementsByClassName("history");
		//var historyData = document.querySelector('.history');
		//var rowHeader = document.getElementsByClassName("row header")[0].children;
		//console.log(historyDataOrigin);
		var rows =document.querySelectorAll('.history .row');
		
	
		
		
		//console.log(historyData);
		//console.log(outputData.length);
		
		
		// var rowsArray = []
		// for(var j=0; j<rows.length; j++){ 
			// var row = [];
			// for(var k=0; k<rows[j].children.length; k++){ 
				// row.push(rows[j].children[k].innerText);
			// }
			// rowsArray.push(row);
		// }
		
		//console.log(rows[0].children);
		//console.log(rows.length);

		
		var csvAll=[];
		for(var j=0; j<rows.length; j++){ 
			var row = [];
			//若有設定起日篩選，先檢查日期，小於該日期就不放入輸出CSV內
			if(filterDate&&j>0){
				var sellDate = new Date(formatDate(rows[j].children[4].innerText));
				var filterDateInDate = new Date(filterDate)
				filterDateInDate.setHours(0,0,0,0);//因為new Date產生的時間會是早上8點，必須將它設為凌晨12點，才能將起日當天資料全部納入
								
				if(sellDate<filterDateInDate){
					//console.log(filterDateInDate)
					continue;
				}
				
			}
			//若有設定迄日篩選，先檢查日期，大於該日期就不放入輸出CSV內
			if(filterDateEnd&&j>0){
				var sellDate = new Date(formatDate(rows[j].children[4].innerText));				
				var filterDateEndInDate = new Date(filterDateEnd);
				filterDateEndInDate.setHours(23,59,59,999);//因為new Date產生的時間會是早上8點，必須將它設為23:59:59，才能將迄日當天資料全部納入
				
				if(sellDate>filterDateEndInDate){
					continue;
				}
				
			}
			
			
			
			for(var k=0; k<rows[j].children.length; k++){ 
				if(j===0){
					if(k===0){
						row.push(rows[j].children[k].innerText);
						row.push('槓桿倍數');
						row.push('方向');
						row.push('倉別');
					}else if (k===5){
						row.push(rows[j].children[k].innerText);
						row.push('訂單本金單位');	
					}else if (k===8){
						row.push(rows[j].children[k].innerText);
						row.push('跟隨者收益單位');	
						row.push('開倉日');	
						row.push('收倉日');	
						row.push('手續費');	
						row.push('手續費佔本金比例');	
						row.push('扣除手續費收益率');	
						row.push('持倉時間(天)');	
					}
					else{
						row.push(rows[j].children[k].innerText);
					}
				}
				else if(k===0&& j>0){
					//row.push(rows[j].children[k].innerText.replace(/\n/g, ' ').replace(/\(/g, ',').replace(/X\)/g, ','))//取消cell中的換行符號、將(換成逗點、將X)換成逗點，切開槓桿倍數和方向
					row.push(rows[j].children[k].innerText.replace(/空/g, '空,').replace(/多/g, '多,').replace(/ /g, '').replace(/X\n/g, ',').replace(/\n/g, '').replace(/·/g, ','))//在多或空後面加上逗號切開方向，X\n換成逗號(若只換X遇到像AVAX這種幣會跳行)，取消cell中的換行符號，取消空白，將槓桿前面的點換成逗號

				}
				else if (k===5){
					var principleData = rows[j].children[k].innerText
					if (principleData.includes('*****')){
						row.push('100');
					}else{
						//row.push(principleData.replace(/,/g, '').replace(/\n/g, ','))//取代數字大於1000時逗點，因為會造成跳格；cell中的換行符號換成逗號，把本金和跟隨者收益單位切開
						row.push(principleData.replace(/,/g, ''))//取代數字大於1000時逗點，因為會造成跳格；20220706 BingX網頁改版，訂單本金的值已經沒有單位，可直接使用，因此不用切。
						row.push('USDT');//20220706 BingX網頁改版，為了不調整EXCEL格式，手動補上訂單本金單位值為USDT
					}
					
					
				}
				else if (k===8){
					//row.push(rows[j].children[k].innerText.replace(/,/g, '').replace(/\n/g, ','))//取代數字大於1000時逗點，因為會造成跳格；cell中的換行符號換成逗號，把跟隨者收益和跟隨者收益單位切開
					row.push(rows[j].children[k].innerText.replace(/,/g, ''))//取代數字大於1000時逗點，因為會造成跳格；20220706 BingX網頁改版，跟隨者收益的值已經沒有單位，可直接使用，因此不用切
					row.push('USDT');//20220706 BingX網頁改版，為了不調整EXCEL格式，手動補上訂單本金單位值為USDT

					row.push(formatDate(rows[j].children[2].innerText))//開倉日
					row.push(formatDate(rows[j].children[4].innerText))//收倉日
					row.push(getLeverage(rows[j].children[0].innerText)*getPrinciple(rows[j].children[5].innerText)*0.00045);//手續費
					var handlingFeePercent = getLeverage(rows[j].children[0].innerText)*getPrinciple(rows[j].children[5].innerText)*0.00045/getPrinciple(rows[j].children[5].innerText)//手續費佔本金比例
					row.push(Math.round(handlingFeePercent*10000)/100+'%')//手續費佔本金比例換成百分比顯示
					var rateOfRetun = parseFloat(rows[j].children[6].innerText);//parseFloat轉字串時，後面"%"會忽略，直接轉前面數字，所以下面使用時會先除100
					row.push(Math.round((rateOfRetun/100 - handlingFeePercent)*10000)/100+'%');//扣除手續費收益率
					var holdDays = getDateDiffByDays(rows[j].children[2].innerText,rows[j].children[4].innerText)
					row.push(holdDays)//收倉時間-開倉時間=持倉時間
					// console.log('handlingFeePercent:'+handlingFeePercent);
					// console.log('rateOfRetun:'+rateOfRetun);
					
				}
				else{
					row.push(rows[j].children[k].innerText)
				}
				
				//console.log(rows[j].children[k].innerText)
			}
			csvAll.push(row.join(','))
		}
		//console.log(csvAll[0]);
		//console.log(csvAll[5]);
		var csvString = csvAll.join("\n");
		var a         = document.createElement('a');
		a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvString);
		a.target      = '_blank';
		a.download    = 'HistoryOutput.csv';

		document.body.appendChild(a);
		a.click();
		
		
		// var csvHeader = [];

		// for(var j=1; j<rowHeader.length; ++j){ 
			// csvHeader.push(rowHeader[j].innerText);
		// }

		// var csvRows = [];
		
		// csvRows.push(csvHeader);

		// // for(var k=0, l=csvHeader.length; k<l; ++k){
			// // csvRows.push(csvHeader[k].join(','));
		// // }

		// var csvString = csvRows.join("%0A");
		// var a         = document.createElement('a');
		// //a.href        = 'data:attachment/csv,' + csvString;
		// a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvString);
		// a.target      = '_blank';
		// a.download    = 'myFile.csv';

		// document.body.appendChild(a);
		// a.click();
	
}

function outputBinance(){
	
		var rows =document.querySelectorAll('.history .row');
		
		// console.log(rows);
		// return false;
		
		
		var csvAll=[];
		for(var j=0; j<rows.length; j++){ 
			var row = [];
			//若有設定起日篩選，先檢查日期，小於該日期就不放入輸出CSV內
			if(filterDate&&j>0){
				var sellDate = new Date(formatDate(rows[j].children[4].innerText));
				var filterDateInDate = new Date(filterDate)
				filterDateInDate.setHours(0,0,0,0);//因為new Date產生的時間會是早上8點，必須將它設為凌晨12點，才能將起日當天資料全部納入
								
				if(sellDate<filterDateInDate){
					//console.log(filterDateInDate)
					continue;
				}
				
			}
			//若有設定迄日篩選，先檢查日期，大於該日期就不放入輸出CSV內
			if(filterDateEnd&&j>0){
				var sellDate = new Date(formatDate(rows[j].children[4].innerText));				
				var filterDateEndInDate = new Date(filterDateEnd);
				filterDateEndInDate.setHours(23,59,59,999);//因為new Date產生的時間會是早上8點，必須將它設為23:59:59，才能將迄日當天資料全部納入
				
				if(sellDate>filterDateEndInDate){
					continue;
				}
				
			}
			
			
			
			for(var k=0; k<rows[j].children.length; k++){ 
				if(j===0){
					if(k===0){
						row.push(rows[j].children[k].innerText);
						row.push('槓桿倍數');
						row.push('方向');
					}else if (k===5){
						row.push(rows[j].children[k].innerText);
						row.push('訂單本金單位');	
					}else if (k===8){
						row.push(rows[j].children[k].innerText);
						row.push('跟隨者收益單位');	
						row.push('開倉日');	
						row.push('收倉日');	
						row.push('手續費');	
						row.push('手續費佔本金比例');	
						row.push('扣除手續費收益率');	
						row.push('持倉時間(天)');	
					}
					else{
						row.push(rows[j].children[k].innerText);
					}
				}
				else if(k===0&& j>0){
					//row.push(rows[j].children[k].innerText.replace(/\n/g, ' ').replace(/\(/g, ',').replace(/X\)/g, ','))//取消cell中的換行符號、將(換成逗點、將X)換成逗點，切開槓桿倍數和方向
					row.push(rows[j].children[k].innerText.replace(/\n/g, '').replace(/ /g, '').replace(/·/g, ',').replace(/X/g, ','))//取消cell中的換行符號，取消空白，將槓桿前面的點換成逗號，X換成逗號

				}
				else if(k===2){
					//row.push(rows[j].children[k].innerText);
					row.push('--');//因為沒有開倉時間，所以改用--補上
				}
				else if (k===5){
					var principleData = rows[j].children[k].innerText
					if (principleData.includes('*****')){
						row.push('100');
					}else{
						//row.push(principleData.replace(/,/g, '').replace(/\n/g, ','))//取代數字大於1000時逗點，因為會造成跳格；cell中的換行符號換成逗號，把本金和跟隨者收益單位切開
						row.push(principleData.replace(/,/g, ''))//取代數字大於1000時逗點，因為會造成跳格；20220706 BingX網頁改版，訂單本金的值已經沒有單位，可直接使用，因此不用切。
						row.push('USDT');//20220706 BingX網頁改版，為了不調整EXCEL格式，手動補上訂單本金單位值為USDT
					}
					
					
				}
				else if (k===8){
					//row.push(rows[j].children[k].innerText.replace(/,/g, '').replace(/\n/g, ','))//取代數字大於1000時逗點，因為會造成跳格；cell中的換行符號換成逗號，把跟隨者收益和跟隨者收益單位切開
					row.push(rows[j].children[k].innerText.replace(/,/g, ''))//取代數字大於1000時逗點，因為會造成跳格；20220706 BingX網頁改版，跟隨者收益的值已經沒有單位，可直接使用，因此不用切
					row.push('USDT');//20220706 BingX網頁改版，為了不調整EXCEL格式，手動補上訂單本金單位值為USDT

					row.push('--')//開倉日，用--是因為幣安沒有開倉時間
					row.push(formatDate(rows[j].children[4].innerText))//收倉日
					row.push(getLeverage(rows[j].children[0].innerText)*getPrinciple(rows[j].children[5].innerText)*0.00045);//手續費
					var handlingFeePercent = getLeverage(rows[j].children[0].innerText)*getPrinciple(rows[j].children[5].innerText)*0.00045/getPrinciple(rows[j].children[5].innerText)//手續費佔本金比例
					row.push(Math.round(handlingFeePercent*10000)/100+'%')//手續費佔本金比例換成百分比顯示
					var rateOfRetun = parseFloat(rows[j].children[6].innerText);//parseFloat轉字串時，後面"%"會忽略，直接轉前面數字，所以下面使用時會先除100
					row.push(Math.round((rateOfRetun/100 - handlingFeePercent)*10000)/100+'%');//扣除手續費收益率
					row.push('--')//持倉時間，因為沒開倉時間，所以直接給--

					
				}
				else{
					row.push(rows[j].children[k].innerText)
				}
				
				//console.log(rows[j].children[k].innerText)
			}
			csvAll.push(row.join(','))
		}
		//console.log(csvAll[0]);
		//console.log(csvAll[5]);
		var csvString = csvAll.join("\n");
		var a         = document.createElement('a');
		a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(csvString);
		a.target      = '_blank';
		a.download    = 'HistoryOutput.csv';

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


function getLeverage(inputData) {
	var a = inputData.split('·');
	var b = a[1].split('X');
	var leverage = b[0].replace(/,/g, '');//避免1000以上會有千分位逗點問題
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



