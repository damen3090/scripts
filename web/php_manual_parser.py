from bs4 import BeautifulSoup
import glob

# http://php.net/download-docs.php
# Many HTML files

path = '/private/tmp/php-chunked-xhtml/'

for p in glob.glob(path+'/function.*.html'):
	#print p
	with open(p, 'r') as f:
		html_doc = f.read()

	soup = BeautifulSoup(html_doc, "lxml")
	func_area = soup.select('.methodsynopsis')
	if func_area:
		func_area = func_area[0]
		print func_area.select('.type')[0].text, func_area.select('.methodname')[0].text, [i.text for i in func_area.select('.methodparam') if i.text != 'void']


