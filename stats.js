window.ADDRESS = "error";

function loadAddress(callback)
{
	function onDataLoad(data)
	{
		window.ADDRESS = data.address;
		callback();
	}
	
	let getting = browser.storage.sync.get("address");
	getting.then(onDataLoad);
}

function httpGetAsync(theUrl, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function setBalance(value)
{
	//NUMERICAL OPERATIONS
	document.getElementById('progress').value = value * 1000000000000;
	
	//TEXT OPERATIONS
	value = value.toString();
	let work = 12 - value.split(".")[1].length;
	while(work > 0)
	{
		value += "0";
		work -= 1;
	}
	document.getElementById('balance').innerHTML = value + " XMR";
}

function setThold(value)
{
	//NUMERICAL OPERATIONS
	document.getElementById('progress').max = value * 1000000000000;
	
	//TEXT OPERATIONS
	value = value.toString();
	document.getElementById('thold').innerHTML = value + " XMR";
}

function setLast(elementID, timestamp)
{
	const date = new Date(timestamp * 1000);
	document.getElementById(elementID).innerHTML = ("0" + date.getDate()).substr(-2) + "-" + ("0" + (date.getMonth() + 1)).substr(-2) + "-" + date.getFullYear() + " " + ("0" + date.getHours()).substr(-2) + ":" + ("0" + date.getMinutes()).substr(-2);
}

function setWorker(workerName)
{
	let comment = document.getElementById('lastWorker');
	if(workerName == ''){
		comment.style = "display: none;";
		comment.innerHTML = "";
	}
	else{
		comment.style = "";
		comment.innerHTML = "<br/>by " + workerName;
	}
}

function wid_stats(response)
{
	//window.alert(ADDRESS);
	response = JSON.parse(response);
	let lastShare = 0;
	let lastWorker = '';
	let main = response[0];
	for(var key in response)
	{
		if(response[key].address == window.ADDRESS){
			main = response[key];
		}
		
		if(response[key].lastShare > lastShare){
			lastShare = response[key].lastShare;
			lastWorker = response[key].address.substr(96);
		}
	}

	main.thold /= 1000000000000;
	main.balance /= 1000000000000;
	
	setThold(main.thold);
	setBalance(main.balance);
	setLast('lastShare', lastShare);
	setWorker(lastWorker);
}

function pool_stats(response)
{
	response = JSON.parse(response);
	setLast('lastBlock', response.pool.lastBlockFound / 1000);
}

function copyAddressToClipboard()
{
	const input = document.createElement("input");
	document.body.appendChild(input);
	input.value = window.ADDRESS;
	input.select();
	document.execCommand("copy");
	document.body.removeChild(input);
}

//────────────────────────────────────────────────────────────────────────\\
//────────────────────────────────────────────────────────────────────────\\

loadAddress(() => {
	httpGetAsync('https://minexmr.com/api/pool/get_wid_stats?address=' + window.ADDRESS, wid_stats);
	document.getElementById('copyAddress').addEventListener('click', copyAddressToClipboard);
});
httpGetAsync('https://minexmr.com/api/pool/stats', pool_stats);

//────────────────────────────────────────────────────────────────────────\\
//────────────────────────────────────────────────────────────────────────\\

let keepUpdated = window.setInterval(() => {
	httpGetAsync('https://minexmr.com/api/pool/get_wid_stats?address=' + window.ADDRESS, wid_stats);
	httpGetAsync('https://minexmr.com/api/pool/stats', pool_stats);
}, 15000);

