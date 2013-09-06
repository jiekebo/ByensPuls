import sys

def main():
	outstring = ""
	with open(sys.argv[1]) as f:
		content = f.readlines()
		for coordinates in content:
			x, y = coordinates.split(',')
			convertedx = float(x) * 10000 / 1440
			convertedy = float(y) * 10000 / 743
			outstring += str(int(round(convertedx))) + ", " + str(int(round(convertedy))) + "\n"
	outf = file(sys.argv[1]+'conv', 'w')
	outf.write(outstring)


if __name__ == "__main__":
	main()

#	1440
#	743