var hours = 18;
// web url to access twitter keyword api
//http://api.retinanews.net/tweet/delay/21600/amount/21600
$.getJSON("tweets10pm10am.json", 
	function( data ) {
		console.log("blegh");
		wordCount(data, hours);
	}

);

// this function puts the words grabbed into a bucket and sorts them
function wordCount(data, numBuckets) {
	wordCounter = [];
	sortedWords = [];
	totalWordCount = {};
	keyArr = {};
	for(i=0; i<numBuckets; i++) {
		wordCounter[i] = {};
		sortedWords[i] = {};
	}
	for(i in data) {
		tweet = data[i]
		myBucket = Math.floor((1443300192 - parseInt(tweet["timestamp"]))/3600);
		console.log(myBucket)
		for(j in tweet.keywords) {
			myWord = tweet.keywords[j];
			if (totalWordCount[myWord]) {
				totalWordCount[myWord]++;
			} else {
				totalWordCount[myWord] = 1;
			}
			if(wordCounter[myBucket][myWord]) {
				wordCounter[myBucket][myWord]++;
			} else {
				wordCounter[myBucket][myWord] = 1;
			}
		}
	}
	for (bucket = 0; bucket < numBuckets; bucket++) {
		keys = Object.keys(wordCounter[bucket]).sort(function(a,b) {
			return wordCounter[bucket][b] - wordCounter[bucket][a];
		});
		//console.log(keys);
		keyArr[bucket] = keys;
	}
	//console.log(keyArr);
	for (index in keyArr) {
		keys = keyArr[index];
		counter = 0;
		for (key in keys) {
			word = keys[key];
			if (counter < 20) {
				//$("body").append(word +"->"+wordCounter[index][word] + "  ");
				counter++;
				sortedWords[index][word] = wordCounter[index][word];
			} else {
				break;
			}
		}
		//$("body").append("<br><br>");
	}
	//$("body").append("topWords: ");
	topWordKeys = Object.keys(totalWordCount).sort(function(a,b) {
		return totalWordCount[b]-totalWordCount[a];
	});
	//console.log(topWordKeys)
	topWords = [];
	counter = 0;
	for(topwordkey in topWordKeys) {
		word = topWordKeys[topwordkey];
		if (counter < 20) {
			counter++;
			//$("body").append(word + "->"+totalWordCount[word]);
			topWords.push(word);
		} else {
			break;
		}
	}
	console.log(topWords);
	// keysSorted = Object.keys(wordCounter).sort(function(a,b) {
	// 	return wordCounter[b] - wordCounter[a];
	// });
	
	// for(index in keysSorted) {
	// 	word = keysSorted[index]
	// 	$('body').append("<p>" + word + "->" + wordCounter[word] + '</p>')
	// }
	drawStackedGraph();

}