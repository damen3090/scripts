from seleniumrequests import Remote
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

import os
import requests

driver_port=62320

service_url = "http://localhost:%d" % driver_port

try:
	requests.get(service_url)
except:
	chromedriver = "chromedriver"
	service = Service(os.path.abspath(chromedriver), port=driver_port)
	service.start()


print service_url

chrome_options = Options()
chrome_options.add_argument("--headless")  
chrome_options.binary_location = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'   

browser = Remote(service_url, desired_capabilities=chrome_options.to_capabilities())

print dir(browser.request('POST', 'http://127.0.0.1/post.php', data="sssss", headers={}))
