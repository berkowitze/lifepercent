#from psycopg2 import connect as psyconnect
#from config import from_object
from flask import Flask, request, session, g, redirect, \
	url_for, abort, render_template, flash

app = Flask(__name__)
app.debug = True

@app.route('/')
@app.route('/<arg>/')
def main(arg='999-999-999-999-999'):
	arg_list = map(lambda x: int(x), arg.split('-'))
	var = {
		'cob': arg_list[0],
		'dob': arg_list[1],
		'mob': arg_list[2],
		'yob': arg_list[3],
		'gen': arg_list[4]
	}

	return render_template('index.html', var=var)

@app.route('/customize')
def customize():
	return render_template('customize.html')

@app.route('/showdata')
def show_data():
	return render_template('showdata.html')

if __name__ == '__main__':
	#conn = psycopg2.connect(
	#	host=host,
	#	password=password,
	#	user=user,
	#	database=database
	#)
	#cur = conn.cursor()
	#cur.execute('SELECT * FROM information_schema.tables WHERE table_schema=\'public\'')
	#country_names = map(lambda tup: tup[2], cur.fetchall())
	#print country_names
	app.run()

	