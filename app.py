import psycopg2
from flask import Flask, request, session, g, redirect, \
	url_for, abort, render_template, flash
from flask.ext.login import LoginManager

app = Flask(__name__)
app.debug = True
app.config.from_object(__name__)

@app.route('/')
def main():
	return render_template('index.html')

if __name__ == '__main__':
	app.run()