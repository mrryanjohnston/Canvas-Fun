module.exports = function routes_function(app, settings, models, crypto, color) {

var page_context = settings.context;

function debug(req, res){
    if (settings.debug == true){
        console.log(color.fgred+"SESSION >>>>>>>>>>>"+color.reset);
        console.log(req.session);
        console.log(color.fgred+"<<<<<<<<<<<<<<<<<<"+color.reset);
        if(res.locals){
            console.log(color.fggreen+"LOCALS >>>>>>>>>>>"+color.reset);
            console.log(res.locals);
            console.log(color.fggreen+"<<<<<<<<<<<<<<<<<<"+color.reset);
        }
    }
};

/***
* / - About
*/
app.get('/', function(req, res) {
        page_context.page_title = '';
        res.render('about', {
            session: req.session,
            context: page_context,
            locals: res.locals
        });
    debug(req, res);
});

/***
* /chat - Global chat
*/
app.get('/chat', function(req, res) {
    if (req.session.email){
        page_context.page_title = ': Chat';
        res.render('chat', {
            session: req.session,
            context: page_context,
            locals: res.locals
        });
    }else{
        res.redirect('*');
    }
    debug(req, res);
});

/***
* /game - Playing games
*/
app.get('/game', function(req, res) {
    if (req.session.email){
        page_context.page_title = ': Game in progress';
        res.render('game', {
            session: req.session,
            context: page_context,
            locals: res.locals
        });
    }else{
        res.redirect('*');
    }
    debug(req, res);
});

/***
* /login - Login
*/

app.post('/login', function(req, res) {
    if(!req.session.email){
        var email = req.body.email
        ,   password = req.body.password
        ,   remember_me = req.body.remember_me;
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
                    if(remember_me === "true"){
                        req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                    }else{
                        req.session.cookie.maxAge = null;
                    }
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
    debug(req, res);
});

/***
* /logout - Logout
*/
app.get('/logout', function(req, res) {
    if (req.session.email){
        page_context.page_title = ': Logout';
        //req.session.messages.push({'success': 'You were successfully signed out.'}); //This will never be seen.
        res.redirect('/');
        req.session.destroy();
    }else{
        res.redirect('*');
    }
    debug(req, res);
});

/***
* /signup - Registration
*/
app.get('/signup', function(req, res) {
    if (!req.session.email){
        page_context.page_title = ': Sign Up';
        res.render('signup', {
            session: req.session,
            context: page_context,
            locals: res.locals
        });
    }else{
        res.redirect('*');
    }
    debug(req, res);
});

app.post('/signup', function(req, res) {
    if (req.session.email){
        res.redirect('*');
    }else{
        var failure1 = req.body.email !== req.body.email_confirmation;
        var failure2 = req.body.password !== req.body.password_confirmation;
        var failure3 = req.body.email.length === 0;
        var failure4 = req.body.password.length === 0;
        var failure5 = req.body.password.length === 0;
        if(failure1 || failure2 || failure3 || failure4 || failure5){
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
    debug(req, res);
});

/***
* /user - User Dashboard
*/
app.get('/user', function(req, res, next) {
    console.log(req.session);
    if (req.session.email){
        page_context.page_title = ': User Dashboard';
        if(!req.query.id){ // load self page
            res.render('user', {
                session: req.session,
                context: page_context,
                locals: res.locals
            });
        }else if(req.query.id.match(/^[0-9a-fA-F]{24}$/) && req.query.id.length === 24){
            console.log("hit on req.query.id: "+req.query.id);
            models.user.findById(req.query.id,
                function find_account_record_for_user_id(error, account){
                    if(account !== null && error == null){
                        res.locals.username = account.username;
                        res.locals.avatar_url = account.avatar_url;
                        res.locals.bio = account.bio;
                        res.locals.date_signup = account.date_signup;
                        res.locals.record_games_won = account.record_games_won;
                        res.locals.record_games_lost = account.record_games_lost;
                        res.locals.other_user = true;
                        res.render('user', {
                            session: req.session,
                            context: page_context,
                            locals: res.locals
                        });
                    }else{ // no account found at specified id
                        console.log(error);
                        res.locals.messages.push({"error":"The specified user id could not be found."});
                        res.render('user', {
                            session: req.session,
                            context: page_context,
                            locals: res.locals
                        });
                    }
                }
            );
        }else{ // invalid id, failed regex and/or length
            res.locals.messages.push({"error":"The specified user id is invalid."});
            res.render('user', {
                session: req.session,
                context: page_context,
                locals: res.locals
            });
        }
    }else{ // not signed in
        res.redirect('*');
    }
    debug(req, res);
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
        if(failure1 || failure2 || failure3 || failure4){
            res.send(409);
        }else if(no_password_update){
            var update = {
                email: req.body.email,
                username: req.body.username,
                bio: req.body.bio,
                avatar_url: req.body.avatar_url
            };
            // update db but not password
            models.user.update(conditions, update, function update_callback_1(error, rows){
                if(rows===1){
                    req.session.email = req.body.email;
                    req.session.username = req.body.username;
                    req.session.bio = req.body.bio;
                    req.session.avatar_url = req.body.avatar_url;
                    req.session.messages.push({"success":"Your settings were successfully updated."}); //req.session instead of res.locals to defer to next request.
                    res.send(200);
                }else{
                    res.send(409);
                }
            });
        }else{
            // update db including password
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
        }
    }
    debug(req, res);
});

/***
* /404 and /* - 404 error
*/
app.get('/404', function(req, res, next) {
    page_context.page_title = ': Error';
    res.render('404', {
        session: req.session,
        context: page_context,
        locals: res.locals
    });
    debug(req, res);
});

app.get('*', function(req, res, next) {
    page_context.page_title = ': Error';
    res.redirect('/404');
    debug(req, res);
});

}
