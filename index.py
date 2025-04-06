from flask import Flask, render_template, redirect, url_for, request
from flask_bootstrap import Bootstrap5
import networkx as nx

from flask_wtf import FlaskForm, CSRFProtect
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length

import datetime as dt

from forms.index_form import StateForm

import secrets # For secret key

app = Flask(__name__)
foo = secrets.token_urlsafe(16)
app.secret_key = foo

app.run('0.0.0.0', debug=True, port=8000, ssl_context='adhoc')

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
		start_time=dt.datetime(2025, 5, 5, 9, 15),
		module_name="Visual Computing",
		lecturer="Dr Deblina Bhattacharjee"
	)

	form = StateForm()
	if form.validate_on_submit():
		state = form.state.data
		print(f"State picked: {state}")
		speed = 1.4
		if state == "Hungover":
			speed *= 0.8
		elif state == "Still Drunk":
			speed *= 0.4

		return redirect(url_for('map', origin_id="1", dest_id="6", speed=f"{speed}"))

	return render_template('./index.html', form=form, lecture=lecture)

def get_shortest_path(start, finish, G, speed):
	path = nx.dijkstra_path(G, start, finish)
	dicts = [{"lng" : G.nodes[i]['lon'], 'lat': G.nodes[i]['lat'], 'popup': i} for i in path]
	dicts[-1]['distance'] = 0
	dicts[0]['time'] = G[path[0]][path[0 + 1]]['distance'] / speed
	prev = 0
	for x in range(1, len(dicts)-1):
		dicts[x]['distance'] = G[path[x]][path[x + 1]]['distance']
		dicts[x]['time'] = (G[path[x - 1]][path[x]]['distance'] / speed) + dicts[x - 1]['time']

	dicts[-1]['time'] = (G[path[-2]][path[-1]]['distance'] / speed) + dicts[-2]['time']
	return dicts


@app.route("/map")
def map():
	origin_id = request.args.get('origin_id')
	dest_id = request.args.get('dest_id')
	speed = float(request.args.get('speed'))
	# validate these!

	G = nx.read_graphml('graph.graphml')
	# Generate path
	path = get_shortest_path('1', '280', G, speed)

	times = []
	for p in path:
		#print(p)
		t = p['time']
		times.append([
			str(int(round(t // 60, 2))).zfill(2),
			str(int(round(t % 60, 0))).zfill(2)
		])

	return render_template('./map.html', time_remaining="00:00:000", origin_id=origin_id, dest_id=dest_id, path=path, times=times)

"""
if __name__ == '__main__':
	context = ('./ssl-shit/server.crt', './ssl-shit/server.key')
	app.run(debug=False, port=8000)
	#app.run(debug=True, port=8000)
"""