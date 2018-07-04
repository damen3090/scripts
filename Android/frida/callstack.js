Java.perform(function () {
    // Function to hook is defined here
    var Activity = Java.use('me.5alt.test.MainActivity');
    var Exc = Java.use('java.lang.Exception');
    var LLog = Java.use('android.util.Log');

    Activity.testmethod.implementation = function (a) {
        var e = Exc.$new("");
        var log = LLog.$new();
        console.log(log.getStackTraceString(e));
        return "hacked";
    };
});