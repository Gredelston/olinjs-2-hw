// Connect to mongoose db
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/mydb');
var db = mongoose.connection;

// If the db errors...
db.on('error', console.error.bind(console, 'connection error:'));

// When the database is opened, clear Cat.
db.once('open', function callback() {
    console.log('Deleting everything.');
    Cat.remove(function(err) {} );
});

// Create a schema for cats
var catSchema = mongoose.Schema({
    name: String,
    age: Number,
    colors: [String]
});

// Create a Cat model.
// A model is a class with which we construct documents.
var Cat = mongoose.model('Cat', catSchema);


// btw, let's define a list of colors...
colors = ['red', 'blue', 'green', 'auburn', 'orange', 'white', 'black', 'grey', 'purple', 'striped', 'polka-dot', 'rainbow', 'invisible'];


// We'll be iterating through each cat.
var catCount = 0;


// route /cats/new:
// Creates a new cat w/ random name, colors, and age.
exports.newCat = function(req, res){
    
    // First, figure out the name...
    var catname = 'UniqueCatNum' + String(catCount)
    catCount++;

    // ...then the color...
    var catcolor = ['red', 'blue'];

    // ... then the age.
    var catage = Math.floor(Math.random() * 1000);

    // Actually create the cat.
    var cat = new Cat({ name:catname, age:catage, colors:catcolor});
    
    // Save it to the db!
    cat.save(function(err, cat){
        if(!err){
            console.log('Cat saved.');
        }
    });
};
    //res.send('New cat: ', catname);

// Displays all cats.
exports.dispCats = function(req, res){

    var ans = 'You have ' + String(Cat.find({}).length) + 'cats:\n';

    // Search for all the cats!
    Cat.find(function(err, cats) {

        // in case shit breaks.
        if (err){
            console.log('COMPUTER OVER\nVIRUS = VERY YES');
        }

        // console.log('%s has colors %s.', cat.name, cat.colors);

        for (var i = 0; i < cats.length; i++) {
            ans +=  cats[i].name + ' is '+String(cats[i].age) + ' years old.\n';
        }
        res.send(ans);
        console.log(ans)
    }) 
    //console.log(ans);

    //res.send(ans);
};

// Displays all cats of a specified color.
exports.dispColor = function(req, res){
    var col = req.params.color
    res.send('These are all of the cats of the color ' + col + '.');
};

// Deletes the oldest cat from the database.
exports.deleteOld = function(req, res){

    sorted = Cat.find({}).sort('-age').exec(function(err, docs) {
        Cat.findOne({age: docs[0].age}).remove();
    });

    res.send('Deleting your oldest cat. :(');
};
