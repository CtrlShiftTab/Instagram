 
function notEmpty(){
	var myTextField = document.getElementById('myText');
	var myTestField = document.getElementById('myTest');
	
	if(myTextField.value != "" && myTestField.value != ""){
		var args = {user:myTextField.value, limit:myTestField.value, callback:displayInstaBlocks, params:"kargoeBlock"};		 
		var foo = document.getElementById("kargoeBlock");
		if (foo.hasChildNodes()) {foo.removeChild(foo.childNodes[0]);}
		var fetcher = new Instafetch('81e3d3f35c8a4438964001decaa5a31f');
		fetcher.fetch(args);
	}else{
		alert("Would you please enter some text?")
	}
	this.jsn = false;
}

function notSoEmpty(){
	var myTextField = document.getElementById('myText');
	var myTestField = document.getElementById('myTest');
	
	if(myTextField.value != "" && myTestField.value != ""){
		var args = {user:myTextField.value, limit:myTestField.value, callback:displayInstaBlocks, params:"kargoeBlock"};
		var fetcher = new Instafetch('81e3d3f35c8a4438964001decaa5a31f');
		fetcher.fetch(args);
	}else{
			alert("Would you please enter some text?")
	}
	this.jsn = true;
}


	// Bare bone callback
var logResults = function(response, params) {
	console.log(response);
	console.log(params);
};

	// Will display the results in square divs
var displayInstaBlocks = function(response, params) {
	var data = response.data;
	
	// JSON OUTPUT
	if(jsn){
		var json = syntaxHighlight(JSON.stringify(data,undefined,4));
		var html = "<head><style>pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; } .string { color: green; } "; 
		html+= " .number { color: darkorange; } .boolean { color: blue; } .null { color: magenta; } .key { color: red; }</style></head><body>"; 
		html+= "<a href='javascript:history.go(-1)'>[Go Back]</a><br><br><pre>"+json+"</pre>"; 
		document.write(html);
		return;
	}
	//
	console.log(json);
	
	var blockList = document.createElement('ul');
	for(var i = 0; i < response.data.length; i++) {
		// List Item
		var listItem = document.createElement('li');	
		// Anchor
		var anchor = document.createElement('a');
		anchor.className += ' instaPop';
		anchor.href = "#instaPop-" + params + i.toString();
		// Hidden Inline element
		var popupContainer = document.createElement('div');
		popupContainer.id = "instaPop-" + params + i.toString();
		popupContainer.className += 'lightboxblock mfp-hide';
        //
        // Get the image
        var bigImg = document.createElement('img');
        bigImg.src = response.data[i].images.standard_resolution.url;
        //
        // Get all hashtags
        var hashtagStr = "";
        for (var j = 0; j < response.data[i].tags.length; j++) 
		{
          hashtagStr += '#' + response.data[i].tags[j] + ' ';
		}
        var hashtags = document.createElement('p');
        var hashtagsText = document.createTextNode(hashtagStr);
        hashtags.appendChild(hashtagsText);
		// Get all the captions		
		var captionStr = "";
		if (response.data[i].caption != null) {
			captionStr = response.data[i].caption.text;
		}else{
			captionStr = "";
		}
		var caption = document.createElement('p');
        var captionText = document.createTextNode(captionStr);
        caption.appendChild(captionText);
		//
		
		
        // Get the likes and comments
        var lcDiv = document.createElement('div');
        lcDiv.className += "statsDiv";
        var likesp = document.createElement('p');
        var commentsp = document.createElement('p');
        var likes = document.createTextNode(response.data[i].likes.count);
        var comments = document.createTextNode(response.data[i].comments.count);
		
		

        var likeImg = document.createElement('div');
        likeImg.className += ' instaLike';
        var commentImg = document.createElement('div');
        commentImg.className += ' instaComment';

        likesp.appendChild(likes);
		//NOTE Comments could be included on demand
        //commentsp.appendChild(comments);
        lcDiv.appendChild(likeImg);
        lcDiv.appendChild(likesp);
        //lcDiv.appendChild(commentImg);
        //lcDiv.appendChild(commentsp);

		popupContainer.appendChild(bigImg);
		popupContainer.appendChild(caption);
		popupContainer.appendChild(lcDiv);


        // Image
        var instaImg = document.createElement('img');
        instaImg.src = response.data[i].images.low_resolution.url;

		anchor.appendChild(instaImg);
		anchor.appendChild(popupContainer);
		listItem.appendChild(anchor);
		blockList.appendChild(listItem);
	}
	
	document.getElementById(params).appendChild(blockList);

	// When clicked, the popup appears
	$('.instaPop').magnificPopup({
		type:'inline',
		midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
	});
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
