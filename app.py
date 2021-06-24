import numpy as np
import datetime as dt
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS
import json


#################################################
# Database Setup
#################################################
# engine = create_engine("secret")

amazon = os.getenv("AMAZON")


rds_connection_string = amazon
engine = create_engine(rds_connection_string)


# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
print(Base.classes.keys())
# Save reference to the table
uspc_class_all_mo = Base.classes.uspc_class_all
application_cleaned_patented_mo = Base.classes.application_cleaned_patented
application_cleaned_all_mo = Base.classes.application_cleaned_all
uspc_class_daysandrate_mo = Base.classes.uspc_class_daysandrate
attorney_success_withnames_mo = Base.classes.attorney_success_withnames
uspc_attorney_success_withnames_mo = Base.classes.uspc_attorney_success_withnames
patent_claims_stats_mo = Base.classes.patent_claims_stats



# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>" # br line break
        f"/api/v1.0/uspc_class_all<br/>"
        f"/api/v1.0/uspc_class_daysandrate<br/>"
        f"/api/v1.0/uspc_class_daysandrate_all<br/>"
        f"/api/v1.0/uspc_attorney_success_withnames<br/>"
        f"/api/v1.0/uspc_attorney_success_withnames_all"
    )

@app.route("/api/v1.0/uspc_class_all")
def uspc_class_all(uspc_class=None):
    # Query all prcps in the last 12 months as I did in JupyterLab
    prcp = session.query(uspc_class_all_mo.uspc_class).all()
    # print(prcp) # This is a list of tuples
    # Convert list of tuples into a dictionary using dict()
    # prcp_list = list(prcp)
    print(prcp)
    # return json.dumps({"data": prcp_list} # This is a dictionary
    prcp = [x[0] for x in prcp]
    return jsonify(prcp)



@app.route("/api/v1.0/uspc_class_daysandrate/<uspc_class>")
def uspc_class_daysandrate(uspc_class=None):
    sel = [uspc_class_daysandrate_mo.uspc_class, uspc_class_daysandrate_mo.application_number_all, uspc_class_daysandrate_mo.application_number_patented, 
       uspc_class_daysandrate_mo.patented_rate, uspc_class_daysandrate_mo.patented_cases_per_class, uspc_class_daysandrate_mo.average_years]
       
    prcp = session.query(*sel).filter(uspc_class_daysandrate_mo.uspc_class == uspc_class).all()
    print(prcp) # This is a list of tuples
    # prcp_dict = dict(prcp)
    return jsonify(prcp) # This is a dictionary

@app.route("/api/v1.0/uspc_class_daysandrate_all")
def uspc_class_daysandrate_all(uspc_class=None):
    sel = [uspc_class_daysandrate_mo.uspc_class, uspc_class_daysandrate_mo.application_number_all, uspc_class_daysandrate_mo.application_number_patented, 
       uspc_class_daysandrate_mo.patented_rate, uspc_class_daysandrate_mo.patented_cases_per_class, uspc_class_daysandrate_mo.average_years]
       
    prcp = session.query(*sel).all()
    print(prcp) # This is a list of tuples
    # prcp_dict = dict(prcp)
    return jsonify(prcp) # This is a dictionary

@app.route("/api/v1.0/uspc_attorney_success_withnames/<uspc_class>")
def uspc_attorney_success_withnames(uspc_class=None):
    sel = [uspc_attorney_success_withnames_mo.uspc_class, uspc_attorney_success_withnames_mo.atty_registration_number, uspc_attorney_success_withnames_mo.application_number_patented, 
       uspc_attorney_success_withnames_mo.application_number_all, uspc_attorney_success_withnames_mo.success_rate, uspc_attorney_success_withnames_mo.atty_name_last, uspc_attorney_success_withnames_mo.atty_name_first, uspc_attorney_success_withnames_mo.atty_practice_category]
       
    prcp = session.query(*sel).filter(uspc_attorney_success_withnames_mo.uspc_class == uspc_class).order_by(uspc_attorney_success_withnames_mo.application_number_all.desc()).limit(100).all()
    print(prcp) # This is a list of tuples
    # prcp_dict = dict(prcp)
    return jsonify(prcp) # This is a dictionary

@app.route("/api/v1.0/uspc_attorney_success_withnames_all")
def uspc_attorney_success_withnames_all(uspc_class=None):
    sel = [uspc_attorney_success_withnames_mo.uspc_class, uspc_attorney_success_withnames_mo.atty_registration_number, uspc_attorney_success_withnames_mo.application_number_patented, 
       uspc_attorney_success_withnames_mo.application_number_all, uspc_attorney_success_withnames_mo.success_rate, uspc_attorney_success_withnames_mo.atty_name_last, uspc_attorney_success_withnames_mo.atty_name_first, uspc_attorney_success_withnames_mo.atty_practice_category]
       
    prcp = session.query(*sel).all()
    print(prcp) # This is a list of tuples
    # prcp_dict = dict(prcp)
    return jsonify(prcp) # This is a dictionary


if __name__ == '__main__':
    app.run()