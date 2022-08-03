require('dotenv').config()
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');




var action = function(bruiser, functionData) {
    switch(bruiser){
    case 'my-tweets' :
      myTweets();
      break;
    case 'spotify-this-song' :
      myMusic();
      break;
    case 'movie-this' :
      myMovie();
      break;
    case 'do-what-it-says' :
      doWhat();
      break;  
      default:
      console.log("Liri doesnt recognize that command");
  }
};
var baylor = function(mapp, ohio) {
  action(mapp, ohio);
};

baylor(process.argv[2], process.argv[3]);


//twitter feed
function myTweets(){
	var client = new Twitter(keys.twitter);
	var params = {
		screen_name: "e5_baylor"
		};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < 20; i++) {
				console.log(tweets[i].created_at + " You tweeted: " + tweets[i].text);
			}
		}
	});	
};


// ombd request
function myMovie(){
	// pieces together movie title argvs 
	if (process.argv[3] != '' && process.argv[3] != null){
		movieTitle = process.argv[3].trim();
	}
	else {
		//if no input display mr nobody
		movieTitle = 'Mr.+Nobody';
	}
	
	var movieSearch;
	var movieUrl = 'http://www.omdbapi.com/?t=' + movieTitle +'&y=&plot=short&apikey=trilogy';

		request(movieUrl, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				movieSearch = JSON.parse(body);

				console.log("\n-------------\n");
				console.log("The Title: " + movieSearch.Title);
				console.log("The Year: " + movieSearch.Year);
				console.log("The IMDB Rating: " + movieSearch.imdbRating);
				console.log("The Country: " + movieSearch.Country);
				console.log("The Language: " + movieSearch.Language);
				console.log("The Plot: " + movieSearch.Plot);
				console.log("The Actor(s): " + movieSearch.Actors);
				console.log("The Rotten Tomatoes Rating: " + movieSearch.Ratings[1].Value);
				console.log("\n-------------\n");
			}
		});

}


// spotify request
function myMusic() {
	var spotify = new Spotify(keys.spotify);


	var querySong;
	if (process.argv[3] != '' && process.argv[3] != null) {
		 var querySong = process.argv[3];
	} 
	
	else {
		var querySong = "The Sign";
	}
	// searching in spotify 
	spotify.search({ type: 'track', query: querySong }, function(err, data) {
    	if (err) {
    		console.log('Error: ' + err);
    		return;
    	}
    	var mySong = data.tracks.items;
    	// loop through results
    	for (var i=0; i < mySong.length; i++){
    		console.log(i+1);
    		console.log('artist(s): ' + mySong[i].artists[0].name);
    		console.log('song name: ' + mySong[i].name);
    		console.log('album: ' + mySong[i].album.name);
    		console.log('preview song: ' + mySong[i].preview_url);
    		
    	}
    	 
	});
}

function doWhat (){
	fs.readFile("random.txt", "utf8", function(error, data){
    console.log(data);

    var infoArr = data.split(",");

    if (infoArr.length === 2) {
      action(infoArr[0], infoArr[1]);
    }
    else if (infoArr.length === 1) {
      action(infoArr[0]);
    }
  });
};








