/*
controlChildNode values for the trackList
7 - playback_count
8 - download_count
9 - favoritings_count

*/
/*
controlChildNode values for the followerList table representation (on two views: followers / followings)
0 - id
5 - track_count
6 - playlist_count
7 - followers_count
8 - followings_count

*/
/*
analyserTableNode - a childNode address number for an element representing table in DOM (values may change depending on html layout for tables):
0 - followerList
3 - trackList
*/
//controlChildNode - a childNode address number for a control sorting element in relevant table (trackList, followerList) in DOM
function sortTable(analyserTableNode,controlChildNode){
	var tbl = document.getElementById("analyser").childNodes[analyserTableNode];
	//alert(tbl.innerHTML);
	//alert(tbl.childNodes.length);
	var store = [];
	for(var i=1, len=tbl.childNodes.length; i<len; i++){
		// select row contents
		var row = tbl.childNodes[i];
		//alert(row.innerHTML);
		// write sortener value for corresponding row
		var sortnr = parseFloat(row.childNodes[controlChildNode].innerHTML);
		//alert(sortnr);
		if(!isNaN(sortnr)) store.push([sortnr, row]);
	}
	store.sort(function(x,y){
		return x[0] - y[0];
	});
	for(var i=0, len=store.length; i<len; i++){
		tbl.appendChild(store[i][1]);
	}
	store = null;
}