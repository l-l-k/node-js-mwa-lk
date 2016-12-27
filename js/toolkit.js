function createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getDay() {
    var now = new Date();
    return now.getFullYear + "-" + now.getMonth + "-" + now.getDate;
}

function getTime() {
    var now = new Date();
    return now.getHours + ":" + now.getMinutes + ":" + now.getSeconds;
}

function isEven(number) {
    return (number % 2) == 0;
}  