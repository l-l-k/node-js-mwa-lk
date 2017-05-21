export class Toolkit{

    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getDay () {
        var now = new Date();
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var day = ("0" + now.getDate()).slice(-2)
        return now.getFullYear() + "-" + month + "-" + day;
    }

    getTime () {
        var now = new Date();
        return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    }

    isEven(number) {
        return (number % 2) == 0;
    }

    resetSelectionRange () {
        selectionRange = [-1, -1];
    }

}