var modules = Object.keys(data);
var newNode = document.getElementById('item').cloneNode(true);

var findModule = function(partial) {
    var regex = new RegExp(partial)
    for (var i = 0; i < modules.length; i++) {
        if (modules[i].match(regex)) {
            return modules[i];
        }
    }
    return '';
};

var timeout;

document.getElementById('search').oninput = function () {

    var guess = document.getElementById('search').value;

    clearTimeout(timeout);

    if (guess.length > 2) {

        var f = function() {

            var results = search(data, guess);
            addNodes(results.length);
            results.forEach(fill);
        };

        timeout = setTimeout(f, 300);
    }

};

var fill = function(obj, i) {

    Object.keys(obj).forEach(function(key) {

        if (obj[key] instanceof Object) fill(obj[key], i);

        if (0 === document.getElementsByName(key).length) return;

        document.getElementsByName(key)[i].innerHTML = obj[key];
    });
};

var addNodes = function(i) {

    document.getElementById('items').innerHTML = '';

    if (i == 0) {

        document.getElementById('items').appendChild(newNode.cloneNode(true));

    }
    while (i-- > 0) {

        document.getElementById('items').appendChild(newNode.cloneNode(true));

    }
};

var search = function(data, needle) {

    results = [];
    var reg = new RegExp(needle, 'i');

    Object.keys(data).forEach(function(e) {

        if (results.length == 10) return;

        data[e].code = e;

        var result = reg.test(data[e].description) ||
                reg.test(data[e].code) ||
                reg.test(data[e].coord);

        if ('lecturers' in data[e]) {
            result |= data[e].lecturers.reduce(function(prev, l) {
                return prev || reg.test(l);
            }, false);
        }

        if (result) {
            results.push(data[e]);
        }

    });

    return results;
};