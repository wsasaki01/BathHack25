from flask import Flask, render_template, redirect, url_for, request
from flask_bootstrap import Bootstrap5

from flask_wtf import FlaskForm, CSRFProtect
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length

from datetime import datetime

from forms.index_form import StateForm

import secrets # For secret key

import networkx as nx

app = Flask(__name__)
foo = secrets.token_urlsafe(16)
app.secret_key = foo

# Bootstrap-Flask requires this line
bootstrap = Bootstrap5(app)
# Flask-WTF requires this line
csrf = CSRFProtect(app)

class Lecture:
	def __init__(self, unit_code, module_name, start_time, lecturer):
		self.unit_code = unit_code
		self.start_time = start_time
		self.module_name = module_name
		self.lecturer = lecturer

@app.route("/", methods=['GET','POST'])
def index():
	# Find next lecture
	lecture = Lecture(
		unit_code="CM22010",
		start_time=datetime(2025, 5, 5, 9, 15),
		module_name="Visual Computing",
		lecturer="Dr Deblina Bhattacharjee"
	)

	G = nx.read_edgelist('bath_campus_graph.txt')

	form = StateForm()
	if form.validate_on_submit():
		state = form.state.data
		print(f"State picked: {state}")

		return redirect(url_for('map', origin_id="1", dest_id="6"))

	return render_template('./index.html', form=form, lecture=lecture)

@app.route("/map")
def map():
	origin_id = request.args.get('origin_id')
	dest_id = request.args.get('dest_id')
	# validate these!

	# Generate path
	path = [
		(1, 10),
		(2, 11),
		(3, 12),
		(4, 13),
		(5, 14),
		(6, 15)
	]

	return render_template('./map.html', time_remaining="2 minutes", origin_id=origin_id, dest_id=dest_id, path=path)