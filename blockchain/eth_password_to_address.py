import glob, json
import hashlib
from ethereum.utils import privtoaddr, checksum_encode


address = {}

dicts = glob.glob('./dicts/*.txt')

passwords = set()
for d in dicts:
	with open(d, 'r') as f:
		data = f.read().strip().split('\n')
	for d in data:
		passwords.add(d.strip())

for p in passwords:
	pk = hashlib.sha256(p.encode()).hexdigest()
	pubkey = privtoaddr(pk).hex()
	#addr = checksum_encode(pubkey)
	addr = '0x' + pubkey
	address[addr] = 'sha256: ' + p + '|0x' + pk

	pk = hashlib.sha256(p.encode()).hexdigest()
	pk = hashlib.sha256(pk.encode()).hexdigest()
	pubkey = privtoaddr(pk).hex()
	#addr = checksum_encode(pubkey)
	addr = '0x' + pubkey
	address[addr] = 'sha256(sha256()): ' + p + '|0x' + pk

	pk = hashlib.md5(p.encode()).hexdigest() * 2
	pubkey = privtoaddr(pk).hex()
	#addr = checksum_encode(pubkey)
	addr = '0x' + pubkey
	address[addr] = 'md5*2 : ' + p + '|0x' + pk

json.dump(address, open('address.json', 'w'))