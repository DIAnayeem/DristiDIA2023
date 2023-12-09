from flask import Flask,request,jsonify,render_template
import utils
from flask_cors import CORS, cross_origin
import json
app=Flask(__name__)
CORS(app)

def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/')
def hello():
   return render_template("index.html")


@app.route("/api/symptoms",methods=['GET'])
def getSymptomps():
    return jsonify({"symptomps":utils.get_diease_params()})


@app.route("/api/predict",methods=['POST'])
def predictorApi():
    symptomps=[]
    columns=["clouldy__blurry_or_foggy_vision", "pressure_in_eye", "injury_to_the_eye", "excessive_dryness", "red_eye", "cornea_increase_in_size", "color_identifying_problem", "double_vision", "have_eye_problem_in_family", "age40", "diabetics", "myopia", "trouble_with_glasses", "hard_to_see_at_night", "visible_whiteness", "mass_pain", "vomiting", "water_drops_from_eyes_continuously", "presents_of_light_when_eye_lid_close"]
    params=json.loads(request.data,strict=False)
    print(params)
    for column in columns:
        symptomps.append(params[column])
    print(symptomps)
    return jsonify({"Disease":utils.predict_disease_from_19symptomps(symptomps)})


@app.route('/')
def root():
    return '<h2>Available APIs:</h2><ul><li><a href="/predict">/predict</a></li><li><a href="/hello">/hello</a></li></ul>'



if __name__=="__main__":
    print("Starting Flask server for docbot predictor...")
    app.run(port=4200)