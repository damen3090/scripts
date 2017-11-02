import binascii

def utf8_none_shortest(data):
    one =   int(binascii.hexlify(data), 16)
    two =   0b1100000010000000
    three = 0b111000001000000010000000
    four =  0b11110000100000001000000010000000

    collection = [one, two, three, four]

    internum = ((one&0b01000000) << 2) | (one & 0b00111111)

    def checkrange(one):
        if one <= 0x7f:
            return 1
        elif one <= 0x7ff:
            return 2
        elif one <= 0xffff:
            return 3
        else:
            return 4

    def transform(one):
        p = []
        p.append( one & 0b111111 )
        p.append( (one & 0b111111000000) << 2 )
        p.append( (one & 0b111111000000000000) << 4 )
        p.append( (one & 0b111000000000000000000) << 6 )

        r = checkrange(one)

        return reduce(lambda a,b:a|b, p[:r])

    internum = transform(one)

    return map(lambda x:hex(x|internum), collection[checkrange(one)-1:])


data = '\x22\x3e'
print utf8_none_shortest(data)
