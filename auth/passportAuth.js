module.exports = function(passport, FacebookStrategy, config, mongoose){

  var chatUser = new mongoose.Schema({
    profileID:String,
    fullname:String,
    profilePic:String
  })

  var userModel = mongoose.model('chatUser', chatUser);

  passport.serializeUser(function(user, done){
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done){
    userModel.findById(id, function(err, user){
      done(err, user);
    })
  })

  passport.use(new FacebookStrategy({
    clientID: config.fb.appID,
    clientSecret: config.fb.appSecret,
    callbackURL: config.fb.callbackURL,
    // profileFiled: ['id', 'displayName', 'username', 'photos']
    scope: ['user_photos'],
    profileFields: ['id', 'displayName', 'photos']
  }, function(accessToken, refreshToken, profile, done){
    userModel.findOne({'profileID':profile.id}, function(err, result){
      if(result){
        done(null, result);
      } else{
        var newChatUser = new userModel({
          profileID:profile.id,
          fullname:profile.displayName,
          profilePic:profile.photos ? profile.photos[0].value : ''
          // profilePic:"https://graph.facebook.com/" + profile.username + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
        });

        newChatUser.save(function(err){
          done(null, newChatUser);
        })
      }
    })
  }))
}
