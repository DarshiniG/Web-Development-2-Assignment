var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/* the database name is stored in a private variable instead of being 'hard-coded' so it can be replaced using the 'rewire' module. This avoids the need for the unit tests to run against the 'live' database. */
var mvdatabase = 'api'
/* the server connections string includes both the database server IP address and the name of the database. */
const server = 'mongodb://'+process.env.IP+':27017/'+mvdatabase
console.log(server)
/* the mongoose drivers connect to the server and return a connection object. */
mongoose.connect(server)
const db = mongoose.connection
/* END OF MONGOOSE SETUP */


/* all documents in a 'collection' must adhere to a defined 'schema'.
Here we define a new schema that includes a mandatory string and an array of strings. */
const QuerySchema = new mongoose.Schema({
    query: { type: String, required: true },
    count: {type: Number, required: true },
    results: [ {type: String} ]
})
const MovieSchema = new mongoose.Schema({
		id: {  type: String, required: true },
    title: { type: String, required: true },
    original_title: { type: String, required: true },
    status: { type: String, required: true },
    revenue: {type: String, required: true } ,
    overview: {type: String, required: true},
    original_language: { type: String, required: true },
    poster_path: {type:String, required: true},
    release_date: {  type: String, required: true },
    like: {type: Number},
    dislike: {type: Number}
})
/* the schema is associated with the 'Query' collection which means it will be
applied to all documents added to the collection. */
const Query = mongoose.model('Query', QuerySchema)
const Movie = mongoose.model('Movie', MovieSchema)
/* END OF DEFINING SCHEMA */




/* notice we are using the 'arrow function' syntax. In this example there are
more than one parameter so they need to be enclosed in brackets. */
exports.addQuery = (mvdata, callback) => {
  console.log('addQuery()...');
  /* now we have extracted the data we can use it to create a new 'Query' object that adopts the correct schema. */
  const newQuery = new Query({ query: mvdata.query, count: mvdata.data.length, results:JSON.stringify(mvdata.data)  });
  newQuery.save( (err, data) => {
    if (err)
      callback('Error: '+err);
    else
      callback('Query results saved');
  })
}

exports.addMovie = (mvData, callback) => {
  console.log('addMovie()...');
  mvData.like = 0;
  mvData.dislike = 0;
  var newMovie = new Movie({ id: mvData.id, title: mvData.title, original_title: mvData.original_title,
                 status: mvData.status, revenue: mvData.revenue, overview: mvData.overview, original_language: mvData.original_language,
                 poster_path: mvData.poster_path, release_date:mvData.release_date
  });
  newMovie.save( (err, data) => {
    if (err)
      callback('Error: '+err);
    else
      callback('Movie info saved');
  })
}

exports.setLikes = (vote, callback) => {
	Movie.findOne({id: vote.id}, (err, movie) => {
			if (vote.like===1) {
				var count = movie._doc.like
				if (typeof(count) == "undefined") movie.set( {like: 1} )
				else {count++; movie.set( {like: count} )}
			}
			else if (vote.like===-1) {
				if (typeof(movie._doc.dislike) == "undefined") movie.set( {dislike: 1} )
				else movie.set( {dislike: (movie._doc.dislike++)} )	//set() not updating
			}
			else	callback('no votes')

			movie.save((err,updatedMovie) => {
						if (err)	return callback(err)
						else	callback(updatedMovie)
			})
	})
}



exports.getByQuery = (findkeys, callback) => {
  /* the 'find' property function can take a second 'filter' parameter. */
  Query.findOne({query: findkeys}, (err, data) => {
    if (err)
      callback('error: ' + err)
      /*3 types of No data error from mongoDb
      err = null, results = []
      err = null, results = null
      err = error document, results = null
      */
    else if(data==[] || data==null)
      callback(null)
    else
      callback(data._doc);	//_doc is the actual data saved
  })
}
exports.getByMovieId = (findkeys, callback) => {
  Movie.findOne({id: findkeys}, (err, data) => {
    if (err)
      callback('error: ' + err)
    else if(data==[] || data==null)
      callback(null)
    else
      callback(data._doc)	//_doc is the actual data saved
  })
}



//Unused methods
exports.getAll = callback => {
  /* the Query object contains several useful properties. The 'find' property contains a function to search the MongoDB document collection. */
  Query.find( (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    const query = data.map( item => {
      return {id: item._id, name: item.name}
    })
    callback(query)
  })
}

exports.getById = (id, callback) => {
  /* the 'find' property function can take a second 'filter' parameter. */
  Query.find({_id: id}, (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    callback(data)
  })
}

exports.clear = (callback) => {
  /* the 'remove()' function removes any document matching the supplied criteria. */
  Query.remove({}, err => {
    if (err) {
      callback('error: '+err)
    }
    callback('Queries deleted')
  })
}

