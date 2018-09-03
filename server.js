// Basic Setup
const http = require('http');
const express = require('express');
const dbc = require('./dbc.js');
const mysql = require('mysql');
const contentful = require('contentful');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const slugify = require('slugify');
const mkdirp = require('mkdirp');
const path = require('path');

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
const connection = mysql.createConnection(dbc.connection);


try {
    connection.connect();
    console.log('connecting to database');

} catch (e) {
    console.log('Database Connection failed:' + e);
}


// Setup express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + 'uploads'));
app.use(express.static(path.join(__dirname, 'build/static')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(fileUpload());

const now = new Date().toISOString().substring(0, 10);

// Set default route
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});

console.log(path.join(__dirname, 'uploads'));



app.get('/api/users', function (req, res) {
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

app.post('/api/register', function (req, res) {
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    const courseData = {course_id: req.body.courseid, email: req.body.email};
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
            connection.query('INSERT INTO courses SET ?', courseData, function (error) {
                if (error) {
                    console.log("error ocurred", error);
                } else {
                    res.send({
                        "code": 200,
                        "success": "Registration sucessfull"
                    });
                }
            });
        }
    });
});

// UPDATE PASSWORD

app.post('/api/updatepassword', function (req, res) {
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


// >>>>>>>>>>>> LOGIN SECTION <<<<<<<<<<<<<<<<

app.post('/api/login', function (req, res) {
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
                    const user = {
                        firstname: results[0].first_name,
                        lastname: results[0].last_name,
                        email: results[0].email,
                        lastlogin: results[0].last_login,
                        regdate: results[0].reg_date,
                        role: results[0].role,
                    };
                    res.send({
                        "code": 200,
                        "success": "Lyckad inloggning",
                        "user": user
                    });
                    connection.query('UPDATE users SET last_login = ? WHERE id = ?', [now, results[0].id]);
                }
                else {
                    console.log("Email and password does not match");
                    res.send({
                        "code": 204,
                        "success": "Fel e-post eller lösenord"
                    });
                }
            }
            else {
                console.log("Email does not exits");
                res.send({
                    "code": 204,
                    "success": "Den angivna e-postadressen finns tyvärr inte registrerad."
                });
            }
        }
    });
});


// -:-:-:-:-:-:-:-: Get USERS COURSES -:-:-:-:-:-:-:-:
app.post('/api/usercourses', function(req, res) {
    let userCourses = [];
    const email = req.body.email;
    connection.query('SELECT course_id from courses WHERE email = ?', [email], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
        } else {
            results.forEach(function (course) {
                userCourses.push(course.course_id);
            });
            res.send({
                "code": 200,
                "success": "Registration sucessfull",
                "userCourses": userCourses
            });
        }

    });
});


// _-_-_-_-_-_-_-_-_-_-COMMENTS SECTION-_-_-_-_-_-_-_-_-_-_

app.post('/api/comment', function (req, res) {
    const post  = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        comment: req.body.comment,
        step: req.body.step
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

app.post('/api/answers', function (req, res) {
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

app.post('/api/getcomments', function (req, res) {
    let payLoad = [];
    const step = req.body.step;
    connection.query('SELECT * FROM comments WHERE step = ?', [step], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('results', results);
            results.forEach(function (res) {
                // console.log('hela entry______:', JSON.stringify(entry, null, 2))
                const comment = {id: res.id, name: res.first_name + ' ' + res.last_name, comment: res.comment};
                payLoad.push(comment);
                // console.log('comment', comment);
            });
            res.send({
                "code": 200,
                "success": "Fetch comments sucessfull",
                "comments": payLoad.reverse()
            });
            // console.log('payLoad', payLoad);
        }
    });
});

app.post('/api/getanswers', function (req, res) {
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




//  ?!?!?!?!?!?!?!?!?---FILE UPLOAD SECTION---!?!?!?!?!?!?!?!?

app.post('/api/fileupload', function (req, res) {
    const filename = slugify(req.files.file.name, {replacement: ' '});
    const post  = {
        user: req.body.user,
        user_email: req.body.useremail,
        ref: req.body.ref,
        step: req.body.step,
        filename: filename,
        path: './uploads/' + req.body.step + '/' + filename
    };
    let sampleFile = req.files.file;

    mkdirp('uploads/' + req.body.step, (err) => {
       if(err) {
           console.log(err);
           return res.status(500).send(err);
       } else {
           sampleFile.mv('uploads/' + req.body.step + '/' + post.filename, function(err) {
               if (err) {
                   console.log(err);
                   return res.status(500).send(err);
               } else {
                   connection.query('INSERT INTO uploads SET ?', post, function (error) {
                       if (error) {
                           console.log("error ocurred", error);
                           res.send({
                               "code": 400,
                               "failed": "error ocurred"
                           })
                       } else {
                           setTimeout(() => {
                               res.send({
                                   "code": 200,
                                   "success": "Upload successful"
                               })
                           }, 2000)
                       }
                   });
               }
           });
       }
    });
});

app.post('/api/getuploads', function (req, res) {
    let payLoad = [];
    const step = req.body.step;
    connection.query('SELECT * FROM uploads WHERE step = ?', [step], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('results', results);
            results.forEach(function (res) {
                // console.log('hela entry______:', JSON.stringify(entry, null, 2))
                const upload = {id: res.id, name: res.user, filename: res.filename, file: res.file, path: res.path};
                payLoad.push(upload);
                // console.log('comment', comment);
            });
            res.send({
                "code": 200,
                "success": "Fetch uploads sucessfull",
                "uploads": payLoad.reverse()
            });
            // console.log('payLoad', payLoad);
        }
    });
});



// _-_-_-_-_-_-_-_-_-_-CONTENTFUL SECTION-_-_-_-_-_-_-_-_-_-_

const client = contentful.createClient(dbc.contentful);

// client.getEntry('PeDCMJPuMM4ssIu2uw2UU')
//     .then(function (entry) {
        // logs the entry metadata
        // console.log('1', entry);

        // logs the field with ID title
        // console.log('2', entry.fields.lessons)
    // });


app.post('/api/course', function (req, res) {
    let lessons = [];
    let course = {};
    res.setHeader('Content-Type', 'application/json');
    client.getEntries({
        'content_type': 'course',
        'include': 2
    })
        .then(function (entries) {
            // console.log('req.body.userCourses', req.body.userCourses);
            // entries.items.map((entry, i) => (
            //     req.body.userCourses.indexOf(entry.sys.id) >= 0 &&
            //         course.push(entry.fields),
            //         entry.fields.lessons.map((lesson, i) => (
            //             lessons.push(lesson.fields)
            //         ))
            // ));
            entries.items.forEach(function (entry) {
                if(req.body.userCourses.indexOf(entry.sys.id) >= 0) {
                    course = entry.fields;
                    entry.fields.lessons.map((lesson) => (
                        lessons.push(lesson.fields)
                    ))
                }

            });
            if (lessons.length) {
                res.status(200).send({
                    "lessons": lessons,
                    "course": course
                });
            } else {
                res.status(204).send({
                    "code": 204
                })
            }
        });
});
