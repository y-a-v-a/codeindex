var express = require('express');
var router = express.Router();
var solr = require('../lib/solr');

router.get('/', function(req, res) {
    res.render('index', { title: 'Code Search' });
});

router.get('/query/:query', function(req, res) {
    res.send(req.result);
});

router.post('/doindex', function(req, res) {
    var path = req.body.path || '';
    solr.addFromPathToIndex(path, function(err) {
        if (err) {
            res.status(422).send(err.message);
        }
        res.status(200).send('Done reindexing ' + path);
    });
});

module.exports = router;

router.param('query', function(req, res, next, query) {
    solr.queryIndex(query, function(err, result) {
        if (err) console.log(err);
        req.result = result;
        next();
    });
});