# binwalk -v flash.bin > binwalk.txt

import re, os

filename = "flash.bin" 
binwalklog = "binwalk.txt" 

with open(binwalklog, 'r') as f:
	data = f.read()
with open(filename, 'rb') as f:
	rom = f.read()


filesize = os.path.getsize(filename)

pattern = re.compile(r"(\d{0,9})\s{0,30}0x\w{0,9}\s{0,30}(.*)$", re.M)
finds =  re.findall(pattern, data)
finds.append((filesize, "file end"))
#print finds
for i in range(len(finds)-1):
	csize, ctext = finds[i]
	csize = int(csize)
	nsize, ntext = finds[i+1]
	nsize = int(nsize)
	if 'Zip archive data' in ctext or 'LZMA compressed data' in ctext:
		#print csize, ctext
		tmpdata = rom[csize: nsize]
		print csize, nsize, len(tmpdata)
		
		with open("tmp_out", 'wb') as fp:
			fp.write(tmpdata)
			fp.close()
		os.system("7z x -aoa tmp_out")
		