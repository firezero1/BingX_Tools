// Initialize butotn with users's prefered color
//let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
  // changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // chrome.scripting.executeScript({
    // target: { tabId: tab.id },
    // function: setPageBackgroundColor,
  // });
// });

// The body of this function will be execuetd as a content script inside the
// current page




function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

// function injectTheScript() {
    // // Wuery the active tab, which will be only one tab and inject the script in it.
    // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        // chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['content_script.js']
		
		// })
    // })
// }

function injectTheScript() {
    // Wuery the active tab, which will be only one tab and inject the script in it.
	// var filterDate = document.getElementById('filterDate').value
	// var filterDateEnd = document.getElementById('filterDateEnd').value
	// var clickCount = document.getElementById('clickCount').value 
	// var clickSpeed = document.getElementById('clickSpeed').value 
	
	//alert(isBinance);
	
	
	

	var parameterArray = [];
	// parameterArray.push(filterDate);
	// parameterArray.push(filterDateEnd);
	// parameterArray.push(clickCount);
	// parameterArray.push(clickSpeed);

	
	
	
	myFunction();
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
       chrome.scripting.executeScript({target: {tabId: tabs[0].id}, files: ['content_script.js']}, 
	   function() {
			chrome.tabs.sendMessage(tabs[0].id, {myVar: parameterArray});
		});
    })
}

function myFunction() {

	var btn = document.getElementById('clickactivity')
	// var clickCount = document.getElementById('clickCount').value 
	// var clickSpeed = document.getElementById('clickSpeed').value 

	btn.disabled = true;
	//btn.style.background='#ff0033'
	 setTimeout(()=>{
		btn.disabled = false;
		}, 2000)
}


document.getElementById('clickactivity').addEventListener('click', injectTheScript)

