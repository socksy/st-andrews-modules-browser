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
            addNodes(Object.keys(results).length);
            Object.keys(results).forEach(function(k, i) {
                fill(results[k], i);
            });
            showStats(results);
        };

        timeout = setTimeout(f, 300);

    } else if (guess.trim() === '') {
        showStats(data);
    }

};

var fill = function(obj, i) {

    if (i > 29) return;

    Object.keys(obj).forEach(function(key) {

        if (obj[key] instanceof Object) fill(obj[key], i);

        if (0 === document.getElementsByName(key).length) return;

        document.getElementsByName(key)[i].innerHTML = obj[key];
    });
};

var addNodes = function(i) {

    console.time("Adding Nodes")

    i = i > 30 ? 30 : i;

    document.getElementById('items').innerHTML = '';

    if (i == 0) {

        document.getElementById('items').appendChild(newNode.cloneNode(true));

    }
    while (i-- > 0) {

        document.getElementById('items').appendChild(newNode.cloneNode(true));

    }

    console.timeEnd("Adding Nodes")

};

var search = function(data, needle) {

    console.time("Searching")

    results = {};

    var reg = new RegExp(needle, 'i');

    Object.keys(data).forEach(function(e) {


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
            results[e] = data[e];
        }

    });

    console.timeEnd("Searching")

    return results;
};

var stats = function(data) {

    var statsObj = {};

    statsObj.n = Object.keys(data).length;

    var subjectCounts = {};

    Object.keys(data).forEach(function(e) {
        var s = e.substring(0,2);
        if (!(s in subjectCounts)) subjectCounts[s] = 0;
        subjectCounts[s]++;
    });

    console.log(subjectCounts)

    var zip = Object.keys(subjectCounts).reduce(function(prev, cur){
        return prev.concat(new Array([cur, subjectCounts[cur]]));
    }, new Array());

    zip = zip.sort(function (a, b) {
        if (a[1] < b[1]) {
            return 1;
        }
        if (a[1] > b[1]) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    statsObj.top = zip[0][0];

    statsObj.topn = zip[0][1];

    statsObj.nSub = Object.keys(subjectCounts).length;

    return statsObj;
};

var showStats = function(data) {
    var st = stats(data);
    Object.keys(st).forEach(function(e) {
       document.getElementById(e).innerHTML = st[e];
    });
};

showStats(data);