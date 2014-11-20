$(function() {
    var i = $('input');
    i.on('keyup', function() {
        mydelay(function() {
            var val = $('input').val();
            if (val.length >= 3) {
                $.getJSON('/query/' + val)
                .done(function(resp) {
                    var d = $('.results').empty();
                    var data = resp;
                    data.forEach(function(el) {
                        var a = $('<div/>', {'class': 'result'});
                        a.append($('<div/>').text(el.path_t));
                        a.append($('<pre/>').append($('<code/>', {'class': 'language-javascript'}).text(el.content_t)));
                        d.append(a);
                    });
                }).always(function() {
                    // Prism.highlightAll();
                });
            } else {
                $('.result').empty();
            }
        }, 600);
    });
});

var mydelay = (function() {
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();