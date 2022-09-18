//取得查看更多按鈕


var isMoreData=true

var finalData=[];
var finalDataDetail=[];
var timeoutBase=1200;

var filterDate;
var filterDateEnd;
var count;
var	isBinance;




(function() {

    // Want to retrieve the parameter passed from eventpage.js here

    chrome.runtime.onMessage.addListener(function(message) {
        var receivedParameter = message.myVar;

		// filterDate=message.myVar[0];
        // filterDateEnd=message.myVar[1];
		// count=message.myVar[2];
		// timeoutBase=message.myVar[3]*1000;//每次點擊耗費多少秒


    });

})();


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

	var tabFollowActivate =  document.getElementsByClassName("tab active");
	//console.log(tabFollowActivate[0].outerText);
	if(tabFollowActivate[0].outerText !== '歷史交易')
	{
		alert('請點選歷史交易');
		return false;
		
	}

	//console.log(data[0].children[0].innerText);
	//確認跟單紀錄有幾頁
	var getPages = document.querySelectorAll('div[data-v-29b986e6].el-pagination');
	var pageMax=1;
	
	//抓標題資料
	var tableHeader  = document.querySelectorAll('div[data-v-825276b0].header'); 
	finalData.push(tableHeader[0]);
	
	
	if(getPages.length===0){
		//只有一頁
		await clickDropDownFunction(0);//展開明細
		var data = document.querySelectorAll('div[data-v-57eb747a].line');
		var dataDetail = document.querySelectorAll('div[data-v-3dae49ce].card');
		
		for(let i = 0; i < data.length; i++){
			finalData.push(data[i]);
		}
		
		for(let j = 0; j < dataDetail.length; j++){
			finalDataDetail.push(dataDetail[j]);
		}
		
		await outputExcel(0);

	}else{
		//有很多頁
		var currentPageNumber = document.querySelectorAll('li.number.active');
		if(currentPageNumber[0].innerText !== '1')
		{
			alert('請點擊第一頁再進行全部輸出');
			return false;
			
		}

		
		var pageNumbers =  document.querySelectorAll('li.number');
		// console.log(pageNumbers)
		// console.log(pageNumbers[pageNumbers.length-1].innerText)
		pageMax = pageNumbers[pageNumbers.length-1].innerText;
		

		for(let i = 0; i < pageMax; i++){
			//console.log(i)	
			

			// if(i<2){
				// await clickFunction(i+1);
			// }else{
				// await clickFunction(i);
			// }
			await clickDropDownFunction(1);
			await clickFunction(1);//因為會等他做完，直接用1帶入即可
			
			
			console.log('pushdata') 
			var data = document.querySelectorAll('div[data-v-57eb747a].line');
			var dataDetail = document.querySelectorAll('div[data-v-3dae49ce].card');
			

			for(let j = 0; j < data.length; j++){
				finalData.push(data[j]);
			}
			
			for(let j = 0; j < dataDetail.length; j++){
				finalDataDetail.push(dataDetail[j]);
			}


			// console.log(finalData.length);
			// console.log(finalData[0].children[1].innerText);
			
		   if(i===pageMax-1){

			 await outputExcel(1);//直接用1，因為上面會做完後再輸出

			 //console.log(finalDataDetail[1].children);
		   }
		}
    
		
		// var btnNextDisable = document.querySelectorAll('button[disabled="disabled"].btn-next');//最後一頁時btn-next會disable
		// var btnNext = document.querySelectorAll('.btn-next');
		//btnNext[0].click()
	}
	

	
	//var finalData=[];
	// finalData.push(data[0]);
	// var btnNext = document.querySelectorAll('.btn-next');
	// btnNext[0].click()
	// data = document.querySelectorAll('div[data-v-57eb747a].line');
	// finalData.push(data[0]);
	// console.log(finalData.length);
	// console.log(finalData[0].children[1].innerText);
	// console.log(finalData[1].children[1].innerText);

	

	
	
	//console.log(isBinance.toString())
	
	//確認是否為幣安合約
	// var tabActivate =  document.getElementsByClassName("tab actived");
	// if(tabActivate[0].outerText==='Binance-1 合約' || tabActivate[0].outerText==='BingX 專業合約')
	// {
		// isBinance=true;
	// }else
	// {
		// isBinance=false;
	// }

	// var getButtonResult = document.getElementsByClassName("more");
	
	// if(getButtonResult.length===0){
		// alert('請點選歷史交易');
		// return false;
	// }
	

	//alert('finish');
}



function clickFunction(i){
	return new Promise((resolve,reject)=>{//用promise才有辦法讓呼叫clickFunction的程式等他完成才進行下一步
		setTimeout(() => {
		console.log('into clickFunction') 
		var btnNextDisable = document.querySelectorAll('button[disabled="disabled"].btn-next');//最後一頁時btn-next會disable
		if(btnNextDisable.length>0){
			
		}else{
			var btnNext = document.querySelectorAll('.btn-next');
			btnNext[0].click()
			console.log('clickFinish') 
		}
		
		resolve();
		

		
		}, timeoutBase*i );
	});
    
}

//展開每一筆下拉選單
function clickDropDownFunction(i){
	return new Promise((resolve,reject)=>{//用promise才有辦法讓呼叫clickDropDownFunction的程式等他完成才進行下一步
		setTimeout(() => {
		console.log('into clickDropDownFunction') 
		var btnDropDown = document.querySelectorAll('div[data-v-57eb747a].icon-fold');
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
		
		outputBingX();
		
		
    }, timeoutBase*i);
}

function outputBingX(){
	
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
					}else if (k===1){
						row.push(finalData[j].children[k].innerText);
						row.push('收益百分比');	
					}else if (k===4){
						row.push(finalData[j].children[k].innerText);
						row.push('保證金單位');	
					}else if (k===5){
						row.push(finalData[j].children[k].innerText);
						row.push('交易總額單位');	
						row.push('槓桿倍數');
					}
					else{
						row.push(finalData[j].children[k].innerText);
					}
				}
				else if(k===0){
					row.push(finalData[j].children[k].innerText.replace(/空/g, '空,').replace(/多/g, '多,').replace(/\/USDT/g, '\/USDT,').replace(/\n/g, '').replace(/ /g, ''))//在多或空後面加上逗號切開方向，在/USDT後面加上逗號，取消cell中的換行符號，取消空白


				}
				else if (k===1){
					row.push(finalData[j].children[k].innerText.replace(/\(/g, ',').replace(/\)/g, '').replace(/\n/g, ''))//將(換成逗點、將)拿掉，區分收益和收益百分比，並將前後換行符號拿掉
					
				}
				else if (k===4 || k===5){
					
					row.push(finalData[j].children[k].innerText.replace(/ /g, '').replace(/USDT/g, ',USDT').replace(/VST/g, ',VST').replace(/\n/g, ''))//將空白取消，將USDT(VST)換成USDT(VST)+逗點，將保證金和交易總額之數字與單位分開，並取消換行符號
					
					
				}
				else if (k===6){
					//下拉展開按鈕也包含在children內，因此在k===6時要避免放入，並改用槓桿取代
					var leverage = getLeverage(finalData[j].children[4].innerText,finalData[j].children[5].innerText);
					row.push(leverage);
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
					}else{
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
							row.push(originData);//push兩次是因為切成兩個欄位
						}else{
							originData=originData.replace(/ /g, '').replace(/\(/g, ',').replace(/\)/g, '');//將(換成逗點、將)拿掉，區分止損(盈)百分比和止損(盈)價，並將空白拿掉
							row.push(originData);
						}
						
					}else{
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


 mainLoop();
