import json
import pickle
# import numpy as np
__all_columns=None
__disease_perameters=None
__model=None
# clouldy__blurry_or_foggy_vision,pressure_in_eye_,injury_to_the_eye,excessive_dryness,red_eye,cornea_increase_in_size,color_identifying_problem,double_vision,have_eye_problem_in_family,40__age,diabetics,myopia,trouble_with_glasses,hard_to_see_at_night,visible_whiteness,mass_pain,vomiting,water_drops_from_eyes_continuously,presents_of_light_when_eye_lid_close

def predict_disease_from_19symptomps(array19):
    load_saved_artifacts()
    return __model.predict([array19])[0]


def get_all_columns():
     return __all_columns

def get_diease_params():
    load_saved_artifacts()
    return __disease_perameters
    
def load_saved_artifacts():
    print("loading saved artifacts....start")
    global __all_columns
    global __disease_perameters
    global __model
    if(__model==None):
        with open("./model/all_columns.json","r") as f:
            __all_columns=json.load(f)['data_columns']
            __disease_perameters=__all_columns[1:19]

        with open("./model/DocbotEyeDiseasePredictor_SVM_model.pickle","rb") as f:
            __model=pickle.load(f)  
            
        print("loading saved artifacts....done")
    


if __name__=="__main__":
    load_saved_artifacts()
    # print(get_all_columns())
    print(predict_disease_from_19symptomps([0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0]))
    
