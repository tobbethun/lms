// Basic Setup
const http = require('http');
express = require('express');
cors = require('cors');
mysql = require('mysql');
parser = require('body-parser');
contentful = require('contentful');

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 's9G1fEop';

function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// Database Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lms',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});
try {
    connection.connect();
    console.log('Database connected y´all');

} catch (e) {
    console.log('Database Connection failed:' + e);
}

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, constious SmartTVs) choke on 204
};


// Setup express
const app = express();
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 5000);

const now = new Date().toISOString().substring(0, 10);

// Set default route
app.get('/', function (req, res) {
    res.send('<html><body><p>Welcome to L.M.S.</p></body></html>');
});

// Create server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});


app.get('/users', cors(corsOptions), function (req, res) {
    // const id = req.params.id;
    connection.query('SELECT * FROM users', function (err, results) {
        if (err) throw err;
        if (!err) {
            const response = [];
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        } else {
            console.log('error 400');
            res.status(400).send(err);
        }
    })
});

// REGISTER NEW USER

app.post('/register', cors(corsOptions), function (req, res) {
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    const post  = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        password: encryptedPassword,
        reg_date: now,
        role: 'student'
    };
    connection.query('INSERT INTO users SET ?', post, function (error) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            res.send({
                "code": 200,
                "success": "Registration sucessfull"
            });
        }
    });
});

// UPDATE PASSWORD

app.post('/updatepassword', cors(corsOptions), function (req, res) {
    const email = req.body.email;
    const oldpassword = req.body.oldpassword;
    const newpassword = req.body.newpassword;
    const encryptedOldPassword = encrypt(oldpassword);
    const encryptedPassword = encrypt(newpassword);
    connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if (results.length > 0) {
                if (results[0].password === encryptedOldPassword) {
                    connection.query('UPDATE users SET password = ? WHERE id = ?', [encryptedPassword, results[0].id]);
                    res.send({
                        "code": 200,
                        "success": "Update sucessfull"
                    });
                }
                else {
                    res.send({
                        "code": 204,
                        "success": "wrong old password"
                    });
                }
            }
            else {
                res.send({
                    "code": 204,
                    "success": "Email does not exits"
                });
            }
        }
    });
});


// LOGIN SECTION

app.post('/login', cors(corsOptions), function (req, res) {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, '||||', password);
    const encryptedPassword = encrypt(password);
    console.log('encryptedPassword', encryptedPassword);

    connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            if (results.length > 0) {
                if (results[0].password == encryptedPassword) {
                    console.log("login sucessfull", results[0]);
                    const user = {
                        firstname: results[0].first_name,
                        lastname: results[0].last_name,
                        email: results[0].email,
                        lastlogin: results[0].last_login,
                        regdate: results[0].reg_date,
                        role: results[0].role
                    };
                    res.send({
                        "code": 200,
                        "success": "login sucessfull",
                        "user": user
                    });
                    connection.query('UPDATE users SET last_login = ? WHERE id = ?', [now, results[0].id]);
                }
                else {
                    console.log("Email and password does not match");
                    res.send({
                        "code": 204,
                        "success": "Email and password does not match"
                    });
                }
            }
            else {
                console.log("Email does not exits");
                res.send({
                    "code": 204,
                    "success": "Email does not exits"
                });
            }
        }
    });
});


// _-_-_-_-_-_-_-_-_-_-COMMENTS SECTION-_-_-_-_-_-_-_-_-_-_

app.post('/comment', function (req, res) {
    const post  = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        comment: req.body.comment,
        lesson: req.body.lesson
    };
    connection.query('INSERT INTO comments SET ?', post, function (error) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            res.send({
                "code": 200,
                "success": "Registration sucessfull"
            });
        }
    });
});

app.post('/answers', function (req, res) {
    const post  = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        answer: req.body.answer,
        comment_id: req.body.commentid
    };
    connection.query('INSERT INTO answers SET ?', post, function (error) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            res.send({
                "code": 200,
                "success": "Registration sucessfull"
            });
        }
    });
});

app.post('/getcomments', function (req, res) {
    let payLoad = [];
    const lesson = req.body.lesson;
    console.log('lesson', lesson);
    connection.query('SELECT * FROM comments WHERE lesson = ?', [lesson], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('results', results);
            results.forEach(function (res) {
                // console.log('hela entry______:', JSON.stringify(entry, null, 2))
                const comment = {id: res.id, name: res.first_name + ' ' + res.last_name, comment: res.comment};
                payLoad.push(comment);
                console.log('comment', comment);
            });
            res.send({
                "code": 200,
                "success": "Fetch comments sucessfull",
                "comments": payLoad
            });
            console.log('payLoad', payLoad);
        }
    });
});

app.post('/getanswers', function (req, res) {
    let payLoad = [];
    const commentId = req.body.commentid;
    connection.query('SELECT * FROM answers WHERE comment_id = ?', [commentId], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log('results', results);
            results.forEach(function (res) {
                // console.log('hela entry______:', JSON.stringify(entry, null, 2))
                const answer = {id: res.id, name: res.first_name + ' ' + res.last_name, answer: res.answer};
                payLoad.push(answer);
            });
            res.send({
                "code": 200,
                "success": "Fetch answers sucessfull",
                "answers": payLoad
            });
        }
    });
});

// _-_-_-_-_-_-_-_-_-_-CONTENTFUL SECTION-_-_-_-_-_-_-_-_-_-_

const client = contentful.createClient({
    space: '9wq1nwc23wz5',
    accessToken: 'e2759746697348fd582517b58a84683b6954b4b12f0cdeec31868b6b00fa2295'
});

client.getEntry('PeDCMJPuMM4ssIu2uw2UU')
    .then(function (entry) {
        // logs the entry metadata
        // console.log('1', entry);

        // logs the field with ID title
        // console.log('2', entry.fields.lessons)
    });


app.get('/course', function (req, res) {
    let payLoad = [];

    res.setHeader('Content-Type', 'application/json');
    client.getEntries({
        'content_type': 'course'
    })
        .then(function (entries) {

            entries.items.forEach(function (entry) {
                // console.log('hela entry______:', JSON.stringify(entry, null, 2))
                payLoad.push(entry.fields);
            });
            res.status(200).send(payLoad);
        });
});
