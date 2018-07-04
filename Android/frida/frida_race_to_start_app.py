import frida
import subprocess
import sys
import time
import platform
import os


def on_message(message ,data):
    print message 


def get_process_pid(device, application_name):
    """
    :param device:
    :param application_name:
    :return:
    """
    for p in device.enumerate_processes():
        if p.name == application_name:
            return p.pid
    return -1


jscode='''

console.log("---------- frida hook dlopen begin ----------");

Interceptor.attach(Module.findExportByName("libart.so", "JNI_OnLoad"), {
    onEnter: function(args) {

        this.path = Memory.readUtf8String(args[0]);
        console.log("dlopen : "+this.path);

    },
    onLeave:function(retval){
        if (!retval.isNull() && this.path.indexOf("libart.so") !== -1)
        {
        console.log("find libart.so");
        }
    }
});


'''


def exec_command(*args):
    """

    :param args:
    :return:
    """

    def make_str(x):
        current_os = platform.system().lower()
        return x.decode(locale.getpreferredencoding()) if current_os == "windows" \
            else x.decode("utf-8")

    p = subprocess.Popen(args,
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE)
    _stdout, _stderr = p.communicate()
    if p.returncode != 0:
        logger.error("stderr:\n{0}".format(make_str(_stderr)))
        raise RuntimeError("exec_command {0} failed.".format(args[0]))

    return make_str(_stdout)

def hook_begin(package_name):
    """
    :param package_name:
    :param script_path:
    :return:
    """
    print("[*] Staring hook")
    
    # re-run the process.
    device = frida.get_usb_device()
    
    pid = get_process_pid(device, package_name)
    if pid != -1:
        #kill the process and others related
        tmp = exec_command("adb", "shell", "su", "-c",
                                "\"ps | grep {0}\"".format(package_name))
        if len(tmp):
            tmp = tmp.splitlines()
            for line in tmp:
                pid = line.split()[1]
                print "killing {0}".format(pid)
                try:
                    exec_command("adb", "shell", "su", "-c",
                                  "\"kill {0}\"".format(pid))
                except Exception:
                    pass

    exec_command("adb", "shell", "monkey", "-p",
                      package_name, "-c", "android.intent.category.LAUNCHER", "1")

    pid = -1
    for i in range(15):
        pid = get_process_pid(device, package_name)
        if pid != -1:
            print "restart app and get the pid :",pid
            break
        time.sleep(0.05)

    if pid == -1:
        print "Run package {0} failed.".format(package_name)
        return

    print "Injecting to {0}({1})".format(package_name, pid)


    
    process = device.attach(package_name)
    script = process.create_script(jscode)
    script.on('message', on_message)
    script.load()
    sys.stdin.read()

if __name__ == '__main__':
    
    #package_name = "com.eg.android.AlipayGphone"
    package_name = "com.tencent.mm"
    hook_begin(package_name)
