from flask import Flask, url_for, redirect, render_template

app = Flask(__name__)

@app.route("/")
def index():
	return render_template('./index.html', username="something")

@app.route("/go")
def map():
	return "go page"