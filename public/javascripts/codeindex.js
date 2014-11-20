$(function() {
    var i = $('input[name="query"]');
    i.on('keyup', function() {
        delay(function() {
            var val = $('input').val();
            if (val.length >= 3) {
                $.getJSON('/query/' + val)
                .done(function(resp) {
                    var results = $('.results').empty();
                    var data = resp;
                    data.forEach(function(el) {
                        var result = $('<div/>', {'class': 'result'});
                        var path = $('<div/>').text(el.path_t);
                        var code = $('<pre/>').append($('<code/>', {'class': 'language-javascript'}).text(el.content_t));
                        result.append(path);
                        result.append(code);
                        results.append(result);
                    });
                }).always(function() {
                    Prism.highlightAll();
                });
            } else {
                $('.result').empty();
            }
        }, 600);
    });
    
    var j = $('input[type="button"]');
    j.on('click', function() {
        $('.message').text('').fadeIn();
        j.attr('disabled', true);

        var path = $('input[name="index"]').val();
        if (path.length < 5) {
            $('.message').text('Path too short');
            reset();
            return;
        }
        $.ajax('/doindex', { type: 'POST', data: { path : path }})
        .done(function(data) {
            $('.message').text(data);
            $('input[name="index"]').val('');
            i.focus();
        }).fail(function(xhr, type, msg) {
            $('.message').text(xhr.responseText);
        }).always(function() {
            reset();
        });
    });
    
    function reset() {
        j.attr('disabled', false);
        setTimeout(function() {
            $('.message').fadeOut();
        }, 5000);
    }
});

var delay = (function() {
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();