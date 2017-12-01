/*global angular  */

/* we 'inject' the ngRoute module into our app. This makes the routing functionality to be available to our app. */
//NB: ngRoute module for routing and deeplinking services and directives
var myApp = angular.module('myApp', ['ngRoute'])


myApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
		  templateUrl: 'templates/home.html',
      controller: 'homeController'
		})
		 .when('/search', {
      templateUrl: 'templates/search.html',
      controller: 'searchController'
    })
    .when('/nowshowing', {
      templateUrl: 'templates/nowshowing.html',
      controller: 'nowshowingController'
    })
    .when('/comingsoon', {
		  templateUrl: 'templates/comingsoon.html',
      controller: 'comingsoonController'
		})
	.when('/details/:id', {
      templateUrl: 'templates/details.html',
      controller: 'detailsController'
    })
	.when('/critics', {
		  templateUrl: 'templates/critics.html',
      controller: 'criticsController'
		})
    .when('/favourites', {
      templateUrl: 'templates/favourites.html',
      controller: 'favouritesController'
    })
    .when('/trailers', {
		  templateUrl: 'templates/trailers.html',
      controller: 'trailersController'
		})
		.otherwise({
		  redirectTo: 'home'
		})
	}])

myApp.controller('homeController', function($scope, $http) {
  $scope.message = 'This is the home screen'

})

myApp.controller('searchController', function($scope, $http) {
  $scope.message = 'This is the home screen'


  $scope.reqPost = function(req, res){
    
  	var url = 'https://cinemas-phoenix-guhadarshini.c9users.io/movies'
  	console.log('POST ' +url)
  	$http.post(url).success(function(response) {
      console.log(response)
  	})
  }

  $scope.search = function($event) {
    console.log('search()')
    if ($event.which == 13 || $event.which == 112) { // enter key presses
      var searchTerm = $scope.searchTerm
      var url = ''
      if ($event.which == 13)
      	url = 'https://api.themoviedb.org/3/search/movie?api_key=841bd11e480bb95e7f8ec6294d7262b2&language=en-US&page=1&include_adult=false&query='+searchTerm
      else if($event.which == 112)
      	url = 'https://cinemas-phoenix-guhadarshini.c9users.io/movies?q='+searchTerm

      console.log(url)
      $http.get(url).success(function(resp) {
        console.log(resp)
        if (resp.data)
        	$scope.movies = resp.data
        else if (resp.results)
        	$scope.movies = resp.results
          $scope.searchTerm = ''
      })
    }
  }

})

myApp.controller('nowshowingController', function($scope, $http) {
  $scope.message = 'This is the now playing screen'
  console.log('myAPI GET /search')
  var url ='https://cinemas-phoenix-guhadarshini.c9users.io/movies/now_playing'
  $http.get(url).success(function(resp) {
	  console.log(resp.message);
	  $scope.movies = resp.data;
	  $scope.nowTerm=''
  })


})

myApp.controller('comingsoonController', function($scope, $http) {
  $scope.message = 'This is the comingsoon screen'
  console.log('myAPI GET /search')
  var url ='https://cinemas-phoenix-guhadarshini.c9users.io/movies/upcoming'
  $http.get(url).success(function(resp) {
	  console.log(resp.message);
	  $scope.movies = resp.data;
	  $scope.comingTerm=''
  })


})

myApp.controller('detailsController', function($scope,  $routeParams, $http, $window) {
  $scope.message = 'This is the detail screen'
  $scope.id = $routeParams.id


  var url = 'https://cinemas-phoenix-guhadarshini.c9users.io/movies/find/' +  $scope.id
  //var url = 'https://www.googleapis.com/books/v1/volumes/' + $scope.id
  $http.get(url).success(function(rspMovie) {
  	if (rspMovie.code == 200){
	    console.log(rspMovie.message + $scope.id)
	    $scope.message = rspMovie.message
	    $scope.movie = {}
	  $scope.movie.title=rspMovie.data.title
	  $scope.movie.original_title= rspMovie.data.original_title
    $scope.movie.overview= rspMovie.data.overview
    $scope.movie.original_language= rspMovie.data.original_language
    $scope.movie.release_date= rspMovie.data.release_date
    $scope.movie.poster_path= rspMovie.data.poster_path
    $scope.movie.revenue=rspMovie.data.revenue
    $scope.movie.status=rspMovie.data.status
  	}
  	else
  		$window.alert(rspMovie.message)
  })

	$scope.postLike = function(like) {
		if (like===1 || like===-1) {
			var data = {}
			data.like = like
			$http.post(url, data).success((resp) => {
					$window.alert(resp.message + '\n Likes:' + resp.like + '  Dislikes:' + resp.dislike)
			})
		}
	}

  $scope.addToFavourites = function(id,title) {
    console.log('adding: '+id+' to favourites.')
    localStorage.setItem(id, title)
  }
})

myApp.controller('criticsController', function($scope, $http) {
  $scope.message = 'This is the news screen'

  var url ='https://api.nytimes.com/svc/movies/v2/reviews/all.json?api-key=13b74870fbb74ce2b1c62ee0e4321c97'
  $http.get(url).success(function(response) {
	  console.log(response);
	  $scope.movies = response;
  })

})

myApp.controller('favouritesController', function($scope, $http) {
  $scope.message = 'This is the favourite screen'

  console.log('fav controller')
  $scope.message = 'This is the favourites screen'
  var init = function() {
    console.log('getting movies')
    var items = new Array();		//alt: = []; for blank array obj
    //for (var key in localStorage) {	//for-in will include key, getItem, setItem, removeItem, clear & length
    for(var i = 0; i < localStorage.length; i++) {
    	var key = localStorage.key(i);	//native methods are ignored
    	var obj = {};
    	//items.push( {key: localStorage.getItem(key)} )  //TRY1 {key: ...} forced to hardcode key
    	//items.push(obj[key] = localStorage.getItem(key))	//TRY2 {dym-key: ...} hard to code in <ng-repeat>
    	items.push({id: key, title:localStorage.getItem(key)})  //TRY3 OK
      //alt: items[key] = localStorage[key]
    }
    console.log(items)
    $scope.movies = items
  }
  init()

  $scope.delete = function(id) {
  	localStorage.clear()
    console.log('deleting id '+id)
  }
  $scope.deleteAll = function(){ localStorage.clear(); init();}

});



myApp.controller('trailersController', function($scope, $http) {
  $scope.message = 'This is the trailers screen'

   var url ='https://www.googleapis.com/youtube/v3/search?key=AIzaSyDD5oCOXQYipA7KOeIldRGQqHMvPrVoroY&channelId=UCi8e0iOVk1fEOogdfu4YgfA&part=snippet,id&order=date&maxResults=20'
  $http.get(url).success(function(response) {
	  console.log(response);
	  $scope.movies = response;
  })


})




