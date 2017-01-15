module.exports = {
    
        createGuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        getDay: function (timestamp) {
            var now;
            if (timestamp == null) {
                now = new Date();
            } else {
                now = Date.parse(timestamp);
            }
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var day = ("0" + now.getDate()).slice(-2)
            return now.getFullYear() + "-" + month + "-" + day;
        },

        getDayFromTimestamp: function (timestamp) {

        },

        getTime: function () {
            var now;
            if (timestamp == null) {
                now = new Date();
            } else {
                now = Date.parse(timestamp);
            }
            return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        },

        isEven: function (number) {
            return (number % 2) == 0;
        },

        resetSelectionRange: function () {
            selectionRange = [-1, -1];
        },

}