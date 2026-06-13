
const User = require("../models/user")


module.exports.signUpUser = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.postSignup = async(req,res)=>{
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to wanderlust!");
            let redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl;

            res.redirect(redirectUrl);
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginUser = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
    req.flash("success", "Welcome Back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};