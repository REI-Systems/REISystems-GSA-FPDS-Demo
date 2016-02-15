var factories = factories || {};

factories.SessionFactory = [function(){
    var session = {
        "user": null,
        "isAuth": false
    };

    return {
        setSession: function(oUser) {
            session.user = oUser;
            session.isAuth = true;
            
//            console.log('Set Session');
//            console.log(session);
        },
        destroySession: function() {
            session.user = null;
            session.isAuth = false;
        },
        getSession: function() {
//            console.log('Get Session');
//            console.log(session);
            return session;
        },
        isUserAuthenticated: function() {
            return session.isAuth;
        }
    };
}];