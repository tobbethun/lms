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
const helmet = require('helmet');

const crypto = require('crypto');
const algorithm = dbc.cipher.algorithm;
const password = dbc.cipher.password;
const iv = new Buffer.alloc(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, password, iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

// function decrypt(text) {
//     const decipher = crypto.createDecipheriv(algorithm, password, iv);
//     let dec = decipher.update(text, 'hex', 'utf8');
//     dec += decipher.final('utf8');
//     return dec;
// }

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
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + 'uploads'));
app.use(express.static(path.join(__dirname, 'build/static')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(fileUpload());


// Set default route
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Server listening on port ' + app.get('port'));
});




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

app.post('/api/checkemail', function(req, res) {
    const email = req.body.email;
    connection.query('SELECT * from users WHERE email = ?', [email], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
        } else {
            if (results.length >= 1) {
                res.send({
                    "code": 200,
                    "emailexist": true,
                });
            } else {
                res.send({
                    "code": 200,
                    "emailexist": false,
                });
            }
        }

    });
});


app.post('/api/register', function (req, res) {
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    const courseData = {course_id: req.body.courseid, email: req.body.email};
    const post  = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        password: encryptedPassword,
        reg_date: req.body.currentTime,
        role: 'student'
    };
    connection.query('INSERT INTO users SET ?', post, function (error) {
        if (error) {
            console.log("error ocurred", error);
            console.log('register error', post);
            res.send({
                "code": 400,
                "message": "Något gick fel. Vänligen försök igen"
            })
        } else {
            connection.query('INSERT INTO courses SET ?', courseData, function (error) {
                if (error) {
                    console.log("error ocurred", error);
                } else {
                    res.send({
                        "code": 200,
                        "message": "Du är nu registrerad"
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
                        "success": "Lösenord uppdaterat"
                    });
                }
                else {
                    res.send({
                        "code": 204,
                        "success": "Fel lösenord"
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
    const email = req.body.email;
    const password = req.body.password;
    const currentTime = req.body.currentTime;
    const encryptedPassword = encrypt(password);

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
                    connection.query('UPDATE users SET last_login = ? WHERE id = ?', [currentTime, results[0].id]);
                }
                else {
                    console.log("Email and password does not match", email, "--", encryptedPassword);
                    res.send({
                        "code": 204,
                        "success": "Fel e-post eller lösenord"
                    });
                }
            }
            else {
                console.log("Email does not exits", email);
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
        role: req.body.role,
        comment: req.body.comment,
        course: req.body.course,
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
        role: req.body.role,
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
    const course = req.body.course;
    const step = req.body.step;
    connection.query('SELECT * FROM comments WHERE course = ? AND step = ?', [course, step], function (error, results) {
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
                const comment = {id: res.id, name: res.first_name + ' ' + res.last_name, comment: res.comment, time: res.time, role: res.role};
                payLoad.push(comment);
                // console.log('comment', comment);
            });
            res.send({
                "code": 200,
                "success": "Fetch comments sucessfull",
                "comments": payLoad.reverse()
            });
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
                const answer = {id: res.id, name: res.first_name + ' ' + res.last_name, answer: res.answer, time: res.time, role: res.role};
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
        course: req.body.course,
        step: req.body.step,
        filename: filename,
        path: '/uploads/' + req.body.step + '/' + filename
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
                           res.send({
                               "code": 200,
                               "success": "Upload successful"
                           })
                       }
                   });
               }
           });
       }
    });
});

app.post('/api/getuploads', function (req, res) {
    let payLoad = [];
    const course = req.body.course;
    const step = req.body.step;
    connection.query('SELECT * FROM uploads WHERE course = ? AND step = ?', [course, step], function (error, results) {
        if (error) {
            console.log("error ocurred", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('results', results);
            results.forEach(function (res) {
                const upload = {id: res.id, name: res.user, filename: res.filename, file: res.file, path: res.path, time: res.time};
                payLoad.push(upload);
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

app.post('/api/download/', function(req, res) {
    var file = __dirname + req.body.path;
    res.download(file);
});

// _-_-_-_-_-_-_-_-_-_-CONTENTFUL SECTION-_-_-_-_-_-_-_-_-_-_

const client = contentful.createClient(dbc.contentful);

app.post('/api/course', function (req, res) {
    let lessons = [];
    let course = [];
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
                if(req.body.userCourses.indexOf(entry.sys.id) > -1) {
                    const payload = entry.fields;
                    payload.id = entry.sys.id;
                    course.push(payload);
                    courseID = entry.sys.id;
                    entry.fields.lessons.map((lesson) => (
                        lessons.push(lesson.fields)
                    ))
                }
            });
            if (lessons.length) {
                res.send({
                    "code": 200,
                    "lessons": lessons,
                    "course": course
                });
            } else {
                res.send({
                    "code": 204,
                    "message": "Du har har inga aktiva kurser för tillfället. Om detta inte stämmer kontakta din kursledare."
                })
            }
        });
});

app.post('/api/assignments', function(req, res) {
    const userEmail = req.body.userEmail;
    const payload = [];
    const uploads = [];
    client.getEntries({
        'fields.fileUpload': 'true',
        'content_type': 'steps',
        'order': 'sys.updatedAt'
    })
        .then(function (entries) {
            entries.items.forEach(function (entry) {
                payload.push({title: entry.fields.title, step: entry.sys.id});
            });
            if (payload.length) {
                connection.query('SELECT step FROM uploads WHERE user_email = ?', [userEmail], function (error, results) {
                    results.forEach(function (result) {
                        uploads.push(result.step);
                    });
                    if (error) {
                        console.log("error ocurred", error);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    } else {
                        // results.forEach(function (res) {
                        //     const upload = {id: res.id, name: res.user, filename: res.filename, file: res.file, path: res.path, time: res.time};
                        //     payLoad.push(upload);
                        // });
                        res.status(200).send({
                            "steps": payload,
                            "uploads": uploads,
                            "code": 200
                        });
                        // console.log('payLoad', payLoad);
                    }
                });

            } else res.status(204);
        });
});

