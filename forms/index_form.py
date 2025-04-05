from flask_wtf import FlaskForm, CSRFProtect
from wtforms import RadioField, SubmitField
from wtforms.validators import DataRequired, Length

class StateForm(FlaskForm):
	state = RadioField(
		label="",
		choices=[
			'Sleepy',
			'Hungover',
			'Still Drunk'
		],
		default='Sleepy'
	)
	submit = SubmitField('Submit')