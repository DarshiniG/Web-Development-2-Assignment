var request = require('request')

//#######search for movie in home page#######
exports.search = function(query, callback) { //callback is an output parameter, kind of a return parameter (see #)
  console.log('inside movies.search(' + query + '....)')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, status:'Bad URL', message:'No word for query', data:null})	//# create an object and return it via callback
  }


	//line 12-13: compose a request to an exteranl Web API
  	//line 12-13: compose a request to an exteranl Web API
	const apikey = '841bd11e480bb95e7f8ec6294d7262b2'
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=' +apikey + '&language=en-US&page=1&include_adult=false' + '&query="' + query
  request.get({url: url}, function(err, res, body) {	//function executed on receiving respond from Web API
    if (err) {
    	console.log('Google Search failed')
      callback({code:500, status:'Error', message:'Google Search failed', data:err})
    }

    const json = JSON.parse(body)	//convert body to object
    const results = json.results
    if (results){
	    const movies = results.map(function(element) {
	      obj = {id:element.id, title:element.title, original_title:element.original_title, status:element.status,
	             revenue:element.revenue, overview:element.overview, original_language:element.original_language, 
	             poster_path:element.poster_path, release_date:element.release_date,
	              
	              }

	    	return obj
	    })
	    console.log(movies.length +' movies found')
	    callback({code:200, status:'Success', message:movies.length+' books found', data:movies})
    }
    else
    	callback({code:200, status:'Success', message:'No movie found', data:''})
  })
}

//#######search for movie in now playing movies in now showing page#######

exports.nowMovies = function(query, callback) { //callback is an output parameter, kind of a return parameter (see #)
  console.log('inside movies.search(' + query + '....)')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, response:{status:'error', message:'No word for query'}})	//# create an object and return it via callback
  }

	//line 12-13: compose a request to an exteranl Web API
	const apikey = '841bd11e480bb95e7f8ec6294d7262b2'
  const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' +apikey + '&language=en-US&page=1'

  request.get({url: url}, function(err, res, body) {	//function executed on receiving respond from Web API
    if (err) {
    	console.log('Google Search failed')
      callback({code:500, response:{status:'error', message:'Search failed', data:err}})
    }


    const json = JSON.parse(body)	//convert body to object
    const items = json.results
    if (items){
	    const movies = items.map(function(element) {
	     return {title:element.title, release_date:element.release_date, original_language:element.original_language, overview:element.overview, id:element.id, poster_path:element.poster_path}// creating a object will be my json response
	    })
	    console.log(movies.length +' movies found')
	    callback({code:200, response:{status:'success', message:movies.length+' movies found', data:movies}})
    }
    else
    	callback({code:200, response:{status:'success', message:'No movie found', data:''}})
  })
}

//#######search for movie in upcoming movies in coming soon page#######

exports.comingMovies = function(query, callback) { //callback is an output parameter, kind of a return parameter (see #)
  console.log('inside movies.search(' + query + '....)')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, response:{status:'error', message:'No word for query'}})	//# create an object and return it via callback
  }

	//line 12-13: compose a request to an exteranl Web API
	const apikey = '841bd11e480bb95e7f8ec6294d7262b2'
  const url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=' +apikey + '&language=en-US&page=1'

  request.get({url: url}, function(err, res, body) {	//function executed on receiving respond from Web API
    if (err) {
    	console.log('Google Search failed')
      callback({code:500, response:{status:'error', message:'Search failed', data:err}})
    }


    const json = JSON.parse(body)	//convert body to object
    const items = json.results
    if (items){
	    const movies = items.map(function(element) {
	     return {title:element.title, release_date:element.release_date, overview:element.overview, id:element.movie_id, poster_path:element.poster_path}// creating a object will be my json response
	    })
	    console.log(movies.length +' movies found')
	    callback({code:200, response:{status:'success', message:movies.length+' movies found', data:movies}})
    }
    else
    	callback({code:200, response:{status:'success', message:'No movie found', data:''}})
  })
}

//#######for more movie detail  page#######

exports.searchMovieInfo = function(movieid, callback) { //callback is an output parameter, kind of a return parameter (see #)
  console.log('inside movies.searchMovieInfo(' + movieid + '....)')
  if (typeof movieid !== 'string' || movieid.length === 0) {
  	console.log('No word for query')
    callback({code:400, status:'Bad URL', message:'No movie id specified', data:null})	//# create an object and return it via callback
  }

  //line 12-13: compose a request to an exteranl Web API
	const apikey = '841bd11e480bb95e7f8ec6294d7262b2'

  const url = 'https://api.themoviedb.org/3/movie/'+movieid+'?api_key=' +apikey + '&language=en-US'

  request.get({url: url}, function(err, res, body) {	//function executed on receiving respond from Web API
    if (err) {
    	console.log('Movie not found')
      callback({code:500, status:'Error', message:'No such Movie', data:err})
    }

    const gMovie = JSON.parse(body)	//convert body to object
    if (gMovie != null){
		  var movie ={ id:gMovie.id, title:gMovie.title, original_title:gMovie.original_title, status:gMovie.status,
		              revenue:gMovie.revenue, overview:gMovie.overview, original_language:gMovie.original_language, 
		               poster_path:gMovie.poster_path, release_date:gMovie.release_date
	             
	              }



	    console.log(movie.title +' found')
	    callback({code:200, status:'Success', message: 'Movie found', data:movie})
    }
    else
    	callback({code:404, status:'Movie not found', message:'Movie not found', data:''})
  })
}
