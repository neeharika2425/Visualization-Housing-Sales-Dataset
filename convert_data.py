import sys
import json
import re
data = open('house.csv','r').readlines()
data_dict = {}
for each in data:
	attr = each.split(',')
	if attr[13] in data_dict:
		if attr[2] in data_dict[attr[13]]:
			data_dict[attr[13]][attr[2]] += 1
		else:
			data_dict[attr[13]][attr[2]] = 1
	else:
		data_dict[attr[13]] = {}
		data_dict[attr[13]][attr[2]] = 1
#print data_dict

output = open('circle_data.csv','w')
output.write("id,value\n")
output.write("houses,\n")
for key,val in data_dict.iteritems():
	output.write("houses." + key + "," + "\n")
	for freq in val:
		output.write("houses." + key + "." )
		output.write(freq + "," + str(val[freq]) + "\n")



