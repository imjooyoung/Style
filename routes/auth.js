module.exports = function(app, passport) {
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect : '/', // 프로필 부분으로 리다이렉트
    failureRedirect : '/', // 에러가 있으면 signup 페이지로 다시 리다이렉트
    failureFlash : true // flash messages 허용
  }));

  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope : 'email' })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect : '/signin',
      failureFlash : true // flash messages 허용
    }),
    function(req, res, next) {
      req.flash('success', '로그인되었습니다.');
      res.redirect('/posts');
    }
  );

 app.get('/signout', function(req, res) {
    req.logout();
    req.flash('success', '로그아웃 되었습니다.');
    res.render('index');
  });
/*  app.get('/hosting', function(req, res, next) {
    res.render('hosting');
  });*/
};
  
