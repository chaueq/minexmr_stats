function save()
{
	browser.storage.sync.set({
		address: document.getElementById('address').value
	});
	
	window.alert('Address saved');
}

function loadSettings()
{
	function onDataLoad(data)
	{
		document.getElementById('address').value = data.address;
	}
	
	let getting = browser.storage.sync.get("address");
	getting.then(onDataLoad);
}

document.getElementById('save').addEventListener('click', save);
loadSettings();
