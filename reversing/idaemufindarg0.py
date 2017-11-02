import sark
from unicorn import *
from unicorn.arm_const import *

def detectMovR0Const(line):
	return len(line.insn.operands)==2 and line.insn.operands[0].text == 'R0' and line.insn.mnem.startswith('MOV') and len(line.insn.regs) == 1

def simulate(code):
	ADDRESS    = 0x10000
	mu = Uc(UC_ARCH_ARM, UC_MODE_THUMB)
	mu.mem_map(ADDRESS, 2 * 1024 * 1024)
	mu.mem_write(ADDRESS, code)
	mu.emu_start(ADDRESS | 1, ADDRESS + len(code))
	return mu.reg_read(UC_ARM_REG_R0)

left = []

system_addr = 0x0933C
printf_addr = 0x9174
sprintf_addr = 0x9470

address = sprintf_addr

my_line = sark.Line(address)
for xref in my_line.xrefs_to:
	line = sark.Line(xref.frm)
	code = ''
	for i in range(20):
		if detectMovR0Const(line):
			code = line.bytes + code
		line = line.prev
	r0 = simulate(code)
	print '---',r0
	arg = sark.Line(r0)
	if arg.is_string:
		print arg
	else:
		left.append(sark.Line(xref.frm))

print len(left)
print left
