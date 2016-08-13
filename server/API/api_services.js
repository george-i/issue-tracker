/* MongoDB related settings */

var models = require('./schemas');
var IssueModel = models.IssueModel;
var UserModel = models.UserModel;
var ClientModel = models.ClientModel;
var CallerModel = models.CallerModel;
var json2csv = require('json2csv');
var moment = require('moment');
var _= require('lodash');
var getEventDate = function(ts){
    return moment(ts).format('DD/MM/YYYY');
};
var getEventTime = function(ts){
    return moment(ts).format('HH:mm');
};


/* API methods */
module.exports = {
    issue: {
        POST: function(req, res) {
            var response;
            var dtm = new Date().getTime();
            var issue = req.body,
                issueToWrite = {
                    user: issue.user,
                    userId: issue.userId,
                    issue: issue.issue,
                    origTime: issue.issueTime,
                    solution: issue.solution,
                    client: issue.client,
                    clientId: issue.clientId,
                    responseTime: issue.responseTime,
                    passenger: issue.passenger,
                    createdAt: dtm,
                    callerName: issue.caller.name,
                    callerPhone: issue.caller.phone,
                    callerEmail: issue.caller.email
                },
                iss;

            var historyItem = {
                issueTime: issue.issueTime,
                issue: issue.issue,
                solution: issue.solution,
                createdAt: dtm,
                responseTime: issue.responseTime
            };
            issueToWrite.history = [historyItem];
            console.log(issueToWrite);
            IssueModel.count({}, function (err, count) {
                var caller = issue.caller;
                if(!caller._id){
                    caller.clientName = issue.client;
                    caller.clientId = issue.clientId;
                    var newc = new CallerModel(caller);
                    newc.save(function (err, cll) {
                        if(err){
                            console.log(err);
                            response = {
                                success: false,
                                data: null
                            };
                            res.json(response);
                        }else{
                            issueToWrite.callerId = cll._id;
                            iss = new IssueModel(issueToWrite);
                            iss.save(function (err, newiss) {
                                if(err){
                                    console.log(err);
                                    response = {
                                        success: false,
                                        data: null
                                    };
                                }else{
                                    response = {
                                        success: true,
                                        data: newiss,
                                        count: count++
                                    };
                                }
                                res.json(response);
                            });
                        }
                    });
                }else{
                    issueToWrite.callerId = issue.caller._id;
                    iss = new IssueModel(issueToWrite);
                    iss.save(function (err, newiss) {
                        if(err){
                            console.log(err);
                            response = {
                                success: false,
                                data: null
                            };
                        }else{
                            response = {
                                success: true,
                                data: newiss,
                                count: count++
                            };
                        }
                        res.json(response);
                    });
                    CallerModel.findById(issue.caller._id, function(err, cl) {
                        var response;
                        if(err){
                            console.log(err);
                        }else{
                            var cEmails = cl.email;
                            var cPhones = cl.phone;
                            if(caller.email && caller.email.length>2){
                                cEmails.push(caller.email);
                            }
                            if(caller.phone && caller.phone.length>2){
                                cPhones.push(caller.phone);
                            }
                            var updatedC = cl;
                            cl.email = _.uniq(cEmails);
                            cl.phone = _.uniq(cPhones);
                            cl.save();
                        }
                    });
                }
            });
        },
        GET: function(req, res) {
            IssueModel.find({_id: req.query.issue._id}, function(err, issue) {
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: issue
                    };
                }
                res.json(response);
            });
        },
        DELETE: function(req,res) {
            IssueModel.count({}, function (err, count) {
                IssueModel.findByIdAndRemove(req.params._id,function(err){
                    var response;
                    if(err){
                        response = {
                            success: false,
                            data: null
                        };
                    }else{
                        var cnt = 0;
                        if(cnt>0){
                            cnt = cnt-1;
                        }
                        response = {
                            success: true,
                            data: [],
                            count: cnt
                        };
                    }
                    res.json(response);
                });

            });

        },
        PUT: function(req,res) {
            var issue = req.body,
                issueToWrite = req.body;


            var response = {
                success: false,
                data: null
            };
            IssueModel.findById(req.body._id,function(err, iss){
                var caller = issue.caller;
                if(!caller._id){
                    caller.clientName = issue.client;
                    caller.clientId = issue.clientId;
                    var newc = new CallerModel(caller);
                    newc.save(function (err, cll) {
                        if(err){
                            console.log(err);
                            response = {
                                success: false,
                                data: null
                            };
                            res.json(response);
                        }else{
                            issueToWrite.callerId = cll._id;
                            iss.update(issueToWrite, function (err) {
                                if(err){
                                    console.log(err);
                                    response = {
                                        success: false,
                                        data: null
                                    };
                                }else{
                                    response = {
                                        success: true,
                                        data: issueToWrite
                                    };
                                }
                                res.json(response);
                            });
                        }
                    });

                }else{
                    iss.callerId = issue.caller._id;
                    iss.update(issueToWrite,function (err) {
                        if(err){
                            console.log(err);
                            response = {
                                success: false,
                                data: null
                            };
                        }else{
                            response = {
                                success: true,
                                data: issueToWrite
                            };
                        }
                        res.json(response);
                    });
                    CallerModel.findById(issue.caller._id, function(err, cl) {
                        if(err){
                            console.log(err);
                        }else{
                            var cEmails = cl.email;
                            var cPhones = cl.phone;
                            if(caller.email && caller.email.length>2){
                                cEmails.push(caller.email);
                            }
                            if(caller.phone && caller.phone.length>2){
                                cPhones.push(caller.phone);
                            }
                            var updatedC = cl;
                            cl.email = _.uniq(cEmails);
                            cl.phone = _.uniq(cPhones);
                            cl.save();

                        }
                    });
                }

            });
        }
    },
    issues: {
        GET: function(req,res) {
            IssueModel.count({}, function (err, count) {
                var skip = req.query.skip || 0,
                    limit = req.query.limit || 0;
                IssueModel.find({},null,{skip:skip, limit: limit, sort: {origTime: -1}},function(err, issues){
                    var response;
                    if(err){
                        response = {
                            success: false,
                            data: null
                        };
                    }else{
                        response = {
                            success: true,
                            data: issues,
                            count: count
                        };
                    }
                    res.json(response);
                });
            });

        }
    },
    issuelog: {
        PUT: function(req,res) {
            var response;
            IssueModel.update({_id: req.body._id},{history: req.body.history}, function(err, issue) {
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: []
                    };
                }
                res.json(response);
            });
        }
    },
    user: {
        POST: function(req, res) {
            var response;
            var userToWrite = {
                    user: req.body.user,
                    createdAt: new Date().getTime()
                },
                uss = new UserModel(userToWrite);

            uss.save(function (err, user) {
                if(err){
                    console.log(err);
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: user
                    };
                }
                res.json(response);
            });
        },
        GET: function(req,res) {
            UserModel.find({},function(err,messages){
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: messages
                    };
                }
                res.json(response);
            });
        },
        DELETE: function(req,res) {
            UserModel.findByIdAndRemove(req.params._id, function(err){
                var response;

                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: []
                    };
                }
                res.json(response);
            });
        },
        PUT: function(req,res) {
            var response;
            UserModel.findById(req.body._id,function(err, user){
                user.update(req.body, null, function(err, result, raw){
                    if(err){
                        response = {
                            success: false,
                            data: null
                        };
                        res.json(response);
                    }else{
                        var success = true;
                        if(result.n === 0){
                            success = false;
                        }
                        IssueModel.update({userId: req.body._id},{user: req.body.user},{multi: true}, function(err, issue) {
                            var response;
                            if(err){
                                response = {
                                    success: false,
                                    data: null
                                };
                            }else{
                                response = {
                                    success: true,
                                    data: []
                                };
                            }
                            res.json(response);
                        });
                    }

                });
            });
        }
    },
    users: {
        GET: function(req,res) {
            UserModel.find({},function(err,users){
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: users.reverse()
                    };
                }
                res.json(response);
            });
        }
    },

    client: {
        POST: function(req, res) {
            var response;
            var clientToWrite = {
                    name: req.body.name,
                    createdAt: new Date().getTime()
                },
                uss = new ClientModel(clientToWrite);

            uss.save(function (err, client) {
                if(err){
                    console.log(err);
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: client
                    };
                }
                res.json(response);
            });
        },
        GET: function(req,res) {
            ClientModel.find({},function(err,messages){
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: messages
                    };
                }
                res.json(response);
            });
        },
        DELETE: function(req,res) {
            ClientModel.findByIdAndRemove(req.params._id, function(err){
                var response;

                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: []
                    };
                }
                res.json(response);
            });
        },
        PUT: function(req,res) {
            var response;
            ClientModel.findById(req.body._id,function(err, user){
                user.update(req.body, null, function(err, result, raw){
                    if(err){
                        response = {
                            success: false,
                            data: null
                        };
                        res.json(response);
                    }else{
                        var success = true;
                        if(result.n === 0){
                            success = false;
                        }
                        IssueModel.update({clientId: req.body._id},{client: req.body.name},{multi: true},function(err, issue) {
                            var response;
                            if(err){
                                response = {
                                    success: false,
                                    data: null
                                };
                            }else{
                                response = {
                                    success: true,
                                    data: []
                                };
                            }
                            res.json(response);
                        });
                    }
                });
            });
        }
    },
    clients: {
        GET: function(req,res) {
            ClientModel.find({},function(err,clients){
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: clients.reverse()
                    };
                }
                res.json(response);
            });
        }
    },

    caller: {
        POST: function(req, res) {
            var response;
            var callerToWrite = {
                    name: req.body.name,
                    createdAt: new Date().getTime(),
                    phone: req.body.phone,
                    email: req.body.email,
                    clientId: req.body.clientId
                },
                uss = new CallerModel(callerToWrite);

            uss.save(function (err, caller) {
                if(err){
                    console.log(err);
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: caller
                    };
                }
                res.json(response);
            });
        },
        GET: function(req,res) {
            CallerModel.find({},function(err,messages){
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: messages
                    };
                }
                res.json(response);
            });
        },
        DELETE: function(req,res) {
            CallerModel.findByIdAndRemove(req.params._id, function(err){
                var response;

                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: []
                    };
                }
                res.json(response);
            });
        },
        PUT: function(req,res) {
            var response;
            CallerModel.findById(req.body._id,function(err, user){
                user.update(req.body, null, function(err, result, raw){
                    if(err){
                        response = {
                            success: false,
                            data: null
                        };
                        res.json(response);
                    }else{
                        var success = true;
                        if(result.n === 0){
                            success = false;
                        }
                        IssueModel.update({callerId: req.body._id},{callerName: req.body.name}, function(err, issue) {
                            var response;
                            if(err){
                                response = {
                                    success: false,
                                    data: null
                                };
                            }else{
                                response = {
                                    success: true,
                                    data: []
                                };
                            }
                            res.json(response);
                        });
                    }
                });
            });
        }
    },
    callers: {
        GET: function(req,res) {
            var callerQuery = {};
            if(req.query.clientId){
                callerQuery = {clientId: req.query.clientId};
            }
            CallerModel.find(callerQuery,function(err,callers){
                var response;
                if(err){
                    response = {
                        success: false,
                        data: null
                    };
                }else{
                    response = {
                        success: true,
                        data: callers.reverse()
                    };
                }
                res.json(response);
            });
        }
    },


    reports: {
        GET: function(req,res) {
            var queryType = req.query.type;
            var iq = req.query.query;
            var oneDayLater = new Date(req.query.to);
            oneDayLater.setDate(oneDayLater.getDate()+1);
            var dbQuery = {
                origTime: {
                    $gte: new Date(req.query.from).getTime(),
                    $lt: oneDayLater.getTime()
                    }
                };


            if(iq && iq.length>0){
                if(queryType === 'client'){
                    dbQuery.clientId = iq;
                }
                if(queryType === 'user'){
                    dbQuery.userId = iq;
                }
            }
            //dbQuery
            IssueModel.find(dbQuery, null, {sort: {origTime: -1}},function(err,issues){

                var response;
                if(err){
                    response = {
                        success: false,
                        data: err
                    };
                    res.json(response);
                }else{
                    if(!req.query.action){
                        response = {
                            success: true,
                            data: issues.reverse()
                        };
                        res.json(response);
                    }else{
                        var data = [];
                        for(var i=0;i<issues.length;i++){
                            var iss = issues[i];
                            var sortedLog = _.sortBy(iss.history,'issueTime');
                            for(j=0;j<sortedLog.length;j++){
                                var issn = {};
                                issn['Utilizator'] = iss.user;
                                issn['Client'] = iss.client;
                                issn['Pasager'] = iss.passenger||'';
                                issn['Apelant'] = iss.callerName||'';
                                issn['Telefon'] = iss.callerPhone||'';
                                issn['Email'] = iss.callerEmail||'';
                                issn['Numar referinta'] = iss.ref || '';
                                issn['Data crearii'] = getEventDate(iss.createdAt);
                                issn['Ora crearii'] = getEventTime(iss.createdAt);
                                issn['Urgenta'] = sortedLog[j].issue;
                                issn['Solutia'] = sortedLog[j].solution;
                                issn['Timp raspuns'] = sortedLog[j].responseTime;
                                issn['Data urgentei'] = getEventDate(sortedLog[j].issueTime);
                                issn['Ora urgentei'] = getEventTime(sortedLog[j].issueTime);
                                data.push(issn);
                            }
                        }
                        res.setHeader('Content-disposition', 'attachment; filename=raport_'+(new Date().getTime().toString())+'.csv');
                        json2csv({data: data,fields: ['Utilizator','Data urgentei','Ora urgentei','Client','Pasager','Apelant','Telefon','Email','Urgenta','Solutia','Timp raspuns','Numar referinta','Data crearii','Ora crearii']}, function(err, csv) {
                            if (err) console.log(err);
                            res.send(csv);
                        });
                    }
                }
            });
        }
    }
};