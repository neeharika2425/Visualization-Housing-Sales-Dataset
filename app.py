import sys
import csv
import random
import pandas as pd
import matplotlib.pyplot as plt
import seaborn
from sklearn.cluster import KMeans
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.spatial.distance import cdist, pdist
from sklearn import cluster as Kcluster, metrics as SK_Metrics
from sklearn.manifold import Isomap,MDS
import json
import math
import matplotlib
import matplotlib.pyplot as plt
from flask import Flask, make_response
from flask import render_template

app = Flask(__name__)
vis_data = {}
inputDF = pd.read_csv(sys.argv[1])

def ramdom_sampling(data,percent):
	row_count = len(data)
	random_list = random.sample(range(0,len(data)), int(percent*row_count))
	df=data.ix[random_list]
	return df

def k_mean_clustering(data,groups,percent):
	kmeans=KMeans(n_clusters=groups)
	kmeans.fit(data)
	data['label'] = kmeans.labels_
	row_nums=[]
	for i in range(0,groups):
		data_group=data[data['label']==i]
		num=int(len(data_group)*percent)
		row=random.sample(range(0,len(data_group)),num)
		row_nums=row_nums+row;
	data.drop('label', axis=1, inplace=True)
	df=data.ix[row_nums]
	return df

def screeData(data):
    X_std = StandardScaler().fit_transform(data)
    cor_mat1 = np.corrcoef(X_std.T)
    num_vars=len(data.columns)
        #print cor_mat1
    eig_vals, eig_vecs = np.linalg.eig(cor_mat1)
    eig_vals=sorted(eig_vals,reverse=True)
    count=0
    for i in eig_vals:
        if i>1:
            count = count + 1
    print (count)
    my_model = PCA(8)
    model_transform= my_model.fit_transform(data)
    loadings = my_model.components_.T
    sq_loading = [0] * num_vars
    i=0
    for itr in loadings:
        for val in itr:
            sq_loading[i]= sq_loading[i] + math.pow(val, 2)
        i=i+1
    
    N = len(sq_loading)
    x = range(N)
    min_sq = min(sq_loading)
    max_sq =max(sq_loading)
    sq_loading = [(i-min_sq)/(max_sq-min_sq) for i in sq_loading]
    #print (pd.DataFrame([math.log(y,10) for y in sq_loading]))
    return pd.DataFrame(sq_loading)
    #return pd.DataFrame([math.log(y,10) for y in sq_loading])

@app.route('/')
def index():
	return make_response(open('index.html').read())

@app.route('/api/<string:id>')
def api(id):
	if id == 'sunburn':
		return make_response(vis_data[id])
	elif id == 'span':
		return make_response(vis_data[id].to_csv(index = False))
	elif id == 'sq_load':
		print (vis_data[id])
		return make_response(vis_data[id].to_csv(index = False))
	else:
		print (id)
		id = id.split('-')
		print (len(id))
		if len(id)==1:
			#print vis_data['total'];
			return make_response(vis_data['total'].to_csv(index = False))
		elif len(id)==2:
			df=vis_data['total']
			x = int(id[1])
			vis_data['zipcode'] = df[(df['zipcode']==x)]
			#print vis_data['zipcode']
			return make_response(vis_data['zipcode'].to_csv(index = False))
		else:
			df=vis_data['total']
			x = int(id[1])
			y = int(id[2])
			vis_data['bedrooms'] = df[(df['zipcode']==x) & (df['bedrooms']==y)]
			return make_response(vis_data['bedrooms'].to_csv(index = False))



def datacleaning(df):
	zip = df['zipcode']
	zip = zip.unique()
	row_count = len(zip)
	percent = 0.5
	random_list = random.sample(range(0,len(zip)), int(percent*row_count))
	zip=zip[random_list]
	#print zip
	df = df[(df['zipcode'].isin(zip)) & (df['price']<100000) & (df['price']>1000)]
	return df.to_csv("C:\project\house.csv",index = False)

def spanchart(df):
	idx_max = df.loc[df.reset_index().groupby(['zipcode'])['price'].idxmax()]
	idx_min = df.loc[df.reset_index().groupby(['zipcode'])['price'].idxmin()]
	x=pd.DataFrame(idx_min[['zipcode','price']]).reset_index()
	x.columns=["index_min","zipcode_min","min_price"]
	z=pd.DataFrame(idx_max[['zipcode','price']]).reset_index()
	z.columns=["index_max","zipcode_max","max_price"]
	col=x.join([z])
	col=col[['zipcode_min','min_price','max_price']]
	col=col[(col['min_price'] != col['max_price'])]
	#print col
	vis_data["span"] = col


def visualization_data(data, type):	
	if type == 'data':
		vis_data['data'] = data
	if type == 'sunburn':
		vis_data['sunburn'] = data
	# n_cols = len(data.columns)
	# print(n_cols)
	# attr_list = pd.DataFrame(list(range(1,n_cols)))
	# attr_list.columns = ["index"]
	# data[0].columns = ["random"]
	# sample = attr_list.join([data[0]])
	# vis_data['scree_plot'] = sample
	if type == 'screeData':
		col = pd.DataFrame(inputDF.columns)
		col.columns = ["index"]
		data.columns = ["random"]	
		sample = data.join(col)
		#print (sample)
		vis_data['sq_load'] = sample

if __name__ == '__main__':
	#inputDF = k_mean_clustering(inputDF,4,0.8);
	#inputDF=ramdom_sampling(inputDF,0.5)
	vis_data['total'] = inputDF
	#print (inputDF)
	#csv_data = datacleaning(inputDF)
	#df = pd.read_csv("C:\project\house.csv")
	#print (len(df))
	visualization_data(inputDF,'data')
	spanchart(inputDF)
	json_data=open('circle_data.json').read()
	data = json.loads(json_data)
	visualization_data(json_data,'sunburn')

	visualization_data(screeData(inputDF),"screeData")

	app.run(debug = True)