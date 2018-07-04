import os

def tap(x, y):
	cmd = 'adb shell input tap {x} {y}'
	os.system(cmd.format(x=x, y=y))

def sendtext(text):
	cmd = 'adb shell input text "{text}"'
	os.system(cmd.format(text=text.replace(" ", "%%s")))

def swap(sx, sy, dx, dy, duration=1000):
	cmd = "adb shell input swipe {sx} {sy} {dx} {dy} {duration}"
	os.system(cmd.format(sx=sx, sy=sy, dx=dx, dy=dy, duration=duration))

def longpress(x, y, duration=1000):
	# duration: ms
	cmd = "adb shell input swipe {sx} {sy} {dx} {dy} {duration}"
	os.system(cmd.format(sx=x, sy=y, dx=x, dy=y, duration=duration))

def keyevent(keycode):
	# https://developer.android.com/reference/android/view/KeyEvent.html#KEYCODE_0
	cmd = 'adb shell input keyevent "{keycode}"'
	os.system(cmd.format(keycode=keycode)