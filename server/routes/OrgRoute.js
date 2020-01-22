const express = require('express');
const app = express();
const OrgRoute = express.Router();
let Org = require('../models/Org');

OrgRoute.route('/').get(function (req, res) {
    console.log(req.query);
    Org.find(req.query, function (err, organizations) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(organizations);
        }
    });
});

OrgRoute.route('/:id').get(function (req, res) {
    console.log(req.query);
    Org.findOne({ _id: req.params.id }, function (err, organization) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(organization);
        }
    });
});

OrgRoute.route('/add').post(function (req, res) {
    let org = new Org(req.body);
    org.save()
      .then(org => {
        res.status(200).json(org);
      })
      .catch(err => {
        res.status(400).send("unable to save to database " + err);
      });
  });

OrgRoute.route('/addDb').post(function (req, res) {
    let organization = new Org(req.body);
    organization.save()
        .then(organization => {
            console.log("dbObj name is " + organization.dbName);
            let MongoOrg = require('mongodb').MongoOrg;
            var url = "mongodb://localhost:27017/" + organization.dbName;

            MongoOrg.connect(url)
                .then(mongoOrg => {
                    let db = mongoOrg.db();
                    console.log('the current database is: ' + db.s.databaseName);
                    var myobj = { event: "organization is created", datetime: new Date() };
                    db.collection("logs").insertOne(myobj, function (err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        //db.close();
                    });
                })
                .catch(err => console.log(err));

            res.status(200).json(organization);
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

OrgRoute.route('/update/:id').put(function (req, res) {
    delete req.body._id;
    console.log("modfiedOrg is " + req.body);
    let organization = new Org(req.body);
    delete organization._id;
    Org.update({ organizationId: organization.organizationId }, { $set: organization }, function (err, organization) {
        if (err) {
            console.log(err);
        }
        console.log("RESULT: " + organization);
        res.send('Done')
    });
});

OrgRoute.route('/delete/:id').get(function (req, res) {
    Org.findByIdAndRemove({ _id: req.params.id }, function (err, organization) {
        if (err) res.json(err);
        else res.json(req.params.id);
    });
});


module.exports = OrgRoute;