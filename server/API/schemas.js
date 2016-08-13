var mongoose = require('../mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var mongoConnection = mongoose.connection;
autoIncrement.initialize(mongoConnection);

var IssueSchema = new Schema({
    user: String,
    userId: String,
    issue: String,
    createdAt: Number,
    solution: String,
    origTime: Number,
    client: String,
    clientId: String,
    callerId: String,
    callerName: String,
    callerPhone: String,
    callerEmail: String,
    passenger: String,
    ref: Number,
    history: Array
});

IssueSchema.plugin(autoIncrement.plugin, {
    model: 'Issue',
    field: 'ref',
    startAt: 10001,
    incrementBy: 1
});
var IssueModel = mongoose.model('Issue',IssueSchema);


var UserSchema = new Schema({
    user: String,
    createdAt: Number
});
var UserModel = mongoose.model('User',UserSchema);

var ClientSchema = new Schema({
    name: String,
    createdAt: Number
});
var ClientModel = mongoose.model('Client',ClientSchema);

var CallerSchema = new Schema({
    name: String,
    phone: Array,
    email: Array,
    createdAt: Number,
    clientId: String,
    clientName: String
});

var CallerModel = mongoose.model('Caller',CallerSchema);

module.exports = {
    IssueModel: IssueModel,
    UserModel: UserModel,
    ClientModel: ClientModel,
    CallerModel: CallerModel
};