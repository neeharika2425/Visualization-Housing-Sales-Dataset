import sys
import re
import json
csv_data = open('circle_data.csv','r').readlines()
write_data = open('circle_data.json','w')
cnt = 0
ind = -1
data = {'name' : 'houses','children':[]}
cnt = 0
ind = -1
data = {'name' : 'houses','children':[]}
#print len(csv_data)
for each in csv_data:
	if cnt == 0 or cnt ==1 :
		cnt = cnt + 1
		continue
	else:
		words = re.split('[. , \n]',each)
		#print words
		if words[2] == '':
			data['children'].append({'name' : words[1],'children':[]})
			ind = ind + 1
			data['children'][ind]['children'] = []
		else:
			data['children'][ind]['children'].append({'name' : words[2] ,'size':words[3]})
			# else:
			# 	data['children']['children']['children'].append({'name' : words[2] ,'size':words[4]})
#print data

r = json.dumps(data)
#file.write(str(r['rating']))
write_data.write(r)
print r