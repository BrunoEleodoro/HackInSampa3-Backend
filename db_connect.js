var mongoose = require('mongoose');

module.exports = async function connectDB() {
    var db = {}
    await mongoose.connect(process.env.DB, function (err, db_new) {
        if (err) {
            console.log('MongoDB erro=' + err)
        } else {
            db = db_new;
        }
    });
    return db;
}