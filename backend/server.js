
// Basic Setup
var http     = require('http');
	express  = require('express');
    cors      = require('cors');
	mysql    = require('mysql');
	parser   = require('body-parser');
    contentful = require('contentful');
	crypto = require('crypto');

	var crypto = require('crypto'),
	    algorithm = 'aes-256-ctr',
	    password = 's9G1fEop';

	function encrypt(text){
	  var cipher = crypto.createCipher(algorithm,password)
	  var crypted = cipher.update(text,'utf8','hex')
	  crypted += cipher.final('hex');
	  return crypted;
	}

	function decrypt(text){
	  var decipher = crypto.createDecipher(algorithm,password)
	  var dec = decipher.update(text,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}

// Database Connection
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lms'
});
try {
	connection.connect();
  console.log('Database connected');

} catch(e) {
	console.log('Database Connetion failed:' + e);
}

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


// Setup express
var app = express();
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);


// Set default route
app.get('/', function (req, res) {
	res.send('<html><body><p>Welcome to sShop App</p></body></html>');
});

// Create server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Server listening on port ' + app.get('port'));
});


app.get('/users', cors(corsOptions), function (req,res) {
	// var id = req.params.id;
  connection.query('SELECT * FROM users', function(err, results) {
        if (err) throw err;
        if (!err){
        			var response = [];
      			  res.setHeader('Content-Type', 'application/json');
      	    	res.status(200).send(results);
        		} else {
              console.log('error 400');
      		    res.status(400).send(err);
      	  	}
      })
});

app.post('/login', cors(corsOptions), function (req,res) {
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  console.log(email, '||||', password);
	var encryptedPassword = encrypt(password);
	console.log('encryptedPassword', encryptedPassword);

  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  } else {
    if(results.length >0){
      if(results[0].password == encryptedPassword){
        console.log("login sucessfull");
        res.send({
          "code":200,
          "success":"login sucessfull"
            });
      }
      else {
        console.log("Email and password does not match");
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else {
      console.log("Email does not exits");
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
});


// _-_-_-_-_-_-_-_-_-_-CONTENTFUL SECTION-_-_-_-_-_-_-_-_-_-_

var client = contentful.createClient({
    space: '9wq1nwc23wz5',
    accessToken: 'e2759746697348fd582517b58a84683b6954b4b12f0cdeec31868b6b00fa2295'
});

client.getEntry('PeDCMJPuMM4ssIu2uw2UU')
    .then(function (entry) {
        // logs the entry metadata
        console.log('1', entry.sys)

        // logs the field with ID title
        console.log('2', entry.fields.title)
    })

/*
client.getEntries()
    .then(function (entries) {
        // log the title for all the entries that have it
        entries.items.forEach(function (entry) {
            if(entry.fields.course) {
                console.log('3', entry.fields)
                if(entry.fields.media) {
                    console.log('4', entry.fields.media[0].fields.file.url)
                }
            }
        })
    });
*/

client.getEntries({
    'content_type': 'lessons'
})
    .then(function (entries) {
        console.log(JSON.stringify(entries))
        entries.items.forEach(function (entry) {
            console.log(JSON.stringify(entry.fields.title))
        })
    })