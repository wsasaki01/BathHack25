# Bath Hack 2025

Create a virtual environment with all required packages using:
```
python -m venv .venv
pip install -r requirements.txt
```

If you need to add a new library, install it with pip then do the following:
```
pip freeze > requirements.txt
```

Every time you pull new changes, you may require new libraries.
If you're missing something, delete `.venv` and repeat the steps at the top!

Run the flask app using:
```
flask --app index run --debug
```