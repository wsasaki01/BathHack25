import pandas as pd

myList = []
myFile = "" #your timetable stored as csv file

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

	if module[2:4] != "00":
		myList.append([module, startDate, dow, startTime, building, floor])

print(myList)