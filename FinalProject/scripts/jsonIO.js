//
// Get data from json_data.txt
function jsonGetData() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "json_data.txt", true);
	xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			Main.screens['game-play'].registerInputs(JSON.parse(this.responseText));
		}
	};
	xmlhttp.send();
}

//
// Download data to json_data.txt
function jsonWriteData(data) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', '/json_data_write', true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
	xmlhttp.setRequestHeader('Cache-Control', 'no-cache');
    xmlhttp.onload = function() {
		// Do nothing
    };
    xmlhttp.send(JSON.stringify(data));
}
