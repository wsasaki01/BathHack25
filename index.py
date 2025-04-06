from flask import Flask, render_template, redirect, url_for, request, session
from flask_bootstrap import Bootstrap5
import networkx as nx
import pandas as pd

from flask_wtf import FlaskForm, CSRFProtect
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length

import datetime as dt

from forms.index_form import StateForm
from individualTime import getTimetableInfo, getNextLecture

import secrets # For secret key

import networkx as nx

app = Flask(__name__)
foo = secrets.token_urlsafe(16)
app.secret_key = foo

app.run('0.0.0.0', debug=True, port=8000, ssl_context='adhoc')

# Bootstrap-Flask requires this line
bootstrap = Bootstrap5(app)
# Flask-WTF requires this line
csrf = CSRFProtect(app)

class Lecture:
	def __init__(self, unit_code, module_name, start_time, lecturer, node):
		self.unit_code = unit_code
		self.start_time = start_time
		self.module_name = module_name
		self.lecturer = lecturer
		self.building_node = node

@app.route("/", methods=['GET','POST'])
def index():

	myFile = "./static/tt.csv" #your timetable stored as csv file
	mySchedule = getTimetableInfo(myFile)
	current_time = dt.datetime.now() #get device time
	nextDate, lectureInfo = getNextLecture(current_time, mySchedule)
	
	print(nextDate)
	print(lectureInfo)
	
	#user has a lecture coming up -> user's csv file is updated enough
	if lectureInfo is not None:
		startTime, building, floor, module, staff = lectureInfo

	#get time of next lecture
	lecture_year, lecture_month, lecture_date = [int(i) for i in nextDate.split("-")]
	lecture_hour, lecture_min = [int(i) for i in startTime.split(":")]

	late = False
	time_to_lec = ""

	data = pd.read_csv('BathHack25_RoomLabels.csv')

	lec2node = {}

	for idx, row in data.iterrows():
		lec2node[row['Building']] = row['Points'].split('-')[0]

	# Find next lecture
	lecture = Lecture(
		unit_code=module,
		start_time=dt.datetime(lecture_year, lecture_month, lecture_date, lecture_hour, lecture_min),
		module_name=module,
		lecturer=staff,
		node=lec2node[building]
	)

	#session['lecture_start_time'] = lecture.start_time

	origin_node = '1'
	dest_node = str(lecture.building_node) # make this dynamic!!

	# Get path to see how long it would take
	G = nx.read_graphml('graph.graphml')
	path = get_shortest_path(origin_node, dest_node, G, 1.4)

	arrival_time = (current_time + dt.timedelta(seconds=path[-1]['time'])).time()
	if arrival_time > lecture.start_time.time():
		late = True
		time_to_lec = int(path[-1]['time'] / 60)

	form = StateForm()
	if form.validate_on_submit():
		state = form.state.data
		print(f"State picked: {state}")
		speed = 1.4
		if state == "Hungover":
			speed *= 0.8
		elif state == "Still Drunk":
			speed *= 0.4

		return redirect(url_for('map', origin_id=origin_node, dest_id=dest_node, speed=f"{speed}"))

	return render_template('./index.html', form=form, lecture=lecture, late=late, time_to_lec=time_to_lec, arrival_time=arrival_time)

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

	path = get_shortest_path(origin_id, dest_id, G, speed)

	times = []
	for p in path:
		#print(p)
		t = p['time']
		times.append([
			str(int(round(t // 60, 2))).zfill(2),
			str(int(round(t % 60, 0))).zfill(2)
		])

	return render_template('./map.html', time_remaining="00:00:000", origin_id=origin_id, dest_id=dest_id, path=path, times=times)

@app.route("/arrival")
def arrived():
	start_time = dt.datetime(2025, 4, 6, 9, 15)
	current_time = dt.datetime.now()
	print(start_time-current_time)
	message = ""
	if current_time > start_time:
		message = f"YOU'RE {current_time.strftime('%M')} MINUTES LATE!!!!"
	else:
		message = f"YOU MADE IT!!\n{ int((start_time-current_time).seconds / 60) } MINUTES EARLY!!"
	return render_template('./arrival.html', start_time=start_time, message=message)

"""
if __name__ == '__main__':
	context = ('./ssl-shit/server.crt', './ssl-shit/server.key')
	app.run(debug=False, port=8000)
	#app.run(debug=True, port=8000)
"""