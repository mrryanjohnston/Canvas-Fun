module.exports = function routes_function(app, settings, models, crypto) {

//console.log(models);

var page_context = settings.context;

var debug = function(req){
    console.log(req.session);
};

/***
* / - About
*/
app.get('/', function(req, res) {
        page_context.page_title = '';
        res.render('about', {
            session: req.session,
            context: page_context
        });
    debug(req);
});

/***
* /chat - Global chat
*/
app.get('/chat', function(req, res) {
    if (req.session.email){
        page_context.page_title = ': Chat';
        res.render('chat', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /game - Playing games
*/
app.get('/game', function(req, res) {
    if (req.session.email){
        page_context.page_title = ': Game in progress';
        res.render('game', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /login - Login
*/

app.post('/login', function(req, res) {
    if(!req.session.email){
        var email = req.body.email
        ,   password = req.body.password;
        models.user.findOne({ email: email },
            function find_account_record_at_login(error, account){
                if(account !== null){
                    if(account.password == crypto.createHmac("sha1", account.salt).update(password).digest("hex")){
                    req.session._id = account._id;
                    req.session.email = email;
                    req.session.username = account.username;
                    req.session.bio = account.bio;
                    req.session.date_signup = account.date_signup;
                    req.session.record_games_won = account.record_games_won;
                    req.session.record_games_lost = account.record_games_lost;
                    req.session.avatar_url = account.avatar_url;
                    res.send(200);
                    }else{
                        res.send(401);
                    }
                }else{
                    res.send(401);
                }
            }
        );
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /logout - Logout
*/
app.get('/logout', function(req, res) {
    if (req.session.email){
        req.session.destroy();
        page_context.page_title = ': Logout';
        //req.session.messages.push("<li><p class=\"text-success\">You are signed out.</p></li>"); //This will never be seen.
        res.redirect('/');
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /signup - Registration
*/
app.get('/signup', function(req, res) {
    if (!req.session.email){
        page_context.page_title = ': Sign Up';
        res.render('signup', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    //debug(req);
});

app.post('/signup', function(req, res) {
    //console.log('post hit signup!');
    if (req.session.email){
        res.redirect('*');
    }else{
        var failure1 = req.body.email !== req.body.email_confirmation;
        var failure2 = req.body.password !== req.body.password_confirmation;
        var failure3 = req.body.email.length === 0;
        var failure4 = req.body.password.length === 0;
        var failure5 = req.body.password.length === 0;
        if(failure1){
            res.send(409);
        }else if(failure2){
            res.send(409);
        }else if(failure3){
            res.send(409);
        }else if(failure4){
            res.send(409);
        }else if(failure5){
            res.send(409);
        }else{
            var salt = settings.mongodb_salt_keyword+String(Date.now());
            var password = crypto.createHmac("sha1", salt).update(req.body.password).digest("hex");
            var account = new models.user({
                username: req.body.username,
                email: req.body.email,
                password: password,
                salt: salt
            });
            account.save(function save_account(error) {
                if (error) {
                    console.log(error);
                    res.send(409);
                }else{
                    res.send(200);
                }
            });
        }
    }
    //debug(req);
});

/***
* /user - User Dashboard
*/
app.get('/user', function(req, res, next) {
    console.log(req.session);
    if (req.session.email){
        // check req.query.id and load relevant page
        if(req.query.id){
            console.log("hit on req.query.id: "+req.query.id);
        }
        page_context.page_title = ': User Dashboard';
        res.render('user', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

app.post('/user', function(req, res) {
    if (!req.session.email || req.query.id){
        res.redirect('*');
    }else{
        var failure1 = req.body.email !== req.body.email_confirmation;
        var failure2 = req.body.password !== req.body.password_confirmation;
        var failure3 = req.body.username.length === 0;
        var failure4 = req.body.email.length === 0;
        var no_password_update = req.body.password.length === 0;
        var conditions = { _id : req.session._id };
        if(failure1){
            res.send(409);
        }else if(failure2){
            res.send(409);
        }else if(failure3){
            res.send(409);
        }else if(failure4){
            res.send(409);
        }else if(no_password_update){
            var update = {
                email: req.body.email,
                username: req.body.username,
                bio: req.body.bio,
                avatar_url: req.body.avatar_url
            };
            models.user.update(conditions, update, function update_callback_1(error, rows){
                if(rows===1){
                    req.session.email = req.body.email;
                    req.session.username = req.body.username;
                    req.session.bio = req.body.bio;
                    req.session.avatar_url = req.body.avatar_url;
                    res.send(200);
                }else{
                    res.send(409);
                }
            });
            // update db but not password
        }else{
            var salt = settings.mongodb_salt_keyword+String(Date.now());
            var update = {
                email: req.body.email,
                username: req.body.username,
                bio: req.body.bio,
                avatar_url: req.body.avatar_url,
                password: crypto.createHmac("sha1", salt).update(req.body.password).digest("hex"),
                salt: salt
            };
            models.user.update(conditions, update, function update_callback_2(error, rows){
                if(rows===1){
                    req.session.email = req.body.email;
                    req.session.username = req.body.username;
                    req.session.bio = req.body.bio;
                    req.session.avatar_url = req.body.avatar_url;
                    res.send(200);
                }else{
                    res.send(409);
                }
            });
            // update db including password
        }
    }
});

/***
* /404 and /* - 404 error
*/
app.get('/404', function(req, res, next) {
    page_context.page_title = ': Error';
    res.render('404', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

app.get('*', function(req, res, next) {
    page_context.page_title = ': Error';
    res.redirect('/404');
    debug(req);
});

}
