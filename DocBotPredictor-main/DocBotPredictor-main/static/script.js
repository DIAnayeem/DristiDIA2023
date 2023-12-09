

$(function(){
    $('input[type=radio]').click(function(){
        var $radio = $(this);
       
        // if this was previously checked
        if ($radio.data('waschecked') == true)
        {
            $radio.prop('checked', false);
            $radio.data('waschecked', false);
        }
        else
            $radio.data('waschecked', true);
        
        // remove was checked from other radios
        $radio.siblings('input[name="rad"]').data('waschecked', false);
    });
});

let radios=document.querySelectorAll('input[type=radio]')
radios.forEach(radio=>{
    radio.addEventListener('click',radiosHandler)
})

function radiosHandler(e){
    if(e.target.getAttribute("value")=="1"){
        e.target.setAttribute("value","0")
    }else{
        e.target.setAttribute("value","1")
    }

}

let short_desc=document.getElementById('short_description');
let causes=document.getElementById('causes');
let Diagnosis=document.getElementById('Diagnosis');
let Treatments=document.getElementById('Treatments');
let symptomps=document.getElementById('symptomps');
let learnmore=document.getElementById('learnmore');


let paramForm=document.getElementById('eyeParams')
paramForm.addEventListener('submit',handleParams);

let params=["clouldy__blurry_or_foggy_vision", "pressure_in_eye", "injury_to_the_eye", "excessive_dryness", "red_eye", "cornea_increase_in_size", "color_identifying_problem", "double_vision", "have_eye_problem_in_family", "age40", "diabetics", "myopia", "trouble_with_glasses", "hard_to_see_at_night", "visible_whiteness", "mass_pain", "vomiting", "water_drops_from_eyes_continuously", "presents_of_light_when_eye_lid_close"]

let resolvedDisease=document.querySelector('.disease');
let loader=document.querySelector('.overlay');
function handleParams(e){
    
    loader.style.display="block";
    loader.scrollIntoView()
    let collectedParams={}
    for(let param of params){
        try{
            if(e.target[param].value!=undefined){
                collectedParams[param]=e.target[param].value;
                if(param=="age40"){
                    let binary=collectedParams[param]>40?"1":"0";
                    collectedParams[param]=binary;
                    e.target[param].value=binary;
                }
             }else{
                e.target[param].value=0;
             }
        }catch(err){
            console.log(err.message)
            console.log(param)
        }
        
    }
    //console.log(JSON.stringify(collectedParams));
    paramForm.reset();
    e.preventDefault();
    if(isEmptyForm(collectedParams)){

        setTimeout(()=>{
            loader.style.display="none";
            paramForm.reset();
        },3400)
        resolvedDisease.innerHTML="Not Enough Input, Try again";
        paramForm.reset();
        resolvedDisease.style.color=" #ff7d7d"
    }else{
        console.log(collectedParams);
        console.log(Object.values(collectedParams).map(i=>Number(i)));
        postData('/api/predict', collectedParams)
        .then(data => {
        resolvedDisease.style.color="unset"
          resolvedDisease.innerHTML=data.Disease;
          short_desc.innerHTML=diseaseInfo[data.Disease].short_description;
          causes.href=diseaseInfo[data.Disease].causes;
          symptomps.href=diseaseInfo[data.Disease].symptomps;
          Treatments.href=diseaseInfo[data.Disease].Treatments;
          learnmore.href=diseaseInfo[data.Disease].learnmore;
          Diagnosis.href=diseaseInfo[data.Disease].Diagnosis;
          console.log(data.Disease)
          paramForm.reset();
          setTimeout(()=>{
              loader.style.display="none";
              
          },700)
          setTimeout(()=>{
             window.location.reload() 
          },20000)
        });
    }
  
    // e.target.submit();
}

function isEmptyForm(collectedParams){
    let empty=true;
    let params=Object.values(collectedParams)
    for(let param of Object.keys(collectedParams)){
        if(collectedParams[param]!="0" && param!="age40"){
            empty=false;
        }
    }
    return empty;
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'cache': 'no-store',
         'cache-control': 'no-store',
          'pragma':'no-cache',
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      })
    return response.json(); // parses JSON response into native JavaScript objects
  }

 
