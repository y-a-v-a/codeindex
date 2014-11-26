var fs = require('fs');
var solr = require('solr-client');
var crypto = require('crypto');
var prism = require('./prism.js');

var client = solr.createClient();

//addFromPathToIndex('../pblog');

exports.addFromPathToIndex = addFromPathToIndex;
exports.queryIndex = queryIndex;
exports.deleteById = deleteById;

function addFromPathToIndex(path, fn) {
    if (!fs.existsSync(path) || !/Sites/.test(path)) {
        fn(new Error('Path does not exist or not allowed.'));
    }
    walk(path, function(err, files) {
        if (err) {
            return;
        }
        files.forEach(function(file, idx) {
            var realPath, fileName, content;
            if (/\.js$/.test(file) && !/.*node_modules.*/.test(file)) {

                realPath = fs.realpathSync(file);
                fileName = realPath.split('/').pop();
                content = fs.readFileSync(realPath).toString('utf8');
                
                client.add({ id : md5(content), name_t : fileName, path_t: realPath, content_t: content }, function(err, obj) {
                   if (err) {
                       console.log(err);
                       fn(err);
                       return;
                   } else {
                       console.log('Solr response:', obj);
                       
                       // Commit your changes without options
                       client.commit(function(err, res) {
                           if(err) console.log(err);
                           if(res) console.log(res);
                       });
                   }
                });
            }
            if (idx === files.length - 1) {
                setTimeout(function() {
                    fn();
                }, 300);
            }
        });

    });
}

function queryIndex(string, fn) {
    // hl.snippets=4&hl.mergeContiguous=true&hl.fragsize=200&hl.bs.maxScan=20&hl.bs.chars=(){};\n&hl.bs.type=LINE&hl.useFastVectorHighlighter=true
    // hl.snippets=4&hl.mergeContiguous=true&hl.fragsize=100&hl.bs.maxScan=50&hl.bs.type=LINE&hl.useFastVectorHighlighter=true
    var q = string;
    var params = [
        'q=content_t:' + q,
        'start=0',
        'rows=10',
        'hl=true',
        'hl.fl=content_t',
        'hl.snippets=4',
        'hl.mergeContiguous=true',
        'hl.fragsize=300',
        'hl.boundaryScanner=breakIterator',
        // 'hl.bs.chars=' + encodeURIComponent('\n.'),
        'hl.bs.maxScan=60',
        'hl.bs.type=LINE',
        'hl.useFastVectorHighlighter=true',
        'hl.tag.pre=%20',
        'hl.tag.post=%20'
    ];
    var request = client.search(params.join('&'), function(err, obj) {
        if (err) {
            console.log(err);
            fn(err);
        }
        // if (obj && obj.response.docs) {
        //     fn(null, obj.response.docs);
        // }
        if (obj && obj.highlighting) {
            decorate(obj, fn);
            //fn(null, obj);
        }
    });

    request.setTimeout(200, function() {
        console.log('Search timeout!');
    });
}

function deleteById(id) {
    client.deleteByID(id, function(err,obj) {
       if(err) {
           console.log(err);
       } else {
           console.log(obj);
       }
    });

    client.commit();
}


function md5(str) {
    return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

function decorate(obj, fn) {
    if (obj.highlighting) {
        var keys = Object.keys(obj.highlighting);
        for (var i = 0; i < keys.length; i++) {
            if (!obj.highlighting[keys[i]].content_t) {
                continue;
            }
            obj.highlighting[keys[i]].content_t = obj.highlighting[keys[i]].content_t.map(function(el) {
                var r = prism.highlight(el.replace(/^[\t\n]|[\t\n]$/,''), prism.languages.javascript);
                return r;
            });
        }
    }
    fn(null, obj);
}
