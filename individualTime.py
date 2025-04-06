import pandas as pd
from datetime import datetime, timedelta

def getTimetableInfo(myFile):

	myDict = dict()

	df = pd.read_csv(myFile)
	cols = df.columns
	rows = len(df)

	for r in range(rows):

		module = df[cols[1]][r]
		dow = df[cols[3]][r]
		startDate = df[cols[4]][r]
		startTime = df[cols[5]][r]
		location = df[cols[11]][r].split()
		building = location[0]
		floor, _ = location[1].split(".")

		#non examinable modules has unit code XX00...
		if module[2:4] != "00":
			if startDate in myDict:
				myDict[startDate].append([startTime, building, floor])
			else:
				myDict[startDate] = []

	return myDict

def getNextLecture(current, myDict):

	currentTime = current.strftime("%H:%M")
	closestDate = current
	closestTime = ""
	maxDate = max(myDict)

	#next earliest lecture must happen on next day since last lecture ends at 19:05
	if currentTime >= "19:05":
		closestDate += timedelta(days=1)
		currentTime = "00:00"

	dateStrg = closestDate.strftime("%Y-%m-%d")
	notFound = True

	while dateStrg <= maxDate and notFound:
	
		#earliest date with lectures
		if dateStrg in myDict:

			dateInfo = myDict[dateStrg]
			count = 0

			#check all times on the day
			for d in dateInfo:
				#lecture time is later than device time
				if d[0] >= currentTime:
					closestTime = d[0]
					notFound = False
					break

			#user already had their last lecture on that day
			if notFound:
				closestDate += timedelta(days=1)
				currentTime = "00:00"

		else:
			closestDate += timedelta(days=1)
			currentTime = "00:00"

		dateStrg = closestDate.strftime("%Y-%m-%d")

	#no lectures coming up
	if dateStrg > maxDate:
		return None

	return [dateStrg, closestTime]


myFile = "/Users/tiffanykwok/Desktop/BathHack2025/timetable_2025-04-05.csv" #your timetable stored as csv file
timetableInfo = getTimetableInfo(myFile)
current = datetime.now() #get device time
print(getNextLecture(current, timetableInfo))