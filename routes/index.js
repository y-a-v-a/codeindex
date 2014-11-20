var express = require('express');
var router = express.Router();
var solr = require('../lib/solr');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Code Search' });
});

router.get('/query/:query', function(req, res){
    // console.log(req.result);
    res.send(req.result);
    // res.render('index', { title: 'Express' });
});

module.exports = router;


router.param('query', function(req, res, next, query) {
    solr.queryIndex(query, function(err, result) {
        if (err) console.log(err);
        req.result = result;
        next();
    });
});