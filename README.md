# Bath Hack 2025

Create a virtual environment with all required packages using:
```
conda env create -f environment.yml
conda activate BathHack25
```

If you need to add a new library, install it with pip then do the following:
```
conda env export | grep -v "^prefix: " > environment.yml
```

Every time you pull new changes, you may require new libraries.
If you're missing something:
```
conda deactivate
conda remove -n BathHack25 --all
```
Then repeat steps above to create from `environment.yml` file.

Run the flask app using:
```
flask --app index run --debug
```