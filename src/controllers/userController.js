import passport from "passport";
import routes from "../routes";
import User from "../models/User";
import middlewares from  "../middlewares";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
    // To Do: Log user in
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Log In" });
};
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  const {
    username,
    _json: { id, avatar_url: avatarUrl, name, email,}
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.avatarUrl = avatarUrl;
      if(name === null) {
        user.name = username;
      } else {
        user.name = name;
      }
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      user: name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
}

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
}

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  const {_json: { id, name, email }} = profile;
  try{
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.name = name;
      user.avatarUrl = `http://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl : `http://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch(error) {
    return cb(error);
  }
}

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
}

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).populate("videos");
  console.log(req.user);
  console.log(user);
  res.render("userDetail", { pageTitle: "User Detail" , user});
}

export const userDetail = async (req, res) =>{
  const { params: { id } } = req;
  try{
    const user = await User.findById(id).populate("videos");
    console.log(user);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch(error) {
    res.redirect(routes.home);
  }
}
  
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: {name, email},
    file
  } = req;
  try{
    await User.findByIdAndUpdate(req.user._id, {
      name, email, avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.user.name = name;
    req.user.email = email;
    res.redirect(routes.me);
  } catch(error) {
    res.redirect("editProfile")
  }
}

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
      alert("error");
    }
    const user = await User.findById (req.user._id);
    await user.changePassword (oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
