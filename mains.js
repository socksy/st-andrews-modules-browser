var modules = Object.keys(data);

var findModule = function(partial) {
    var regex = new RegExp(partial)
    for (var i = 0; i < modules.length; i++) {
        if (modules[i].match(regex)) {
            return modules[i];
        }
    }
    return '';
};

document.getElementById('code').oninput = function () {
    var guess = document.getElementById('code').value.toUpperCase();
    if(guess in data) {
        fill(data[guess]);
    }
};

var fill = function(obj) {
    Object.keys(obj).forEach(function(key) {
        if (obj[key] instanceof Object) fill(obj[key]);
        if (null === document.getElementById(key)) return;
        document.getElementById(key).innerHTML = obj[key];
    });
};