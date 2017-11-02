# pip install ply==3.4
# pip install slimit

from slimit.parser import Parser
from slimit.lexer import Lexer
from slimit.visitors import nodevisitor
from slimit import ast
from bs4 import BeautifulSoup

import requests

def print_around(find, code):
	codel = code.split('\n')
	codelen = len(codel)
	for i in range(codelen):
		if find in codel[i]:
			print '\n'.join(codel[(i-3 if i-3>0 else 0): (i+5 if i+5<codelen else codelen)])

page = requests.get('http://5alt.me').text
soup = BeautifulSoup(page, 'lxml') 
scripts = [s.text for s in soup('script')]

for jscode in scripts:
	parser = Parser()
	tree = parser.parse(jscode)
	code = tree.to_ecma()

	for node in nodevisitor.visit(tree):
		if isinstance(node, ast.String) and '/' in node.value:
			print '-'*10 + node.value + '-'*10
			print_around(node.value, code)
			

