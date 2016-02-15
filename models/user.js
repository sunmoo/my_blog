/**
 * Created by miao on 16-2-14.
 */

var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//store user information
User.prototype.save = function(callback) {
    var user = {
        name: this.name,
        password:this.password,
        email:this.email
    };
    console.log("save user");
    mongodb.open(function(err, db){
        if(err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
          //  console.log("save user 2" + db.collection);

            collection.insert(user, {
                safe: true
            }, function(err, user) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, user[0]);
            });
        });
    });
};

User.get = function(name, callback) {
    mongodb.open(function(err, db) {
        if(err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {

            if(err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({
                name: name
            }, function(err, user) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
};