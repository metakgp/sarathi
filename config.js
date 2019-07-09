module.exports = {
    // callbackUrl:'https://travelkgp.herokuapp.com/api/auth/facebook/callback',
    callbackUrl:'http://localhost:5000/api/auth/facebook/callback',
    profileURL: 'https://graph.facebook.com/v3.3/me',
    authorizationURL: 'https://www.facebook.com/v3.3/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v3.3/oauth/access_token',
    profileFields: ['id', 'name'],
}