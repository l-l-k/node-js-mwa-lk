export class Toolkit {

    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getDay() {
        var now = new Date();
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var day = ("0" + now.getDate()).slice(-2)
        return now.getFullYear() + "-" + month + "-" + day;
    }

    getTime() {
        var now = new Date();
        return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    }

    getDay(datum) {
        var month = ("0" + (datum.getMonth())).slice(-2);
        var day = ("0" + datum.getDate()).slice(-2)
        return datum.getFullYear() + "-" + month + "-" + day;
    }

    getTimestamp(datum) {
        var timestamp = datum.getUTCFullYear() + '-' +
            ('00' + (datum.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + datum.getUTCDate()).slice(-2) + ' ' +
            ('00' + datum.getUTCHours()).slice(-2) + ':' +
            ('00' + datum.getUTCMinutes()).slice(-2) + ':' +
            ('00' + datum.getUTCSeconds()).slice(-2);
        return timestamp;
    }

    getTimestampOfFirstDay(datum) {
        var timestamp = datum.getUTCFullYear() + '-' +
            ('00' + (datum.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + datum.getUTCDate()).slice(-2) + ' ' +
            '00' + ':' + '00' + ':' + '00';
        return timestamp;
    }

    getTimestampOfLastDay(datum) {
        var timestamp = datum.getUTCFullYear() + '-' +
            ('00' + (datum.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + datum.getUTCDate()).slice(-2) + ' ' +
            '23' + ':' + '59' + ':' + '59';
        return timestamp;
    }

    setToday(today) {
        var now = new Date();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        today = new Date(now.getFullYear(), month, day, 0, 0, 0, 0);
    }

    isEven(number) {
        return (number % 2) == 0;
    }

    resetSelectionRange() {
        selectionRange = [-1, -1];
    }

}