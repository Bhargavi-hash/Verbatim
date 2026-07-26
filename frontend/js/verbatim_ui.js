/* ============ CATEGORY KNOWLEDGE — questions sourced from examples/demo_*.md ============ */
const CATEGORIES = {
  RESPIRATORY:{name:"Neumología",specialist:"Pulmonology",priority:"URGENT",
    kw:["respirar","aire","tos","ahogo","asma","pulmon","pulmón","silbido","sibilancia","inhalador","toser"],
    qs:[["associated_symptoms","¿Ha notado silbidos en el pecho o tos junto con la falta de aire?","Have you noticed wheezing in your chest or cough along with the shortness of breath?"],
        ["severity_0_10","En una escala del cero al diez, donde diez es la peor dificultad para respirar imaginable, ¿qué tan intensa es ahora?","On a scale from zero to ten, where ten is the worst breathing difficulty imaginable, how severe is it now?"],
        ["rescue_inhaler_use","¿Con qué frecuencia usa su inhalador de rescate en estos días?","How often are you using your rescue inhaler these days?"],
        ["fever_or_refractory","¿Ha tenido fiebre, dolor en el pecho o síntomas que no mejoran después del inhalador?","Have you had fever, chest pain, or symptoms that do not improve after the inhaler?"],
        ["environmental_trigger","¿Algo en su entorno ha cambiado recientemente, como polvo, humo, mascotas o un resfriado?","Has anything in your environment changed recently, such as dust, smoke, pets, or a cold?"]]},
  CARDIAC:{name:"Cardiología",specialist:"Cardiology",priority:"ROUTINE",
    kw:["pecho","corazon","corazón","palpitacion","palpitación","presion en el pecho","presión en el pecho","opresion","opresión"],
    qs:[["relieved_by_rest","¿Esa presión se le quita cuando descansa?","Does that pressure go away when you rest?"],
        ["radiation","¿La molestia se le va al brazo, al cuello o a la mandíbula?","Does the discomfort travel to your arm, neck, or jaw?"],
        ["severity_0_10","En una escala del cero al diez, ¿qué tan intensa es la molestia cuando aparece?","On a scale from zero to ten, how intense is the discomfort when it appears?"],
        ["associated_symptoms","¿Ha tenido falta de aire, sudoración fría o náusea junto con la presión?","Have you had shortness of breath, cold sweats, or nausea along with the pressure?"],
        ["family_history","¿Alguien en su familia ha tenido problemas del corazón?","Has anyone in your family had heart problems?"]]},
  NEURO:{name:"Neurología",specialist:"Neurology",priority:"ROUTINE",
    kw:["cabeza","migrana","migraña","jaqueca","mareo","mareado","debilidad","hablar","vision","visión","adormecido","entumecido","desmay","convulsion","convulsión"],
    qs:[["frequency_change","¿Desde cuándo han aumentado en frecuencia?","How long have they been increasing in frequency?"],
        ["aura","¿Nota algo antes de que empiece el dolor, como luces, manchas o cambios en la vista?","Do you notice anything before the pain begins, such as lights, spots, or changes in your vision?"],
        ["severity_0_10","En una escala del cero al diez, ¿qué tan fuerte es el dolor cuando está en su peor momento?","On a scale from zero to ten, how strong is the pain at its worst?"],
        ["photophobia_nausea","¿Le molesta la luz o el ruido durante el dolor? ¿Ha tenido náusea o vómito?","Does light or noise bother you during the pain? Have you had nausea or vomiting?"],
        ["focal_deficit","¿Ha tenido debilidad en la cara, el brazo o la pierna, o dificultad para hablar durante estos episodios?","Have you had weakness in your face, arm, or leg, or difficulty speaking during these episodes?"],
        ["thunderclap","¿Ha sido este el peor dolor de cabeza de su vida, o empezó de forma muy repentina?","Has this been the worst headache of your life, or did it start very suddenly?"]]},
  GI:{name:"Gastroenterología",specialist:"Gastroenterology",priority:"URGENT",
    kw:["estomago","estómago","barriga","abdomen","nausea","náusea","vomit","diarrea","vientre","ardor","acidez","tragar","heces"],
    qs:[["timing","¿En qué momento le molesta más?","When does it bother you most?"],
        ["severity_0_10","En una escala del cero al diez, ¿qué tan fuerte es el ardor cuando está peor?","On a scale from zero to ten, how strong is the burning at its worst?"],
        ["bleeding","¿Ha vomitado? ¿Ha visto sangre en el vómito o en las heces?","Have you vomited? Have you seen blood in your vomit or stool?"],
        ["dysphagia_weight","¿Ha tenido dificultad para tragar, o ha bajado de peso sin proponérselo?","Have you had difficulty swallowing, or lost weight without trying?"],
        ["self_treatment","¿Ha tomado algo para el ardor?","Have you taken anything for the burning?"]]},
  MSK_INJURY:{name:"Ortopedia",specialist:"Orthopedics",priority:"ROUTINE",
    kw:["cai","caí","caida","caída","golpe","torci","torcí","tobillo","rodilla","espalda","fractur","hueso","lastim","hombro","muneca","muñeca","lesion","lesión"],
    qs:[["mechanism_of_injury","¿Cómo pasó exactamente? ¿Qué estaba haciendo en ese momento?","How exactly did it happen? What were you doing at that moment?"],
        ["swelling","¿Se le hinchó? ¿Qué tan pronto después de la lesión?","Did it swell? How soon after the injury?"],
        ["severity_0_10","En una escala del cero al diez, ¿qué tan fuerte es el dolor ahora?","On a scale from zero to ten, how strong is the pain now?"],
        ["weight_bearing","¿Puede mover esa parte y apoyar el peso?","Can you move that part and bear weight?"],
        ["locking","¿Se le ha quedado trabada, o siente que algo se atora al moverla?","Has it locked up, or do you feel something catching when you move it?"],
        ["numbness","¿Ha notado que se le duerma o que pierda sensibilidad?","Have you noticed numbness or loss of sensation?"]]},
  INFECTION:{name:"Enf. Infecciosas",specialist:"Infectious Disease",priority:"URGENT",
    kw:["fiebre","escalofrio","escalofrío","gripe","infeccion","infección","temperatura","calentura","sudores"],
    qs:[["max_temperature","¿Qué tan alta ha estado la fiebre?","How high has the fever been?"],
        ["night_sweats","¿Ha tenido sudores por la noche o escalofríos?","Have you had night sweats or chills?"],
        ["weight_loss","¿Ha bajado de peso sin proponérselo?","Have you lost weight without trying?"],
        ["travel","¿Ha viajado recientemente?","Have you traveled recently?"],
        ["exposures","¿Recuerda si le picó algún insecto, o si tomó leche o agua sin hervir?","Do you recall any insect bites, or drinking unboiled milk or water?"],
        ["other_systems","¿Ha tenido tos, dificultad para respirar, diarrea o dolor al orinar?","Have you had cough, difficulty breathing, diarrhea, or pain when urinating?"],
        ["sick_contacts","¿Ha estado cerca de alguien enfermo, o tiene alguna condición que le baje las defensas?","Have you been around anyone sick, or do you have any condition that lowers your immunity?"]]},
  GENERAL:{name:"Medicina General",specialist:"Internal Medicine",priority:"ROUTINE",kw:[],
    qs:[["onset","¿Cuándo empezó?","When did it start?"],
        ["duration","¿Cuánto le ha durado?","How long has it lasted?"],
        ["severity_0_10","En una escala del cero al diez, ¿qué tan fuerte o molesto es?","On a scale from zero to ten, how strong or bothersome is it?"],
        ["other_symptoms","¿Ha notado algo más junto con eso?","Have you noticed anything else along with it?"]]}
};
const UNIVERSAL=[
  ["current_medications","¿Está tomando algún medicamento actualmente?","Are you currently taking any medications?"],
  ["allergies","¿Tiene alguna alergia a medicamentos?","Do you have any medication allergies?"]];
const RED_FLAGS=[
  {kw:["brazo izquierdo","se me va al brazo","mandibula","mandíbula"],es:"dolor irradiado a brazo/mandíbula",en:"pain radiating to arm/jaw"},
  {kw:["no puedo respirar","no me llega el aire","me ahogo"],es:"dificultad respiratoria grave",en:"severe respiratory distress"},
  {kw:["no puedo hablar","se me traba la lengua","cara caida","cara caída"],es:"posible signo de ACV",en:"possible stroke sign"},
  {kw:["peor dolor de cabeza"],es:"cefalea en trueno",en:"thunderclap headache"},
  {kw:["mucha sangre","sangrando mucho","no para de sangrar","vomite sangre","vomité sangre"],es:"sangrado abundante",en:"significant bleeding"},
  {kw:["me desmaye","me desmayé","perdi el conocimiento","perdí el conocimiento"],es:"síncope",en:"syncope"}];
const LABELS={chief_complaint:["Motivo de consulta","Chief complaint"],associated_symptoms:["Síntomas asociados","Associated symptoms"],
 severity_0_10:["Severidad (0-10)","Severity (0-10)"],rescue_inhaler_use:["Uso de inhalador de rescate","Rescue inhaler use"],
 fever_or_refractory:["Fiebre / respuesta al inhalador","Fever / inhaler response"],environmental_trigger:["Desencadenante ambiental","Environmental trigger"],
 relieved_by_rest:["Alivio con reposo","Relieved by rest"],radiation:["Irradiación","Radiation"],family_history:["Antecedentes familiares","Family history"],
 frequency_change:["Cambio de frecuencia","Frequency change"],aura:["Aura previa","Preceding aura"],photophobia_nausea:["Fotofobia / náusea","Photophobia / nausea"],
 focal_deficit:["Déficit focal","Focal deficit"],thunderclap:["Inicio súbito","Thunderclap onset"],timing:["Momento de los síntomas","Symptom timing"],
 bleeding:["Sangrado","Bleeding"],dysphagia_weight:["Disfagia / pérdida de peso","Dysphagia / weight loss"],self_treatment:["Automedicación","Self-treatment"],
 mechanism_of_injury:["Mecanismo de lesión","Mechanism of injury"],swelling:["Hinchazón","Swelling"],weight_bearing:["Carga de peso","Weight bearing"],
 locking:["Bloqueo articular","Mechanical locking"],numbness:["Adormecimiento","Numbness"],max_temperature:["Temperatura máxima","Maximum temperature"],
 night_sweats:["Sudores nocturnos","Night sweats"],weight_loss:["Pérdida de peso","Weight loss"],travel:["Viaje reciente","Recent travel"],
 exposures:["Exposiciones","Exposures"],other_systems:["Revisión por sistemas","Review of systems"],sick_contacts:["Contactos enfermos / inmunidad","Sick contacts / immunity"],
 onset:["Inicio","Onset"],duration:["Duración","Duration"],other_symptoms:["Otros síntomas","Other symptoms"],
 current_medications:["Medicamentos","Medications"],allergies:["Alergias","Allergies"],
 inferred_condition:["Antecedente (deducido)","History (inferred)"],red_flags:["Señales de alarma","Red flags"],
 readback_confirmed:["Confirmación del paciente","Patient confirmation"]};


/* ============================================================
   ES -> EN clinical-intake translator.
   Spanish remains the authoritative record; English is a derived
   reading aid for the physician. Designed so no Spanish leaks through.
   ============================================================ */
const N=norm=>(norm||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");

const NUM={cero:"zero",un:"one",uno:"one",una:"one",dos:"two",tres:"three",cuatro:"four",cinco:"five",
 seis:"six",siete:"seven",ocho:"eight",nueve:"nine",diez:"ten",once:"eleven",doce:"twelve",
 quince:"fifteen",veinte:"twenty",treinta:"thirty",cuarenta:"forty",cincuenta:"fifty"};

const UNIT={dia:"day",dias:"days",semana:"week",semanas:"weeks",mes:"month",meses:"months",
 hora:"hour",horas:"hours",ano:"year",anos:"years",minuto:"minute",minutos:"minutes",
 kilo:"kilo",kilos:"kilos",grado:"degree",grados:"degrees",vez:"time",veces:"times"};

const BODY={pecho:"chest",cabeza:"head",estomago:"stomach",abdomen:"abdomen",barriga:"belly",
 vientre:"abdomen",brazo:"arm",brazos:"arms",pierna:"leg",piernas:"legs",rodilla:"knee",
 tobillo:"ankle",espalda:"back",cuello:"neck",mandibula:"jaw",cara:"face",ojos:"eyes",
 garganta:"throat",hombro:"shoulder",muneca:"wrist",mano:"hand",pie:"foot",cadera:"hip",
 corazon:"heart",pulmon:"lung",pulmones:"lungs",articulaciones:"joints",musculos:"muscles"};

const NOUN={...BODY,...UNIT,
 dolor:"pain",dolores:"headaches",ardor:"burning",presion:"pressure",molestia:"discomfort",
 fiebre:"fever",tos:"cough",flema:"phlegm",silbidos:"wheezing",sibilancias:"wheezing",
 aire:"air",nausea:"nausea",nauseas:"nausea",vomito:"vomiting",diarrea:"diarrhea",
 estrenimiento:"constipation",sangre:"blood",mareo:"dizziness",mareos:"dizziness",
 debilidad:"weakness",hinchazon:"swelling",sudores:"sweats",sudor:"sweat",
 escalofrios:"chills",cansancio:"fatigue",peso:"weight",temperatura:"temperature",
 asma:"asthma",alergia:"allergy",alergias:"allergies",gripe:"flu",infeccion:"infection",
 resfriado:"cold",medicamento:"medication",medicamentos:"medications",inhalador:"inhaler",
 pastilla:"pill",pastillas:"pills",antiacidos:"antacids",oxigeno:"oxygen",
 luces:"lights",vista:"vision",vision:"vision",ruido:"noise",luz:"light",
 polvo:"dust",humo:"smoke",mascotas:"pets",animales:"animals",mosquitos:"mosquitoes",
 leche:"milk",agua:"water",comida:"food",obras:"construction",trabajo:"work",
 viaje:"travel",familia:"family",papa:"father",mama:"mother",hermano:"brother",
 hermana:"sister",noche:"night",dia:"day",manana:"morning",tarde:"afternoon",
 infarto:"heart attack",colesterol:"cholesterol",diabetes:"diabetes",
 heces:"stool",orinar:"urinating",esfuerzo:"exertion",reposo:"rest",escaleras:"stairs",
 sarpullido:"rash",fractura:"fracture",hueso:"bone",tronido:"pop",golpe:"blow",caida:"fall",
 defensas:"immune defenses",consulta:"appointment",equipo:"team",medico:"doctor",
 vida:"life",zigzag:"zigzag",aura:"aura",episodios:"episodes",sintomas:"symptoms",
 sintoma:"symptom",condicion:"condition",problema:"problem",problemas:"problems"};

const ADJ={fuerte:"strong",fuertes:"strong",leve:"mild",peor:"worst",mejor:"better",
 grave:"severe",intenso:"intense",intensa:"intense",constante:"constant",
 izquierdo:"left",izquierda:"left",derecho:"right",derecha:"right",
 alto:"high",alta:"high",bajo:"low",baja:"low",nuevo:"new",nueva:"new",
 dormido:"numb",dormida:"numb",hinchado:"swollen",hinchada:"swollen",
 trabado:"locked",trabada:"locked",abundante:"heavy",repentino:"sudden",
 brillantes:"bright",brillante:"bright",oscuro:"dark",oscura:"dark",
 rural:"rural",fresca:"fresh",fresco:"fresh",enfermo:"sick",enferma:"sick",
 ambientales:"environmental",importante:"significant",cronico:"chronic"};

const MED=["lisinopril","atorvastatina","loratadina","fluticasona","albuterol","salbutamol",
 "ibuprofeno","naproxeno","acetaminofen","paracetamol","omeprazol","metformina","insulina",
 "penicilina","aspirina","amlodipino","losartan","prednisona","amoxicilina"];
const MEDEN={atorvastatina:"atorvastatin",loratadina:"loratadine",fluticasona:"fluticasone",
 ibuprofeno:"ibuprofen",naproxeno:"naproxen",acetaminofen:"acetaminophen",omeprazol:"omeprazole",
 metformina:"metformin",insulina:"insulin",penicilina:"penicillin",aspirina:"aspirin",
 amlodipino:"amlodipine",prednisona:"prednisone",amoxicilina:"amoxicillin",salbutamol:"albuterol"};

const VERBING={respirar:"breathing",tragar:"swallowing",caminar:"walking",dormir:"sleeping",
 comer:"eating",moverme:"moving",moverla:"moving it",mover:"moving",orinar:"urinating",
 hablar:"speaking",subir:"climbing",bajar:"going down",apoyar:"bearing weight",levantarme:"getting up"};

// one dictionary for single-word lookups
const WORD={...NOUN,...ADJ,...NUM,...MEDEN,
 si:"yes",no:"not",y:"and",o:"or",pero:"but",tambien:"also",muy:"very",mucho:"a lot",
 mucha:"a lot",poco:"a little",poca:"a little",bastante:"quite",casi:"almost",
 mas:"more",menos:"less",todo:"all",toda:"all",todos:"all",nada:"nothing",
 algo:"something",alguien:"someone",ninguna:"none",ninguno:"none",
 siempre:"always",nunca:"never",aveces:"sometimes",ya:"already",todavia:"still",
 ahora:"now",antes:"before",despues:"after",luego:"then",hoy:"today",ayer:"yesterday",
 anoche:"last night",aqui:"here",alla:"there",cerca:"near",lejos:"far",
 correcto:"correct",listo:"ready",lista:"ready",bien:"fine",mal:"badly",
 silbo:"I wheeze",toso:"I cough",silbar:"wheezing",toser:"coughing",tosiendo:"coughing",
 jugando:"playing",jugar:"playing",futbol:"soccer",basquetbol:"basketball",corriendo:"running",
 trabajar:"working",trabajando:"working",inhalada:"inhaled",inhalado:"inhaled",rescate:"rescue",
 caminando:"walking",durmiendo:"sleeping",comiendo:"eating",sentado:"sitting",acostado:"lying down",
 recetado:"prescribed",vomitado:"vomited",visto:"seen",tenido:"had",notado:"noticed",
 viajado:"traveled",estado:"been",puesto:"put",dicho:"said",hecho:"done",
 sudo:"I sweat",siento:"I feel",veo:"I see",escucho:"I hear",noto:"I notice",
 sabanas:"sheets",cambiar:"change",cambios:"changes",cambio:"change",vista:"vision",
 vomitos:"vomiting",vomitando:"vomiting",molesta:"bothers",molestan:"bother",

 dificil:"difficult",dificultad:"difficulty",facilidad:"ease",facil:"easy",hablar:"speaking",episodio:"episode",episodios:"episodes",
 estoy:"I am",estamos:"we are",tomando:"taking",usando:"using",sintiendo:"feeling",
 deducido:"inferred",sido:"been",estado:"been",durante:"during",estos:"these",estas:"these",
 esos:"those",esas:"those",este:"this",aquellos:"those",mientras:"while",
 deducida:"inferred",cronico:"chronic",cronica:"chronic",
 repentino:"sudden",repentina:"sudden",repentinamente:"suddenly",gradual:"gradual",
 frecuencia:"frequency",aumentado:"increased",aumentan:"increase",empeorado:"worsened",
 manchas:"spots",destellos:"flashes",vicodin:"Vicodin",tylenol:"Tylenol",advil:"Advil",
 motrin:"Motrin",benadryl:"Benadryl",percocet:"Percocet",oxicodona:"oxycodone",
 codeina:"codeine",morfina:"morphine",sulfa:"sulfa",latex:"latex",mariscos:"shellfish",recientemente:"recently",varias:"several",varios:"several",
 tanto:"so much",apoyar:"bear",golpee:"I hit",cai:"I fell",tomamos:"we drank",comimos:"we ate",
 estuve:"I was",estuvimos:"we were",fui:"I went",fuimos:"we went",vino:"came",llego:"arrived",
 despierto:"awake",dormido_:"asleep",ligero:"light",pesado:"heavy",seguido:"often",
 apenas:"barely",casi_:"almost",solo:"only",solamente:"only",ademas:"also",entonces:"then",contacto:"contact",picadura:"bite",insecto:"insect",
 hervir:"boiling",campo:"countryside",finca:"farm",regrese:"I returned",visitar:"visiting",
 enferma:"sick",enfermo:"sick",presion:"blood pressure",
 gracias:"thank you",hola:"hello",senor:"sir",senora:"ma'am"};

// Spanish function words that must never survive
const DROP=new Set(["el","la","los","las","lo","un","una","unos","unas","de","del","al",
 "a","en","con","por","para","que","se","me","te","le","les","nos","mi","mis","su","sus",
 "yo","tu","el_","ella","usted","es","son","esta","estan","ha","han","he","hemos",
 "muy_","cuando","donde","como","porque","si_","desde","hasta","sobre","entre","sin",
 "e","u","del_","este","esta_","esto","ese","esa","eso","aquel"]);

/* ---- productive patterns: rewritten with real English structure ---- */
const W=w=>{
  const k=N(w);
  if(WORD[k])return WORD[k];
  if(MED.includes(k))return MEDEN[k]||k;
  return null;                              // unknown
};
const w2=(w,fb)=>W(w)||fb||w;
const safe=w=>W(w)||("\u27E6"+w+"\u27E7");   // unknown words are visibly bracketed, never silent

/* Stage 1 — specific compounds. These must beat the generic verb rules below. */
const FIXED=[
 [/^\s*(10|[0-9])\s*$/g,(m,n)=>n+" out of 10"],
 [/^\s*(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*$/g,(m,n)=>digit(n)+" out of 10"],
 // a standalone duration answer reads as a duration, not an onset point
 [/^\s*(hace|desde hace|desde)\s+(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|unos|unas)\s+(dia|dias|semana|semanas|mes|meses|hora|horas|ano|anos)\s*$/g,
   (m,a,n,u)=>"For the past "+(NUM[N(n)]||"a few")+" "+(UNIT[N(u)]||u)],
 [/\bno ha sido\b/g,()=>"it has not been"],
 [/\bha sido\b/g,()=>"it has been"],
 [/\bno he sido\b/g,()=>"I have not been"],
 [/\bdurante estos episodios\b/g,()=>"during these episodes"],
 [/\bdurante (estos|estas|los|las) ([a-z]+)/g,(m,a,b)=>"during these "+w2(b)],
 [/\btengo (un |una )?dolor de cabeza\b/g,()=>"I have a headache"],
 [/\btengo (un |una )?dolor de ([a-z]+)\b/g,(m,a,b)=>"I have "+(BODY[N(b)]||w2(b))+" pain"],
 [/\btengo cambios en (mi |la )?vista\b/g,()=>"I have vision changes"],
 [/\bcambios en (mi |la )?vista\b/g,()=>"vision changes"],
 [/\btengo alergia a (la |el )?([a-z]+)/g,(m,a,b)=>"I have an allergy to "+drugName(b)],
 [/\bsoy alergic[oa] a (la |el )?([a-z]+)/g,(m,a,b)=>"I have an allergy to "+drugName(b)],
 [/\bes alergic[oa] a (la |el )?([a-z]+)/g,(m,a,b)=>"has an allergy to "+drugName(b)],
 [/\bestoy tomando ([a-z]+)/g,(m,a)=>"I am taking "+drugName(a)],
 [/\bestoy usando ([a-z]+)/g,(m,a)=>"I am using "+drugName(a)],
 [/\btomo ([a-z]+)/g,(m,a)=>"I take "+drugName(a)],
 [/\buso ([a-z]+)/g,(m,a)=>"I use "+drugName(a)],
 // severity -> "N out of 10"
 [/\b(hace|es|seria|llega a|llega hasta|diria que es)\s+(un |una )?(10|[0-9]|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b(?!\s*(dia|dias|semana|semanas|mes|meses|hora|horas|ano|anos|minuto|minutos|kilo|kilos|grado|grados|vez|veces|de la|del))/g,
   (m,v,a,n)=>digit(n)+" out of 10"],
 [/\bcomo (un |una )?(10|[0-9]|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b(?!\s*(dia|dias|semana|semanas|mes|meses|hora|horas|ano|anos|minuto|minutos|kilo|kilos|grado|grados|vez|veces))/g,
   (m,a,n)=>digit(n)+" out of 10"],
 [/\bde (un |una )?(10|[0-9]|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez) sobre (10|diez)\b/g,
   (m,a,n)=>digit(n)+" out of 10"],
 // duration
 [/\bdesde (hace )?(un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|unos|unas)\s+(dia|dias|semana|semanas|mes|meses|hora|horas|ano|anos)\b/g,
   (m,h,n,u)=>"for the past "+(NUM[N(n)]||"a few")+" "+(UNIT[N(u)]||u)],
 [/\bdesde (ayer|anoche|esta manana|hace poco)\b/g,
   (m,a)=>"since "+({ayer:"yesterday",anoche:"last night","esta manana":"this morning","hace poco":"recently"})[N(a)]],
 // "bothers me"
 [/\bme molesta[n]? (la |el |los |las )?([a-z]+)/g,(m,a,b)=>"I am bothered by "+w2(b)],
 // misc real-world phrasings
 [/\bes dificil hablar\b/g,()=>"it is difficult to speak"],
 [/\bhe tenido dificultad para ([a-z]+)/g,(m,a)=>"I have had difficulty "+(VERBING[N(a)]||w2(a))],
 [/\btengo dificultad para ([a-z]+)/g,(m,a)=>"I have difficulty "+(VERBING[N(a)]||w2(a))],
 [/\bdificultad para ([a-z]+)/g,(m,a)=>"difficulty "+(VERBING[N(a)]||w2(a))],
 [/\bde forma (muy )?repentina\b/g,(m,a)=>(a?"very ":"")+"suddenly"],
 [/\bes dificil ([a-z]+)/g,(m,a)=>"it is difficult to "+(VERBING[N(a)]?VERBING[N(a)].replace(/ing$/,""):w2(a))],
 [/\bcuando tengo (un|una) ([a-z]+)/g,(m,a,b)=>"when I have "+(/^[aeiou]/.test(w2(b))?"an ":"a ")+w2(b)],
 [/\bhe tenido (vomitos|nauseas|fiebre|mareos|dolor)\b/g,
   (m,a)=>"I have had "+({vomitos:"vomiting",nauseas:"nausea",fiebre:"fever",mareos:"dizziness",dolor:"pain"})[N(a)]],
 [/\bpero si que ([a-z]+)/g,(m,a)=>"but it did "+({empezo:"start",comenzo:"start",paso:"happen"}[N(a)]||w2(a))],
 [/\bmuy repentino\b/g,()=>"very suddenly"],[/\bde forma repentina\b/g,()=>"suddenly"],
 [/\(deducid[oa] del medicamento\)/g,()=>"(inferred from medication)"],
 [/\(deducid[oa]s? de ([a-z ]+)\)/g,(m,a)=>"(inferred from "+w2(a.trim())+")"],
 [/\bhan aumentado\b/g,()=>"they have increased"],
 [/\bestoy list[oa]\b/g,()=>"I am ready"],
];

const BRANDS=new Set(["vicodin","tylenol","advil","motrin","benadryl","percocet","oxycontin","zyrtec","claritin"]);
function drugName(w){
  const k=N(w);
  if(MEDEN[k])return MEDEN[k];
  if(BRANDS.has(k))return k.charAt(0).toUpperCase()+k.slice(1);
  if(MED.includes(k))return k;
  if(WORD[k])return WORD[k];
  return k.charAt(0).toUpperCase()+k.slice(1);      // unknown = treat as a drug name, never bracket
}
function digit(n){
  const k=N(n);
  if(/^[0-9]+$/.test(k))return k;
  const map={cero:"0",uno:"1",un:"1",una:"1",dos:"2",tres:"3",cuatro:"4",cinco:"5",
             seis:"6",siete:"7",ocho:"8",nueve:"9",diez:"10"};
  return map[k]||k;
}

const PATTERNS=[
 [/\bno,? (no |nunca )?(me duele|tengo|he tenido|puedo|es|hay)\b/g, (m,a,b)=>{
    const v={"me duele":"I don't have pain","tengo":"I don't have","he tenido":"I haven't had",
             "puedo":"I can't","es":"it is not","hay":"there is no"}[b];return v;}],
 [/\bme duele mucho (el|la|los|las) ([a-z]+)/g,(m,a,b)=>"my "+w2(b)+" hurts a lot"],
 [/\bme duele (el|la|los|las) ([a-z]+)/g,(m,a,b)=>"my "+w2(b)+" hurts"],
 [/\bme duelen (el|la|los|las) ([a-z]+)/g,(m,a,b)=>"my "+w2(b)+" hurt"],
 [/\bme duele mucho\b/g,()=>"it hurts a lot"],
 [/\bme duele\b/g,()=>"it hurts"],
 [/\bme cuesta mucho ([a-z]+)/g,(m,a)=>"I have a lot of difficulty "+(VERBING[N(a)]||w2(a))],
 [/\bme cuesta ([a-z]+)/g,(m,a)=>"I have difficulty "+(VERBING[N(a)]||w2(a))],
 [/\bdesde hace (un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|unos|unas) ([a-z]+)/g,
   (m,a,b)=>"for the past "+(NUM[N(a)]||"a few")+" "+(UNIT[N(b)]||w2(b))],
 [/\bhace (un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|unos|unas) ([a-z]+)/g,
   (m,a,b)=>(NUM[N(a)]||"a few")+" "+(UNIT[N(b)]||w2(b))+" ago"],
 [/\bsoy alergic[oa] a (la |el |los |las )?([a-z]+)/g,(m,a,b)=>"I am allergic to "+w2(b)],
 [/\bes alergic[oa] a (la |el |los |las )?([a-z]+)/g,(m,a,b)=>"allergic to "+w2(b)],
 [/\bllega a (un|una) ([a-z]+)/g,(m,a,b)=>"it reaches "+(NUM[N(b)]||w2(b))],
 [/\bllega hasta ([a-z]+)/g,(m,a)=>"it reaches "+(NUM[N(a)]||w2(a))],
 [/\bes (un|una) ([a-z]+)/g,(m,a,b)=>"it is a "+(NUM[N(b)]||w2(b))],
 [/\bcomo (un|una) ([a-z]+)/g,(m,a,b)=>"about a "+(NUM[N(b)]||w2(b))],
 [/\blo uso\b/g,()=>"I use it"],
 [/\bla uso\b/g,()=>"I use it"],
 [/\btodos los dias\b/g,()=>"every day"],
 [/\bcasi todos los dias\b/g,()=>"almost every day"],
 [/\bempece a ([a-z]+)/g,(m,a)=>"I started "+(VERBING[N(a)]||w2(a)||a)],
 [/\bhe bajado (como |unos )?([a-z]+) kilos/g,(m,a,b)=>"I have lost about "+(NUM[N(b)]||w2(b))+" kilos"],
 [/\b(mucho|mucha) (de|por|en|a|al|del|que|con|sin)\b/g,()=>"a lot"],
 [/\b(mucho|mucha) ([a-z]+)/g,(m,a,b)=>{const t=W(b);return t?"a lot of "+t:"a lot of "+safe(b);}],
 [/\btengo que ([a-z]+)/g,(m,a)=>"I have to "+(VERBING[N(a)]||w2(a))],
 [/\btengo ([a-z]+)/g,(m,a)=>"I have "+w2(a)],
 [/\bno tengo ([a-z]+)/g,(m,a)=>"I don't have "+w2(a)],
 [/\bhe tenido ([a-z]+)/g,(m,a)=>"I have had "+w2(a)],
 [/\bhe bajado (de peso|como )?/g,()=>"I have lost weight "],
 [/\buso ([a-z]+)/g,(m,a)=>"I use "+w2(a)],
 [/\btomo ([a-z]+)/g,(m,a)=>"I take "+w2(a)],
 [/\bme lastime (el|la|los|las) ([a-z]+)/g,(m,a,b)=>"I injured my "+w2(b)],
 [/\bme lastime\b/g,()=>"I injured myself"],
 [/\bme torci\b/g,()=>"I twisted it"],
 [/\bme torci (el|la|los|las) ([a-z]+)/g,(m,a,b)=>"I twisted my "+w2(b)],
 [/\bse me va a[l]? (brazo|cuello|mandibula) ?(izquierdo|derecho)?/g,
   (m,a,b)=>"it travels to my "+(b?w2(b)+" ":"")+w2(a)],
 [/\bdurante (el dia|la noche)/g,(m,a)=>a.includes("dia")?"during the day":"during the night"],
 [/\bpor la (noche|manana|tarde)/g,(m,a)=>({noche:"at night",manana:"in the morning",tarde:"in the afternoon"})[N(a)]],
 [/\ben (la manana|la noche|la tarde)/g,(m,a)=>({"la manana":"in the morning","la noche":"at night","la tarde":"in the afternoon"})[N(a)]],
 [/\besta manana\b/g,()=>"this morning"],
 [/\bcuando me (levante|acuesto|muevo)/g,(m,a)=>({levante:"when I got up",acuesto:"when I lie down",muevo:"when I move"})[N(a)]],
 [/\bcuando (camino|subo|descanso|como)\b/g,(m,a)=>({camino:"when I walk",subo:"when I climb",descanso:"when I rest",como:"when I eat"})[N(a)]],
 [/\bdespues de (comer|comida)/g,()=>"after eating"],
 [/\bsin (proponermelo|hacer dieta|querer)/g,()=>"without trying"],
 [/\b(cuatro|cinco|tres|dos|seis|siete|ocho|nueve|diez) o (cuatro|cinco|tres|dos|seis|siete|ocho|nueve|diez) veces al dia/g,
   (m,a,b)=>NUM[N(a)]+" or "+NUM[N(b)]+" times a day"],
 [/\b(una|dos|tres) o (una|dos|tres) veces por semana/g,(m,a,b)=>NUM[N(a)]+" or "+NUM[N(b)]+" times a week"],
 [/\b([a-z]+) veces al dia\b/g,(m,a)=>(NUM[N(a)]||w2(a))+" times a day"],
 [/\b([a-z]+) veces por semana\b/g,(m,a)=>(NUM[N(a)]||w2(a))+" times a week"],
 [/\bel peor dolor de cabeza de mi vida\b/g,()=>"the worst headache of my life"],
 [/\bdolor de (espalda|garganta|estomago|oido|muela|pecho|cuello)\b/g,
   (m,a)=>({espalda:"back pain",garganta:"sore throat",estomago:"stomach pain",
            oido:"ear pain",muela:"tooth pain",pecho:"chest pain",cuello:"neck pain"})[N(a)]],
 [/\bde la (finca|casa|clinica|escuela)\b/g,(m,a)=>"from the "+({finca:"farm",casa:"house",clinica:"clinic",escuela:"school"})[N(a)]],
 [/\bno he ([a-z]+) ?([a-z]+)?/g,(m,a,b)=>{const v=W(a)||a;return "I have not "+v+(b&&W(b)?" "+W(b):"");}],
 [/\bno puedo ([a-z]+)/g,(m,a)=>"I cannot "+(VERBING[N(a)]?VERBING[N(a)].replace(/ing$/,""):(W(a)||a))],
 [/\bme golpee (el|la) ([a-z]+)/g,(m,a,b)=>"I hit my "+w2(b)],
 [/\bcuando me cai\b/g,()=>"when I fell"],
 [/\bdolor de cabeza\b/g,()=>"headache"],[/\bdolores de cabeza\b/g,()=>"headaches"],
 [/\bdolor de pecho\b/g,()=>"chest pain"],[/\bfalta de aire\b/g,()=>"shortness of breath"],
 [/\bme falta el aire\b/g,()=>"I am short of breath"],
 [/\bno puedo respirar\b/g,()=>"I cannot breathe"],
 [/\bno me llega el aire\b/g,()=>"I cannot get air"],
 [/\binhalador de rescate\b/g,()=>"rescue inhaler"],
 [/\bboca del estomago\b/g,()=>"pit of my stomach"],
 [/\bperdi el conocimiento\b/g,()=>"I lost consciousness"],
 [/\bme desmaye\b/g,()=>"I fainted"],
 [/\bes correcto\b/g,()=>"that is correct"],[/\basi es\b/g,()=>"that is right"],
 [/\bestoy list[oa]\b/g,()=>"I am ready"],
 [/\bno he (vomitado|visto|tenido|notado) ([a-z]+)?/g,(m,a,b)=>
   "I have not "+({vomitado:"vomited",visto:"seen",tenido:"had",notado:"noticed"})[N(a)]+(b?" "+w2(b):"")],
 [/\bempezo\b/g,()=>"it started"],[/\bempece a\b/g,()=>"I started"],
 [/\bpuedo (caminar|moverla|apoyar)/g,(m,a)=>"I can "+({caminar:"walk",moverla:"move it",apoyar:"bear weight"})[N(a)]],
 [/\bno puedo (caminar|moverla|apoyar|dormir)/g,(m,a)=>"I cannot "+({caminar:"walk",moverla:"move it",apoyar:"bear weight",dormir:"sleep"})[N(a)]],
 [/\bcerca de obras\b/g,()=>"near construction"],
 [/\bhasta que me despierto\b/g,()=>"until it wakes me up"],
 [/\bsobre todo\b/g,()=>"especially"],
 [/\bde (nuevo|verdad)\b/g,(m,a)=>a==="nuevo"?"again":"really"],
];

function translate(src){
  if(!src||!src.trim())return{text:"",confidence:"none",coverage:0,residue:[]};
  let t=" "+N(src).replace(/[¿¡]/g,"")+" ";
  const totalWords=t.trim().split(/\s+/).filter(Boolean).length;

  FIXED.forEach(([re,fn])=>{t=t.replace(re,(...a)=>""+fn(...a)+"");});
  PATTERNS.forEach(([re,fn])=>{t=t.replace(re,(...a)=>""+fn(...a)+"");});

  // word pass on untouched segments
  const residue=[];
  t=t.split("").map((seg,i)=>{
    if(i%2===1)return seg;
    return seg.split(/(\s+)/).map(tok=>{
      const bare=tok.replace(/[.,;:!?"'()]/g,"");
      if(!bare.trim())return tok;
      const k=N(bare);
      if(WORD[k])return tok.replace(bare,WORD[k]);
      if(MED.includes(k))return tok.replace(bare,MEDEN[k]||bare);
      if(DROP.has(k))return tok.replace(bare,"");
      if(/^[0-9]+$/.test(k))return tok;
      residue.push(bare);
      return tok.replace(bare,"⟦"+bare+"⟧");     // clearly marked, never silent
    }).join("");
  }).join("");

  // Spanish places adjectives after nouns; English before. Swap known pairs.
  const ADJEN=new Set(Object.values(ADJ)); const NOUNEN=new Set(Object.values(NOUN));
  {
    const parts=t.split(/(\s+)/);                       // [word, sep, word, sep, ...]
    for(let i=0;i+2<parts.length;i+=2){
      const sep=parts[i+1]||"";
      if(sep.includes("\u0001"))continue;               // don't cross a translated-phrase boundary
      const A=parts[i].replace(/[.,;:!?"'\u0001]/g,"").toLowerCase();
      const B=parts[i+2].replace(/[.,;:!?"'\u0001]/g,"").toLowerCase();
      if(NOUNEN.has(A)&&ADJEN.has(B)&&A!==B){
        const keepPunct=(parts[i+2].match(/[.,;:!?]+$/)||[""])[0];
        parts[i+2]=parts[i].replace(/[.,;:!?]+$/,"");
        parts[i]=B.charAt(0).toUpperCase()===parts[i].charAt(0)?B:B;
        parts[i+2]=A+keepPunct;
        i+=0;
      }
    }
    t=parts.join("");
  }
  t=t.replace(/\s+/g," ").replace(/\s+([,.;:!?])/g,"$1").replace(/^[\s,]+/,"").trim();
  t=t.replace(/\ba (?=[aeiou])/g,"an ");
  t=t.replace(/\bnot (a lot|very)\b/g,"not $1");
  t=t.replace(/([.!?])\s+([a-z])/g,(m,p,c)=>p+" "+c.toUpperCase());
  if(t)t=t.charAt(0).toUpperCase()+t.slice(1);
  if(t&&!/[.!?]$/.test(t))t+=".";

  const cov=totalWords?Math.max(0,Math.round((1-residue.length/totalWords)*100)):0;
  const conf=residue.length===0?"complete":cov>=80?"good":cov>=55?"partial":"low";
  return{text:t,confidence:conf,coverage:cov,residue};
}

function glossEn(src){
  const g=translate(src);
  if(!g.text)return "[no text]";
  if(g.confidence==="complete")return g.text;
  if(g.confidence==="good")return g.text;
  const tag=g.confidence==="partial"
    ? "  _[partial translation — "+g.coverage+"% coverage; untranslated terms shown in \u27E6brackets\u27E7]_"
    : "  _[low-confidence translation — "+g.coverage+"% coverage; Spanish source is authoritative]_";
  return g.text+tag;
}
function esToEn(src){return translate(src);}   // back-compat

/* ---- what a sensible answer to each question looks like ---- */
const EXPECT={
  severity_0_10:"scale",
  radiation:"yesno",relieved_by_rest:"yesno",exertional:"yesno",focal_deficit:"yesno",
  thunderclap:"yesno",vision_change:"yesno",head_injury:"yesno",speech_difficulty:"yesno",
  bleeding:"yesno",vomiting:"yesno",dysphagia_weight:"yesno",fever:"yesno",
  dyspnea_at_rest:"yesno",home_inhaler:"yesno",weight_bearing:"yesno",locking:"yesno",
  numbness:"yesno",night_sweats:"yesno",weight_loss:"yesno",travel:"yesno",
  sick_contacts:"yesno",family_history:"yesno",swelling:"yesno",
  frequency_change:"time",onset:"time",duration:"time",last_known_well:"time",
  fever_duration:"time",timing:"time",
  current_medications:"list",allergies:"list",
};
const TIMEWORD=/\b(dia|dias|semana|semanas|mes|meses|hora|horas|ano|anos|minuto|minutos|ayer|hoy|anoche|manana|noche|tarde|hace|desde|siempre|nunca|reciente|recientemente)\b/;
const SCALEWORD=/\b(10|[0-9]|cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/;

/* Returns null if the answer looks sensible, otherwise a reason it should be checked. */
function validateAnswer(key,text){
  const t=norm(text||"");
  if(!t.trim())return{code:"empty",es:"No se capturó ninguna respuesta.",en:"No answer was captured."};
  const kind=EXPECT[key]||"free";
  if(kind==="scale"&&!SCALEWORD.test(t))
    return{code:"expected_scale",es:"Se esperaba un número del 0 al 10.",en:"A number from 0 to 10 was expected."};
  // a detailed answer implies yes/no; only flag terse replies that dodge the question
  if(kind==="yesno"&&!(AFFIRM.test(t)||NEGATE.test(t))&&t.split(/\s+/).length<4)
    return{code:"expected_yesno",es:"Se esperaba una respuesta de sí o no.",en:"A yes or no answer was expected."};
  if(kind==="time"&&!TIMEWORD.test(t))
    return{code:"expected_time",es:"Se esperaba una duración o una fecha.",en:"A duration or time reference was expected."};
  if(kind!=="free"&&t.split(/\s+/).length<1)
    return{code:"too_short",es:"La respuesta parece incompleta.",en:"The answer appears incomplete."};
  // transcription-quality signal: unrecognised words usually mean the mic misheard
  const g=translate(text);
  if(g.residue.length>=2||(g.residue.length>=1&&g.coverage<80))
    return{code:"transcription_doubt",
      es:"Posible error de transcripción: no se reconocieron las palabras \u201C"+g.residue.join("\u201D, \u201C")+"\u201D.",
      en:"Possible transcription error: unrecognised words \u201C"+g.residue.join("\u201D, \u201C")+"\u201D."};
  return null;
}
function flagCount(){return Object.values(state.data||{}).filter(v=>v.needsReview).length;}

const APP_VERSION="Verbatim ver. 0.1.0-demo";
let state={turns:[],data:{}};
const $=id=>document.getElementById(id);

const apptId=new URLSearchParams(location.search).get("appt");
const apptContext=(typeof findUpcomingAppointment==="function"&&apptId)
  ? findUpcomingAppointment(apptId)
  : null;
const norm=s=>(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
let talkTimer=null;
function activeAv(){return $("avF");}
function setAv(c){
  const a=activeAv();
  a.className="avatar show"+(c?" "+c:"");
  a.classList.toggle("av-on",!!c);
  $("statusrow").className="statusrow"+(c?" "+c:"");
  $("wave").className="wave"+(c?" on":"");
  c==="speaking"?startTalking():stopTalking();
}
function startTalking(){
  stopTalking();
  const g=activeAv().querySelector(".mouth-g");
  if(!g)return;
  const tick=()=>{
    const open=0.15+Math.random()*0.95;   // 0 = closed (original smile shows)
    const wide=0.85+Math.random()*0.3;
    g.style.transform="scaleY("+open.toFixed(2)+") scaleX("+wide.toFixed(2)+")";
    talkTimer=setTimeout(tick,80+Math.random()*70);
  };
  tick();
}
function stopTalking(){
  if(talkTimer){clearTimeout(talkTimer);talkTimer=null;}
  document.querySelectorAll(".mouth-g").forEach(g=>g.style.transform="scaleY(0) scaleX(1)");
}
function diag(m){$("diag").textContent=m;$("diag").className="on";}

/* ---------- voice ---------- */
let VOICES=[];
function loadVoices(){
  if(!window.speechSynthesis)return;
  VOICES=speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith("es"));
  const sel=$("voicePick");if(!sel)return;sel.innerHTML="";
  if(!VOICES.length){sel.innerHTML='<option>(sin voces en español)</option>';return;}
  const score=v=>{let n=(v.name||"").toLowerCase(),s=0;
    if(/enhanced|premium|neural|natural/.test(n))s+=10;
    if(/m[oó]nica|paulina|marisol|jorge|juan|diego|luc[ií]a|sabina|helena/.test(n))s+=5;
    if(v.localService)s+=1;return -s;};
  VOICES.sort((a,b)=>score(a)-score(b));
  VOICES.forEach((v,i)=>{const o=document.createElement("option");
    o.value=i;o.textContent=v.name+" ("+v.lang+")"+(/enhanced|premium|neural/i.test(v.name)?"  ★":"");sel.appendChild(o);});
}
if(window.speechSynthesis){speechSynthesis.onvoiceschanged=loadVoices;setTimeout(loadVoices,150);}
const humanize=t=>t.replace(/([.?!])\s+/g,"$1 ... ").replace(/,\s+/g,", ");

/* Deterministic line id — must match tools/generate_voice.py */
function lineId(t){
  let h=5381;
  const s=t.trim().replace(/\s+/g," ");
  for(let i=0;i<s.length;i++){h=(((h*33)^s.charCodeAt(i))>>>0);}
  return ("00000000"+h.toString(16)).slice(-8);
}
let AUDIO_OK=null;            // null=untested, true/false once known
function playClip(text){
  return new Promise((res,rej)=>{
    const a=new Audio("audio/"+lineId(text)+".mp3");
    a.onended=()=>{AUDIO_OK=true;res();};
    a.onerror=()=>rej(new Error("no clip"));
    a.play().then(()=>{AUDIO_OK=true;}).catch(rej);
  });
}
async function playSegments(segs){
  for(const t of segs){ if(t&&t.trim()) await playClip(t); }
}
async function speakEleven(text){
  const key=$("elKey").value.trim(),vid=$("elVoice").value.trim();
  if(!key||!vid)throw new Error("Falta la clave o el Voice ID");
  const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+encodeURIComponent(vid),{
    method:"POST",headers:{"xi-api-key":key,"Content-Type":"application/json"},
    body:JSON.stringify({text:text,model_id:"eleven_multilingual_v2",
      voice_settings:{stability:.5,similarity_boost:.75,style:.2}})});
  if(!r.ok)throw new Error("ElevenLabs "+r.status);
  const a=new Audio(URL.createObjectURL(await r.blob()));
  return new Promise((res,rej)=>{a.onended=res;a.onerror=rej;a.play().catch(rej);});
}
function speakBrowser(text){
  return new Promise(res=>{
    if(!window.speechSynthesis){res();return;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(humanize(text));
    u.lang="es-ES";u.rate=parseFloat($("rate").value);u.pitch=parseFloat($("pitch").value);
    const i=parseInt($("voicePick").value);if(!isNaN(i)&&VOICES[i])u.voice=VOICES[i];
    u.onend=res;u.onerror=res;speechSynthesis.speak(u);});
}
async function say(text,en,segments){
  if(listening)finalizeSpeech("agent-turn");
  $("bubble").textContent=text;addTurn("agent",text,en);
  setAv("speaking");$("status").textContent="Hablando…";
  const segs=segments&&segments.length?segments:[text];
  let done=false;
  if(AUDIO_OK!==false){                       // 1) pre-rendered studio clips
    try{ await playSegments(segs); done=true; }
    catch(e){ if(AUDIO_OK===null)AUDIO_OK=false; }
  }
  if(!done && $("elOn").checked){             // 2) live ElevenLabs
    try{ await speakEleven(text); done=true; }
    catch(e){ diag("ElevenLabs falló — usando la voz del navegador."); }
  }
  if(!done){ try{ await speakBrowser(text); }catch(_){} }   // 3) browser voice
  setAv("");$("status").textContent="Su turno — hable o escriba";
}
/* ---------- transcript ---------- */
function addTurn(who,text,en){
  state.turns.push({who,text,en:en||null,ts:new Date().toISOString()});
  renderTranscript();
  $("transcript").scrollTop=$("transcript").scrollHeight;
}

function renderTranscript(){
  const box=$("transcript");box.innerHTML="";
  if(!state.turns||!state.turns.length){
    box.innerHTML='<div class="empty">La conversación aparecerá aquí,<br/>en español con traducción al inglés.</div>';
    return;}
  state.turns.forEach((t,idx)=>{
    const d=document.createElement("div");d.className="turn "+t.who+(t.needsReview?" flagged":"");d.dataset.idx=idx;
    const tag=(t.edited?'<span class="editedtag">EDITADO</span>':'')+
              (t.needsReview?'<span class="flagtag">⚠ REVISAR</span>':'');
    let why="";
    if(t.needsReview){
      const f=Object.values(state.data).find(v=>v.srcTurn===idx&&v.reviewReason);
      if(f)why='<div class="flagwhy">'+f.reviewReason.es+' Edite el texto o regrabe la respuesta.</div>';
    }
    d.innerHTML='<div class="who">'+(t.who==="agent"?"Verbatim":"Paciente")+tag+'</div>'+
      '<div class="msg"></div>'+(t.en?'<div class="en">'+t.en+'</div>':'')+why;
    d.querySelector(".msg").textContent=t.text;
    if(t.who==="patient"){
      d.querySelector(".msg").onclick=ev=>{
        if(ev.target.closest(".tedit,.teditbtns"))return;
        editTurn(idx);
      };
      const acts=document.createElement("div");acts.className="turnacts";
      acts.innerHTML='<button class="bEdit">✎ Editar texto</button><button class="bRec">🎤 Regrabar</button>';
      acts.querySelector(".bEdit").onclick=ev=>{ev.stopPropagation();editTurn(idx);};
      acts.querySelector(".bRec").onclick=ev=>{ev.stopPropagation();reRecord(idx);};
      d.appendChild(acts);
    }
    box.appendChild(d);
  });
}

/* Click a patient response to correct it. The original is never overwritten —
   the change is recorded in the Text Edits audit section. */
function editTurn(idx){
  const t=state.turns[idx];
  if(!t||t.who!=="patient")return;
  const node=$("transcript").querySelector('.turn[data-idx="'+idx+'"] .msg');
  if(!node||node.dataset.editing)return;
  node.dataset.editing="1";
  const before=t.text;
  node.innerHTML='<textarea class="tedit"></textarea>'+
    '<div class="teditbtns"><button class="tsave">Guardar</button><button class="ghost tcancel">Cancelar</button></div>';
  const ta=node.querySelector("textarea");ta.value=before;ta.focus();
  ta.setSelectionRange(ta.value.length,ta.value.length);
  const done=()=>{delete node.dataset.editing;renderTranscript();};
  ta.onclick=ev=>ev.stopPropagation();
  node.querySelector(".teditbtns").onclick=ev=>ev.stopPropagation();
  node.querySelector(".tcancel").onclick=ev=>{ev.stopPropagation();ev.preventDefault();done();};
  node.querySelector(".tsave").onclick=ev=>{
    ev.stopPropagation();ev.preventDefault();
    const after=ta.value.trim();
    if(!after||after===before){done();return;}
    applyTurnEdit(idx,before,after);
    delete node.dataset.editing;
    renderTranscript();render();
    $("status").textContent="Respuesta corregida — registrada en el audit trail";
    announceConsequence();
  };
  ta.addEventListener("keydown",e=>{
    if(e.key==="Escape")done();
    if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))node.querySelector(".tsave").click();
  });
}

async function reRecord(idx){
  const t=state.turns[idx];if(!t||t.who!=="patient")return;
  if(!rec){diag("Reconocimiento no disponible. Use «Editar texto».");return;}
  if(listening)finalizeSpeech("switch");
  try{speechSynthesis.cancel();}catch(e){}
  try{await ensureMic();}catch(err){
    diag("No se pudo acceder al micrófono:\n"+err.name+"\n\n"+hintFor(err.name));return;}
  state.recordingTurn=idx;
  buffer="";lastInterim="";listening=true;
  setAv("listening");
  $("status").textContent="Regrabando su respuesta… hable ahora";
  $("listenRow").style.display="flex";
  startRecognition();
  resetSilence();
}

/* After a correction, re-check safety and re-route the remaining questions. */
function reevaluate(idx,after){
  const notes=[];

  // 1) did this correction reveal a red flag?
  const flags=checkRedFlags(after);
  if(flags.length){
    const known=state.data.red_flags?String(state.data.red_flags.value):"";
    const fresh=flags.filter(f=>!known.includes(f.es));
    if(fresh.length){
      state.emergency=true;
      const all=(known?known+", ":"")+fresh.map(f=>f.es).join(", ");
      state.data.red_flags={value:all,stated:true,ts:new Date().toISOString(),srcTurn:idx,
        escalatedBy:"correction"};
      notes.push({type:"escalation",detail:fresh.map(f=>f.es).join(", ")});
    }
  } else if(state.data.red_flags&&state.data.red_flags.srcTurn===idx){
    // the correction removed the only red flag -> de-escalate
    delete state.data.red_flags;state.emergency=false;
    notes.push({type:"de-escalation",detail:"criterio de alarma retirado tras la corrección"});
  }

  // 2) did the presenting complaint change specialty?
  const ccTurn=state.data.chief_complaint?state.data.chief_complaint.srcTurn:null;
  if(ccTurn===idx&&!state.emergency){
    const newCat=classify(after);
    if(newCat!==state.cat){
      const oldKeys=(CATEGORIES[state.cat]?CATEGORIES[state.cat].qs:[]).map(q=>q[0]);
      const keep=["chief_complaint","current_medications","allergies","inferred_condition",
                  "red_flags","readback_confirmed"];
      oldKeys.forEach(k=>{ if(!keep.includes(k)) delete state.data[k]; });
      state.cat=newCat;
      state.queue=[...CATEGORIES[newCat].qs,...UNIVERSAL];
      state.qi=state.queue.findIndex(q=>state.data[q[0]]===undefined);
      if(state.qi<0)state.qi=state.queue.length;
      notes.push({type:"rerouted",detail:CATEGORIES[newCat].specialist});
    }
  }
  return notes;
}

function applyTurnEdit(idx,before,after,via){
  const t=state.turns[idx];
  if(t.original===undefined)t.original=before;
  t.text=after;t.edited=true;t.editedAt=new Date().toISOString();

  // which question was this answering?
  let q=null;
  for(let i=idx-1;i>=0;i--){ if(state.turns[i].who==="agent"){q=state.turns[i];break;} }

  // which captured field came from this turn?
  let fieldKey=null,fieldLabel=null;
  for(const[k,v]of Object.entries(state.data)){
    if(v.srcTurn===idx){
      fieldKey=k;fieldLabel=LABELS[k]?LABELS[k][1]:k;
      if(v.original===undefined)v.original=v.value;
      v.value=after;v.edited=true;v.editedAt=t.editedAt;
      (v.amendments=v.amendments||[]).push({from:before,to:after,at:t.editedAt,via:via||"transcript"});
      break;
    }
  }
  for(const[k,v]of Object.entries(state.data)){
    if(v.srcTurn===idx){
      const iss=validateAnswer(k,after);
      if(iss){v.needsReview=true;v.reviewReason=iss;}
      else{delete v.needsReview;delete v.reviewReason;}
      break;
    }
  }
  t.needsReview=Object.values(state.data).some(v=>v.srcTurn===idx&&v.needsReview);
  const notes=reevaluate(idx,after);
  state.textEdits=state.textEdits||[];
  state.textEdits.push({
    consequences:notes.map(n=>n.type+": "+n.detail),
    seq:state.textEdits.length+1,
    at:t.editedAt,
    turn_index:idx,
    question_es:q?q.text:null,
    question_en:q?q.en:null,
    field:fieldKey,field_label:fieldLabel,
    original_text:before,
    edited_text:after,
    edited_via:via||"transcript panel"
  });
}
/* ---------- routing ---------- */
function classify(t){t=norm(t);let best="GENERAL",h=0;
  for(const[k,c]of Object.entries(CATEGORIES)){const n=c.kw.filter(w=>t.includes(norm(w))).length;if(n>h){h=n;best=k;}}
  return best;}
/* Clause-level negation. "No es el peor dolor de cabeza de mi vida" must NOT escalate,
   while "No tengo fiebre, pero se me va al brazo izquierdo" must. */
const NEG=/\b(no|nunca|jamas|tampoco|sin|ningun|ninguna|niego|negativo)\b/;
function clausesOf(t){
  return norm(t).split(/[,.;:!?]|\bpero\b|\baunque\b|\bsin embargo\b/).filter(c=>c.trim());
}
function checkRedFlags(text){
  const cls=clausesOf(text);
  return RED_FLAGS.filter(f=>
    cls.some(c=>f.kw.some(k=>c.includes(norm(k))) && !NEG.test(c))
  );
}
function render(){
  const tb=$("form").querySelector("tbody");tb.innerHTML="";
  for(const[k,v]of Object.entries(state.data)){
    const tr=document.createElement("tr");tr.dataset.key=k;
    tr.innerHTML='<td class="k">'+(LABELS[k]?LABELS[k][0]:k)+'</td>'+
      '<td class="v"><span class="val"></span>'+
      (v.stated===false?'<span class="inferred">INFERIDO</span>':'')+
      (v.edited?'<span class="edited">CORREGIDO</span>':'')+
      (v.needsReview?'<span class="review">⚠ REVISAR</span>':'')+
      '<button class="rowedit" title="Corregir">✎</button></td>';
    tr.querySelector(".val").textContent=v.value;
    tr.querySelector(".rowedit").onclick=()=>editRow(k,tr);
    tb.appendChild(tr);}
  if(state.cat){const c=CATEGORIES[state.cat];
    $("cat").textContent=c.name+" → "+c.specialist;
    const p=state.emergency?"EMERGENT":c.priority;
    $("prio").innerHTML='<span class="badge '+p+'">'+p+'</span>';}
  $("alert").style.display=state.emergency?"block":"none";
}
/* ---------- conversation ---------- */
function editRow(key,tr){
  const v=state.data[key];if(!v)return;
  const td=tr.querySelector("td.v");
  const prev=td.innerHTML;
  td.innerHTML='<div class="editbox"><input type="text"/><button class="save">Guardar</button><button class="ghost cancel">Cancelar</button></div>';
  const inp=td.querySelector("input");inp.value=v.value;inp.focus();inp.select();
  const cancel=()=>{td.innerHTML=prev;render();};
  const save=()=>{
    const nv=inp.value.trim();
    if(!nv){cancel();return;}
    if(nv!==v.value){
      if(v.original===undefined)v.original=v.value;   // never overwrite the first capture
      v.amendments=v.amendments||[];
      v.amendments.push({from:v.value,to:nv,at:new Date().toISOString()});
      v.value=nv;v.edited=true;v.editedAt=new Date().toISOString();
    }
    render();
  };
  td.querySelector(".save").onclick=save;
  td.querySelector(".cancel").onclick=cancel;
  inp.addEventListener("keydown",e=>{if(e.key==="Enter")save();if(e.key==="Escape")cancel();});
}

function handle(a){
  if(!a.trim()||state.done)return;
  addTurn("patient",a);
  const f=checkRedFlags(a);
  if(f.length){
    state.emergency=true;
    state.data.red_flags={value:f.map(x=>x.es).join(", "),stated:true,ts:new Date().toISOString(),srcTurn:state.turns.length-1};
    render();
    say("Gracias por decírmelo. Voy a avisarle a su equipo médico ahora mismo para que le atiendan de inmediato. Quédese aquí conmigo.",
        "Thank you for telling me. I'm notifying your medical team right now so they can see you immediately. Stay here with me.");
    finish();return;}
  if(state.phase===0){
    state.data.chief_complaint={value:a,stated:true,ts:new Date().toISOString(),srcTurn:state.turns.length-1};
    state.cat=classify(a);state.queue=[...CATEGORIES[state.cat].qs,...UNIVERSAL];
    state.phase=1;state.qi=0;render();setTimeout(()=>ask("Entiendo. "),700);return;}
  if(state.phase===4){                       // "ready for the summary?"
    if(isNo(a)){
      enterFixMode("Sin problema. Corrija lo que necesite: haga clic en la respuesta en el panel de la derecha para editar el texto, o pulse Regrabar para decirla otra vez. Cuando esté listo, pulse «Ya está correcto».",
        "No problem. Correct whatever you need: click the response in the panel on the right to edit the text, or press Re-record to say it again. When you're ready, press \'It\'s correct now\'.");
      return;
    }
    setTimeout(readBack,500);return;
  }

  if(state.phase===3){                       // in correction mode
    if(isYes(a)){exitFixMode();setTimeout(readBack,500);return;}
    say("Cuando termine de corregir, pulse «Ya está correcto — continuar con el resumen», o dígame «listo».",
        "When you've finished correcting, press \'It\'s correct now — continue to the summary\', or tell me \'ready\'.");
    return;
  }

  if(state.phase===2){
    if(isNo(a)){                             // recap is wrong -> fix, don't restart
      state.data.readback_confirmed={value:a,stated:true,ts:new Date().toISOString(),srcTurn:state.turns.length-1};
      enterFixMode("Gracias por decírmelo. Vamos a corregirlo sin empezar de nuevo. En el panel de la derecha, haga clic en la respuesta que no quedó bien para editar el texto, o pulse Regrabar para decirla otra vez. Cuando esté correcto, pulse «Ya está correcto».",
        "Thank you for telling me. We'll fix it without starting over. In the panel on the right, click the response that isn't right to edit the text, or press Re-record to say it again. When it's correct, press \'It\'s correct now\'.");
      return;
    }
    state.data.readback_confirmed={value:a,stated:true,ts:new Date().toISOString(),srcTurn:state.turns.length-1};
    const sp=CATEGORIES[state.cat].specialist;
    say("Gracias. He preparado un resumen para su médico. Con base en los síntomas que ha informado, su médico recomienda una evaluación con "+specialistEs(state.cat)+". Nuestro personal le ayudará a programar la cita.",
        "Thank you. I've prepared a summary for your physician. Based on the symptoms you've reported, your physician recommends an evaluation with a "+sp.toLowerCase()+" specialist. Our staff will help schedule your appointment.");
    finish();return;}
  const[key]=state.queue[state.qi];
  state.data[key]={value:a,stated:true,ts:new Date().toISOString(),srcTurn:state.turns.length-1};
  const issue=validateAnswer(key,a);
  if(issue){
    state.data[key].needsReview=true;state.data[key].reviewReason=issue;
    const t=state.turns[state.turns.length-1];if(t)t.needsReview=true;
  }
  if(key==="current_medications"){const inf=inferFromMeds(a);
    if(inf)state.data.inferred_condition={value:inf,stated:false,ts:new Date().toISOString(),srcTurn:state.turns.length-1};}
  state.qi++;render();
  if(state.qi<state.queue.length){
    setTimeout(()=>ask(["Gracias. ","Entiendo. ","Ya casi terminamos. ","Muy bien. "][state.qi%4]),700);
  } else setTimeout(askReady,700);
}
const specialistEs=c=>({RESPIRATORY:"un neumólogo",CARDIAC:"un cardiólogo",NEURO:"un neurólogo",
  GI:"un gastroenterólogo",MSK_INJURY:"un ortopedista",INFECTION:"un especialista en enfermedades infecciosas",
  GENERAL:"su médico de cabecera"}[c]);
function inferFromMeds(a){const t=norm(a);
  if(/lisinopril|amlodipin|losart|presion/.test(t))return "Hipertensión (deducida del medicamento)";
  if(/loratadin|cetirizin|alergi/.test(t))return "Alergias ambientales (deducidas del medicamento)";
  if(/metformin|insulin/.test(t))return "Diabetes (deducida del medicamento)";
  if(/fluticason|albuterol|salbutamol/.test(t))return "Asma (deducida del medicamento)";
  if(/ibuprofeno|naproxeno/.test(t))return "Dolor crónico (deducido del medicamento)";
  return null;}
const AFFIRM=/\b(si|s[ií]|claro|correcto|exacto|as[ií] es|listo|lista|adelante|ok|okay|vale|de acuerdo|perfecto|ya|est[aá] bien|todo bien)\b/;
const NEGATE=/\b(no|nop|incorrecto|equivocado|mal|falso|espere|espera|todav[ií]a no|a[uú]n no|un momento|momento|cambiar|corregir)\b/;
function isYes(t){const n=norm(t);return AFFIRM.test(n)&&!NEGATE.test(n);}
function isNo(t){return NEGATE.test(norm(t));}

function enterFixMode(msgEs,msgEn){
  state.phase=3;
  $("fixBanner").style.display="block";
  $("fixBanner").scrollIntoView({behavior:"smooth",block:"nearest"});
  say(msgEs,msgEn);
}
function exitFixMode(){ $("fixBanner").style.display="none"; }

/* Speak the effect of the last correction, and resume questioning if the route changed. */
function announceConsequence(){
  const last=(state.textEdits||[])[state.textEdits.length-1];
  if(!last||!last.consequences||!last.consequences.length)return;
  const esc=last.consequences.find(c=>c.startsWith("escalation"));
  const de =last.consequences.find(c=>c.startsWith("de-escalation"));
  const rr =last.consequences.find(c=>c.startsWith("rerouted"));

  if(esc){
    exitFixMode();
    say("Gracias por la corrección. Con esa información voy a avisar a su equipo médico para que le atiendan de inmediato. Quédese aquí conmigo.",
        "Thank you for the correction. With that information I'm going to notify your medical team so they can see you immediately. Stay here with me.");
    finish();return;
  }
  if(rr){
    exitFixMode();
    state.phase=1;
    if(state.qi<state.queue.length){
      say("Gracias por la corrección. Con eso cambian las preguntas: voy a hacerle algunas nuevas sobre lo que me acaba de decir.",
          "Thank you for the correction. That changes the questions — I'll ask you a few new ones about what you just told me.")
        .then(()=>setTimeout(()=>ask(""),500));
    } else setTimeout(askReady,600);
    return;
  }
  if(de){
    say("Gracias por aclararlo. He retirado la señal de alarma y seguimos con las preguntas.",
        "Thank you for clarifying. I've removed the alert and we'll continue with the questions.");
  }
}

function ask(p){const q=state.queue[state.qi];say((p||"")+q[1],q[2],[(p||"").trim(),q[1]]);}
function askReady(){
  state.phase=4;
  const n=flagCount();
  if(n){
    $("fixBanner").style.display="block";
    say("Hemos terminado las preguntas. Hay "+n+(n===1?" respuesta que no estoy seguro de haber entendido":" respuestas que no estoy seguro de haber entendido")+
        ". Están marcadas en el panel de la derecha. Por favor revísela"+(n===1?"":"s")+
        ": puede editar el texto o regrabarla"+(n===1?"":"s")+". ¿Está listo para el resumen?",
        "We've finished the questions. There "+(n===1?"is 1 answer":"are "+n+" answers")+
        " I'm not sure I understood correctly. "+(n===1?"It is":"They are")+
        " marked in the panel on the right. Please review "+(n===1?"it":"them")+
        " — you can edit the text or re-record. Are you ready for the summary?");
    return;
  }
  say("Hemos terminado las preguntas. Antes de preparar el resumen: si alguna de sus respuestas no quedó bien, puede corregirla ahora haciendo clic en ella en el panel de la derecha. ¿Está listo para el resumen?",
      "We've finished the questions. Before I prepare the summary: if any of your answers didn't come out right, you can correct it now by clicking on it in the panel on the right. Are you ready for the summary?");
}

function readBack(){
  const es=[],en=[];
  for(const[k,v]of Object.entries(state.data)){
    if(v.stated===false||k==="red_flags")continue;
    es.push((LABELS[k]?LABELS[k][0]:k)+": "+v.value);
    en.push((LABELS[k]?LABELS[k][1]:k)+": "+translate(v.value).text.replace(/\.$/,""));
  }
  state.phase=2;
  say("Permítame confirmar que entendí correctamente. "+es.join(". ")+". ¿Es correcto?",
      "Let me confirm I understood correctly. "+en.join(". ")+". Is that correct?");
}
function finish(){
  exitFixMode();
  state.done=true;state.completedAt=new Date().toISOString();
  $("speak").disabled=true;$("typed").disabled=true;
  $("donePanel").style.display="block";$("status").textContent="Conversación completa";
  $("donePanel").scrollIntoView({behavior:"smooth",block:"nearest"});
  submitForPhysicianReview();
}

/* Hand the completed intake to the doctor's review queue (simulated LLM
   extraction step — see summary-extractor.js). No backend in this prototype,
   so reviews-store.js persists it via localStorage for doctor-dashboard.html. */
function submitForPhysicianReview(){
  if(typeof addReview!=="function"||typeof extractPhysicianSummary!=="function")return;

  const fields=Object.entries(state.data).map(([k,v])=>({
    field:k, label:LABELS[k]?LABELS[k][1]:k, value:v.value, statedByPatient:v.stated
  }));
  const c=state.cat?CATEGORIES[state.cat]:null;

  const summary=extractPhysicianSummary({
    fields,
    category:state.cat,
    categoryLabel:c?c.specialist:null,
    triagePriority:state.emergency?"EMERGENT":(c?c.priority:"ROUTINE"),
    emergencyFlag:!!state.emergency,
    languageSpoken:"es-ES",
    startedAt:state.startedAt,
    completedAt:state.completedAt,
    userId:(typeof PROFILE!=="undefined"&&PROFILE.userId)||"USR-001"
  });

  const now=new Date();

  addReview({
    id:"review-live-"+state.sessionId,
    appointmentId:apptContext?apptContext.id:null,
    patientName:(typeof PROFILE!=="undefined"&&PROFILE.name)||"Patient",
    doctor:apptContext?apptContext.doctor:"Unassigned Provider",
    specialty:apptContext?apptContext.specialty:"General Intake",
    location:apptContext?apptContext.location:"Verbatim Virtual Intake",
    date:apptContext?apptContext.date:now.toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"}),
    time:apptContext?apptContext.time:now.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"}),
    status:"pending",
    summary,
    transcript:state.turns,
    sessionId:state.sessionId,
    createdAt:state.completedAt,
    flags:[],
    followUpMessage:"",
    decidedAt:null,
    signature:(typeof buildSignature==="function")?buildSignature("pending",null):{status:"UNSIGNED",signerName:null,signerId:null,signedAt:null,meaning:null}
  });
}
/* ---------- audit / export ---------- */
async function sha256(s){if(!crypto||!crypto.subtle)return "(hash no disponible)";
  const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("");}
function auditRecord(){const c=state.cat?CATEGORIES[state.cat]:null;
  return{session_id:state.sessionId,application:APP_VERSION,started_at:state.startedAt,completed_at:state.completedAt,
    original_language:"Spanish (es-ES)",output_language:"English",
    capture_method:state.usedMic?"speech (Web Speech API)":"typed entry",
    condition_category:state.cat,specialty_routed:c?c.specialist:null,
    triage_priority:state.emergency?"EMERGENT":(c?c.priority:null),emergency_flag:!!state.emergency,
    transcript:state.turns,
    fields:Object.entries(state.data).map(([k,v])=>({field:k,label:LABELS[k]?LABELS[k][1]:k,value:v.value,
      stated_by_patient:v.stated,source_turn:v.srcTurn,
      value_en:glossEn(v.value),
      source_span:v.srcTurn!=null&&state.turns[v.srcTurn]?state.turns[v.srcTurn].text:null,
      source_span_en:v.srcTurn!=null&&state.turns[v.srcTurn]?glossEn(state.turns[v.srcTurn].text):null,
      captured_at:v.ts,
      flagged_for_review:!!v.needsReview,
      review_reason:v.needsReview?v.reviewReason.en:null,
      review_code:v.needsReview?v.reviewReason.code:null,
      amended:!!v.edited,original_value:v.original!==undefined?v.original:null,
      amendments:v.amendments||[],last_amended_at:v.editedAt||null})),
    text_edits:(state.textEdits||[]).map(e=>({sequence:e.seq,edited_at:e.at,turn_index:e.turn_index,
      in_response_to_es:e.question_es,in_response_to_en:e.question_en,
      field:e.field,field_label:e.field_label,
      original_text:e.original_text,edited_text:e.edited_text,
      original_text_es:e.original_text,original_text_en:glossEn(e.original_text),
      edited_text_es:e.edited_text,edited_text_en:glossEn(e.edited_text),edited_via:e.edited_via,
      consequences:e.consequences||[]})),
    text_edit_count:(state.textEdits||[]).length,
    flagged_count:Object.values(state.data).filter(v=>v.needsReview).length,
    signature:{status:"UNSIGNED",note:"Awaiting clinician review and 21 CFR Part 11 electronic signature."},
    data_classification:"SYNTHETIC / TEST DATA — no real PHI"};}

/* ===================== CLINICAL REPORT (opens in a new tab) ===================== */
const esc=x=>String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

async function buildReportHTML(){
  const r=auditRecord();
  const c=CATEGORIES[state.cat]||CATEGORIES.GENERAL;
  const hash=await sha256(JSON.stringify(r));
  const flagged=r.fields.filter(f=>f.flagged_for_review);
  const fmt=d=>{try{return new Date(d).toLocaleString("es-ES",{dateStyle:"medium",timeStyle:"medium"});}catch(e){return d;}};

  const conv=r.transcript.map(t=>`
    <div class="turn ${t.who}">
      <div class="speaker">${t.who==="agent"?"Verbatim":"Paciente / Patient"}
        ${t.edited?'<span class="tag edit">EDITADO</span>':''}
        ${t.needsReview?'<span class="tag warn">REVISADO</span>':''}</div>
      <div class="es">${esc(t.text)}</div>
      <div class="en">${t.en?esc(t.en):esc(translate(t.text).text)}</div>
    </div>`).join("");

  const summary=r.fields.filter(f=>f.field!=="readback_confirmed").map(f=>`
    <div class="sumitem">
      <div class="sumlabel">${esc(f.label)}
        ${f.stated_by_patient===false?'<span class="tag infer">INFERIDO / INFERRED</span>':''}
        ${f.amended?'<span class="tag edit">CORREGIDO / AMENDED</span>':''}
        ${f.flagged_for_review?'<span class="tag warn">REVISAR / REVIEW</span>':''}</div>
      <div class="sumes"><span class="lang">es</span>${esc(f.value)}</div>
      <div class="sumen"><span class="lang">en</span>${esc(translate(f.value).text)}</div>
      ${f.flagged_for_review?`<div class="flagnote">⚠ ${esc(f.review_reason)}</div>`:''}
    </div>`).join("");

  const trace=r.fields.map(f=>`
    <tr>
      <td><b>${esc(f.label)}</b></td>
      <td><span class="lang">es</span>${esc(f.value)}<br/><span class="lang">en</span><i>${esc(translate(f.value).text)}</i></td>
      <td>${f.stated_by_patient===false?'<b>NO — inferido</b>':'sí'}</td>
      <td>${f.amended?'sí':'no'}</td>
      <td>${f.source_turn!=null?"#"+f.source_turn:"—"}</td>
      <td class="mono">${esc(f.captured_at)}</td>
    </tr>`).join("");

  const edits=(r.text_edits||[]).map(e=>`
    <div class="edit-block">
      <div class="edit-head">Edición ${e.sequence} · ${fmt(e.edited_at)} · ${esc(e.edited_via)}</div>
      <div><b>Pregunta / Question:</b> ${esc(e.in_response_to_es||"—")}<br/><i>${esc(e.in_response_to_en||"")}</i></div>
      <div class="diff"><span class="was">Original (es):</span> ${esc(e.original_text)}<br/>
        <span class="was">Original (en):</span> <i>${esc(translate(e.original_text).text)}</i></div>
      <div class="diff"><span class="now">Corregido (es):</span> ${esc(e.edited_text)}<br/>
        <span class="now">Corrected (en):</span> <i>${esc(translate(e.edited_text).text)}</i></div>
      ${(e.consequences&&e.consequences.length)?`<div class="cons">Consecuencia: ${esc(e.consequences.join("; "))}</div>`:''}
    </div>`).join("") || '<p class="none">No se realizaron ediciones. Todas las respuestas son las capturadas originalmente.<br/><i>No edits were made. All responses are as originally captured.</i></p>';

  const flagBlock = flagged.length ? `
    <table class="grid">
      <thead><tr><th>Campo</th><th>Valor (es)</th><th>Motivo / Reason</th><th>Resuelto</th></tr></thead>
      <tbody>${flagged.map(f=>`<tr><td><b>${esc(f.label)}</b></td><td>${esc(f.value)}</td>
        <td>${esc(f.review_reason)}</td><td>${f.amended?'sí':'<b>no</b>'}</td></tr>`).join("")}</tbody>
    </table>`
    : '<p class="none">Ninguna respuesta fue marcada. Todas coincidieron con la forma esperada para su pregunta.<br/><i>No responses flagged. All answers matched the expected form for their question.</i></p>';

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/>
<title>Verbatim — Resumen de admisión ${esc(r.session_id)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
 :root{--ink:#0b1220;--muted:#64748b;--line:#e2e8f0;--brand:#4f46e5;--warn:#b45309;--ok:#047857;--danger:#b91c1c}
 *{box-sizing:border-box}
 body{margin:0;background:#eef2f7;color:var(--ink);
   font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6}
 .bar{position:sticky;top:0;z-index:9;background:#0b1220;color:#fff;padding:14px 22px;
   display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
 .bar .t{font-weight:700;letter-spacing:-.01em}
 .bar .acts{display:flex;gap:9px;flex-wrap:wrap}
 .bar button{border:0;border-radius:9px;padding:10px 17px;font-family:inherit;font-size:13.5px;
   font-weight:600;cursor:pointer;background:#fff;color:#0b1220}
 .bar button.primary{background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#fff}
 .page{max-width:900px;margin:22px auto 60px;background:#fff;padding:52px 60px;
   box-shadow:0 12px 40px -18px rgba(15,23,42,.3);border-radius:6px}
 h1{font-size:25px;margin:0 0 4px;letter-spacing:-.02em}
 .sub{color:var(--muted);font-size:14px;margin-bottom:22px}
 h2{font-size:15px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);
   margin:38px 0 14px;padding-bottom:8px;border-bottom:2px solid var(--line)}
 h3{font-size:14.5px;margin:20px 0 6px}
 .banner{border:2px solid #f59e0b;background:#fffbeb;border-radius:10px;padding:18px 20px;margin-bottom:26px}
 .banner .h{font-weight:800;color:#92400e;font-size:15px;letter-spacing:.02em;margin-bottom:6px}
 .banner p{margin:0 0 8px;font-size:13.5px;color:#78350f}
 .banner p:last-child{margin:0}
 .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 26px;font-size:13.5px;margin-bottom:8px}
 .meta div{display:flex;justify-content:space-between;gap:12px;border-bottom:1px dotted var(--line);padding:5px 0}
 .meta span:first-child{color:var(--muted)}
 .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}
 .turn{margin:0 0 16px;padding-left:14px;border-left:3px solid var(--line)}
 .turn.agent{border-left-color:#c7d2fe}
 .turn.patient{border-left-color:#a7f3d0}
 .speaker{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
 .turn .es{font-size:14.5px}
 .turn .en{font-size:13px;color:var(--muted);font-style:italic;margin-top:3px}
 .tag{display:inline-block;font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:4px;margin-left:6px;letter-spacing:.03em}
 .tag.infer{background:#fef3c7;color:#92400e;border:1px solid #fcd34d}
 .tag.edit{background:#eef2ff;color:var(--brand);border:1px solid #c7d2fe}
 .tag.warn{background:#fee2e2;color:var(--danger);border:1px solid #fecaca}
 .sumitem{padding:12px 0;border-bottom:1px solid #f1f5f9}
 .sumlabel{font-weight:700;font-size:13.5px;margin-bottom:5px}
 .sumes,.sumen{font-size:14px;padding-left:2px}
 .sumen{color:var(--muted);font-style:italic;font-size:13px}
 .lang{display:inline-block;font-size:9.5px;font-weight:700;color:#fff;background:#94a3b8;
   border-radius:3px;padding:1px 5px;margin-right:8px;vertical-align:1px;font-style:normal}
 .flagnote{font-size:12.5px;color:var(--warn);background:#fffbeb;border:1px solid #fde68a;
   border-radius:7px;padding:7px 10px;margin-top:7px}
 table.grid{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px}
 table.grid th{text-align:left;background:#f8fafc;border:1px solid var(--line);padding:8px 10px;font-size:11.5px;
   text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
 table.grid td{border:1px solid var(--line);padding:8px 10px;vertical-align:top}
 .edit-block{border:1px solid var(--line);border-radius:9px;padding:14px 16px;margin-bottom:12px;font-size:13px}
 .edit-head{font-weight:700;font-size:12px;color:var(--brand);margin-bottom:8px}
 .diff{margin-top:7px}
 .was{color:var(--danger);font-weight:700;font-size:11.5px}
 .now{color:var(--ok);font-weight:700;font-size:11.5px}
 .cons{margin-top:8px;font-size:12px;color:var(--warn)}
 .none{font-size:13.5px;color:var(--muted)}
 .sig{border:2px solid var(--line);border-radius:10px;padding:22px 24px;margin-top:14px}
 .sigrow{display:grid;grid-template-columns:210px 1fr;gap:10px;align-items:end;margin-bottom:20px}
 .sigrow label{font-size:12.5px;font-weight:600;color:var(--muted)}
 .sigline{border-bottom:1.5px solid #94a3b8;height:26px}
 .sigmeaning{font-size:12.5px;color:var(--muted);border-top:1px dashed var(--line);padding-top:12px;margin-top:4px}
 .note{font-size:12px;color:var(--muted);line-height:1.65}
 .hashbox{background:#f8fafc;border:1px solid var(--line);border-radius:8px;padding:12px 14px;margin-top:8px}
 @media print{
   .bar{display:none} body{background:#fff}
   .page{box-shadow:none;margin:0;padding:26px 30px;max-width:none;border-radius:0}
   h2{page-break-after:avoid} .turn,.edit-block,.sumitem,.sig{page-break-inside:avoid}
   .banner{border-color:#b45309}
 }
</style></head><body>
<div class="bar">
  <div class="t">Verbatim · Resumen de admisión — <span class="mono">${esc(r.session_id)}</span></div>
  <div class="acts">
    <button class="primary" onclick="window.print()">⬇ Descargar PDF / Download PDF</button>
    <button onclick="window.close()">Cerrar</button>
  </div>
</div>

<div class="page">
  <h1>Resumen de admisión del paciente</h1>
  <div class="sub">Patient Intake Summary · ${esc(c.name)} → ${esc(c.specialist)} · ${esc(r.session_id)}</div>

  <div class="banner">
    <div class="h">⚠ DOCUMENTO NO FIRMADO — UNSIGNED SUMMARY</div>
    <p><b>Español:</b> Este resumen ha sido generado automáticamente a partir de la admisión del
    paciente y <b>aún no ha sido revisado ni firmado por un médico</b>. Un médico revisará y aprobará
    este documento. Una vez completada la revisión, una <b>versión actualizada y firmada</b> estará
    disponible para su descarga.</p>
    <p><b>English:</b> This summary was generated automatically from the patient intake and
    <b>has not yet been reviewed or signed by a physician</b>. A physician will review and approve this
    document. Once review is complete, an <b>updated, signed version will be available for download</b>.</p>
  </div>

  <h2>Datos de la sesión / Session details</h2>
  <div class="meta">
    <div><span>ID de sesión</span><span class="mono">${esc(r.session_id)}</span></div>
    <div><span>Aplicación</span><span>${esc(r.application)}</span></div>
    <div><span>Inicio</span><span>${fmt(r.started_at)}</span></div>
    <div><span>Finalización</span><span>${fmt(r.completed_at)}</span></div>
    <div><span>Idioma original</span><span>${esc(r.original_language)}</span></div>
    <div><span>Idioma de salida</span><span>Inglés (traducción automática)</span></div>
    <div><span>Especialidad detectada</span><span>${esc(c.specialist)}</span></div>
    <div><span>Prioridad de triage</span><span><b>${esc(r.triage_priority)}</b></span></div>
    <div><span>Método de captura</span><span>${esc(r.capture_method)}</span></div>
    <div><span>Clasificación de datos</span><span>${esc(r.data_classification)}</span></div>
  </div>

  ${state.emergency?`<div class="banner" style="border-color:#b91c1c;background:#fef2f2">
    <div class="h" style="color:#991b1b">⚠ CRITERIO DE ALARMA DETECTADO — RED FLAG</div>
    <p>${esc(state.data.red_flags?state.data.red_flags.value:"")} — se indicó atención médica inmediata.</p></div>`:''}

  <h2>Resumen para el médico / Physician Summary</h2>
  ${summary}

  <h2>Referencia / Referral</h2>
  <p><b>Especialista / Specialist:</b> ${esc(c.specialist)}</p>
  <p><b>Motivo / Reason:</b> Síntomas informados por el paciente dirigidos a ${esc(c.specialist)};
     prioridad de triage <b>${esc(r.triage_priority)}</b>.</p>
  <p><b>Estado / Status:</b> ${state.emergency
     ? "Escalado para revisión inmediata / Escalated for immediate review."
     : "Referencia preparada para revisión médica / Referral prepared for physician review."}</p>

  <h2>Respuestas marcadas para revisión / Flagged Responses</h2>
  ${flagBlock}

  <h2>Conversación / Conversation</h2>
  <p class="note">El español es el registro auténtico de lo que dijo el paciente. El inglés es una
  traducción automática para conveniencia del médico y requiere revisión clínica.<br/>
  <i>Spanish is the authoritative record of what the patient said. English is a machine translation
  provided for physician convenience and requires clinician review.</i></p>
  ${conv}

  <h2>Ediciones de texto / Text Edits</h2>
  <p class="note">Las respuestas originales se conservan. Las correcciones se registran como
  enmiendas, nunca como sobrescrituras.<br/><i>Original responses are preserved. Corrections are
  recorded as amendments, never overwrites.</i></p>
  ${edits}

  <h2>Trazabilidad por campo / Field-level Traceability</h2>
  <table class="grid">
    <thead><tr><th>Campo</th><th>Valor (es / en)</th><th>Dicho por el paciente</th><th>Enmendado</th><th>Turno</th><th>Capturado</th></tr></thead>
    <tbody>${trace}</tbody>
  </table>

  <h2>Nota de seguridad clínica / Clinical Safety Note</h2>
  <p class="note"><b>Español:</b> Verbatim apoya la admisión, la traducción, el resumen y el soporte
  a la decisión clínica. El diagnóstico final, el tratamiento y las decisiones de referencia deben ser
  revisados y aprobados por un profesional sanitario colegiado. Las reglas de triage de este prototipo
  son ilustrativas y no han sido validadas clínicamente.<br/><br/>
  <b>English:</b> Verbatim supports intake, translation, summarization, and clinical decision support.
  Final diagnosis, treatment, and referral decisions must be reviewed and approved by a licensed
  healthcare professional. Triage rules in this prototype are illustrative and have not been
  clinically validated.</p>

  <h2>Firma electrónica / Electronic Signature (21 CFR Part 11)</h2>
  <div class="sig">
    <p style="margin-top:0;font-size:13px;color:#b45309"><b>Estado / Status: NO FIRMADO — UNSIGNED.</b>
       Pendiente de revisión y aprobación médica.</p>

    <h3>Médico revisor / Reviewing physician</h3>
    <div class="sigrow"><label>Nombre / Name</label><div class="sigline"></div></div>
    <div class="sigrow"><label>Nº de colegiado / License · NPI</label><div class="sigline"></div></div>
    <div class="sigrow"><label>Firma / Signature</label><div class="sigline"></div></div>
    <div class="sigrow"><label>Fecha y hora / Date &amp; time</label><div class="sigline"></div></div>

    <h3>Intérprete o personal de admisión / Interpreter or intake staff <span style="font-weight:400;color:#94a3b8">(si aplica)</span></h3>
    <div class="sigrow"><label>Nombre / Name</label><div class="sigline"></div></div>
    <div class="sigrow"><label>Firma / Signature</label><div class="sigline"></div></div>
    <div class="sigrow"><label>Fecha y hora / Date &amp; time</label><div class="sigline"></div></div>

    <div class="sigmeaning"><b>Significado de la firma / Meaning of signature:</b>
      «He revisado este resumen de admisión, incluida la transcripción original en español y las
      enmiendas registradas, y lo apruebo para su incorporación al expediente médico.»<br/>
      <i>"I have reviewed this intake summary, including the original Spanish transcript and the
      recorded amendments, and approve it for entry into the medical record."</i></div>
  </div>

  <h2>Integridad del registro / Record Integrity</h2>
  <div class="hashbox">
    <div class="mono"><b>SHA-256:</b> ${esc(hash)}</div>
    <p class="note" style="margin:8px 0 0">Cualquier modificación de este registro cambia el hash,
    haciendo detectable la alteración. / Any modification to this record changes the hash, making
    alteration detectable.</p>
  </div>

  <p class="note" style="margin-top:30px;padding-top:14px;border-top:1px solid var(--line)">
    Generado / Generated: ${fmt(new Date().toISOString())} · ${esc(r.application)} ·
    Ediciones registradas: ${r.text_edit_count} · Respuestas marcadas: ${r.flagged_count}<br/>
    <b>Prototipo — datos sintéticos. No apto para uso clínico real.</b>
  </p>
</div>
</body></html>`;
}

async function openReport(){
  const w=window.open("","_blank");
  if(!w){diag("El navegador bloqueó la ventana emergente. Permita las ventanas emergentes para este sitio.");return;}
  w.document.open();
  w.document.write(await buildReportHTML());
  w.document.close();
}

async function buildMarkdown(){
  const r=auditRecord(),c=CATEGORIES[state.cat]||CATEGORIES.GENERAL,hash=await sha256(JSON.stringify(r)),L=[];
  L.push("# Verbatim Medical Intake Demo — "+c.specialist,"","## Scenario",
   "A Spanish-speaking patient completed a Verbatim intake. The assistant detected the presenting complaint, routed to the "+c.specialist+" question set, conducted the intake in Spanish, and prepared a physician summary and referral.",
   "","---","","## Conversation","");
  r.transcript.forEach(t=>{L.push("### "+(t.who==="agent"?"Verbatim":"Patient"),"**Spanish**","> "+t.text,"","**English**",
    t.en?("> "+t.en):"> _[Translation not performed in offline mode — original Spanish preserved verbatim]_","","---","");});
  L.push("## Physician Summary","");
  r.fields.forEach(f=>{if(f.field==="readback_confirmed")return;
    L.push("### "+f.label);
    L.push("- **(es)** "+f.value+
      (f.stated_by_patient===false?"  _(inferred — not stated by patient)_":"")+
      (f.amended?"  _(corrected during review — original: \""+f.original_value+"\")_":""));
    L.push("- **(en)** "+glossEn(f.value));
    L.push("");});
  L.push("---","","## Referral","","**Specialist:** "+c.specialist,"","**Reason for Referral:**",
    "- Presenting complaint routed to "+c.specialist+" based on patient-reported symptoms");
  if(state.emergency)L.push("- **Red-flag criteria met — immediate clinical attention indicated**");
  L.push("- Triage priority: "+r.triage_priority,"",
    "**Status:** "+(state.emergency?"Escalated for immediate review.":"Referral prepared for physician review."),
    "","---","","## Clinical Safety Note",
    "Verbatim supports intake, translation, summarization, and clinical decision support. Final diagnosis, treatment, and referral decisions must be reviewed and approved by a licensed healthcare professional.",
    "","---","","## Audit Trail",
    "- **Transcript window:** "+r.started_at+" — "+r.completed_at,
    "- **Record provenance:** This record was produced using "+APP_VERSION,
    "- **Original Language:** Spanish","- **Output Language:** English (machine gloss; Spanish is the authoritative record)",
    "- **Session ID:** `"+r.session_id+"`",
    "- **Condition category:** "+r.condition_category+" (auto-routed from opening complaint)",
    "- **Specialty routed:** "+r.specialty_routed,"- **Triage priority:** "+r.triage_priority,
    "- **Capture method:** "+r.capture_method,"- **Text edits recorded:** "+r.text_edit_count,"- **Responses flagged for review:** "+r.flagged_count,"- **Data classification:** "+r.data_classification,
    "","### Field-level traceability","",
    "Spanish is the authoritative record. English lines are machine glosses for physician",
    "convenience and require clinician review.","");
  r.fields.forEach(f=>{
    L.push("#### "+f.label);
    L.push("- **Value (es):** "+f.value);
    L.push("- **Translation (en):** "+glossEn(f.value));
    if(f.source_span){
      L.push("- **Source span (es):** \""+f.source_span+"\"");
      L.push("- **Source span (en):** \""+glossEn(f.source_span)+"\"");
    }
    L.push("- **Stated by patient:** "+(f.stated_by_patient===false?"**NO — inferred by system**":"yes"));
    if(f.flagged_for_review)
      L.push("- **⚠ Flagged for review:** "+f.review_reason+" — patient was prompted to edit or re-record.");
    L.push("- **Amended:** "+(f.amended?"**yes** (original: \""+f.original_value+"\")":"no"));
    L.push("- **Source turn:** "+(f.source_turn!=null?"#"+f.source_turn:"—"));
    L.push("- **Captured at:** "+f.captured_at);
    L.push("");
  });
  const amended=r.fields.filter(f=>f.amended);
  if(amended.length){
    L.push("","### Amendment log","",
      "Original captures are preserved; corrections are recorded as amendments, never overwrites.","",
      "| Field | Original | Amended to | Timestamp |","|---|---|---|---|");
    amended.forEach(f=>f.amendments.forEach(am=>
      L.push("| "+f.label+" | "+String(am.from).replace(/\|/g,"\\|")+" | "+
        String(am.to).replace(/\|/g,"\\|")+" | "+am.at+" |")));
  }
  // ---- Responses flagged for review ----
  const flagged=r.fields.filter(f=>f.flagged_for_review);
  L.push("","---","","## Responses Flagged for Review","");
  if(!flagged.length){
    L.push("_No responses were flagged. All answers matched the expected form for their question._","");
  }else{
    L.push("Verbatim checks each answer against the form expected for that question",
      "(a 0\u201310 rating, a yes/no, a duration) and against transcription quality.",
      "Flagged answers were surfaced to the patient for correction before the summary.","",
      "| Field | Value (es) | Reason flagged | Resolved by edit |","|---|---|---|---|");
    flagged.forEach(f=>L.push("| "+f.label+" | "+String(f.value).replace(/\|/g,"\\|")+" | "+
      f.review_reason+" | "+(f.amended?"yes":"**no — left as captured**")+" |"));
    L.push("");
  }

  // ---- Text Edits ----
  L.push("","---","","## Text Edits","");
  if(!r.text_edits.length){
    L.push("_No text edits were made. All responses are as originally captured._","");
  } else {
    L.push("Responses corrected after capture. **Original text is preserved** — edits are recorded",
      "as amendments with attribution to the question they answered.","",
      "| # | Date / time (UTC) | In response to | Original (es) | Edited to (es) |",
      "|---|---|---|---|---|");
    r.text_edits.forEach(e=>{
      const esc=x=>String(x==null?"—":x).replace(/\|/g,"\\|");
      L.push("| "+e.sequence+" | "+e.edited_at+" | "+esc(e.in_response_to_es)+" | "+
        esc(e.original_text)+" | "+esc(e.edited_text)+" |");
    });
    L.push("");
    r.text_edits.forEach(e=>{
      L.push("### Edit "+e.sequence,"");
      L.push("- **Date / time:** "+e.edited_at);
      L.push("- **Question (Spanish):** "+(e.in_response_to_es||"—"));
      L.push("- **Question (English):** "+(e.in_response_to_en||"—"));
      L.push("- **Field affected:** "+(e.field_label||"— (not mapped to a summary field)"));
      L.push("- **Transcript turn:** #"+e.turn_index);
      L.push("- **Original text (es):** \""+e.original_text+"\"");
      L.push("- **Original text (en):** \""+glossEn(e.original_text)+"\"");
      L.push("- **Edited text (es):** \""+e.edited_text+"\"");
      L.push("- **Edited text (en):** \""+glossEn(e.edited_text)+"\"");
      L.push("- **Method:** "+e.edited_via);
      if(e.consequences&&e.consequences.length)
        L.push("- **Consequence:** "+e.consequences.join("; "));
      L.push("");
    });
  }
  L.push("### Electronic signature (21 CFR Part 11)","- **Status:** UNSIGNED — awaiting clinician review",
    "- **Signer name:** ____________________  **Signer ID:** ____________________",
    "- **Date / time:** ____________________",
    "- **Meaning of signature:** 'Reviewed and approved for the record'","",
    "### Record integrity","- **SHA-256:** `"+hash+"`",
    "- Any modification to this record changes the hash, making alteration detectable.","","---",
    "_Prototype. Triage routing is illustrative and has not been clinically validated._");
  return L.join("\n");}
function download(n,c,t){const b=new Blob([c],{type:t}),a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
$("genDoc").onclick=()=>openReport();

$("exportTxt").onclick=async()=>{
  const r=auditRecord(),h=await sha256(JSON.stringify(r)),line="=".repeat(72),L=[];
  L.push(line,"VERBATIM — PATIENT INTAKE AUDIT TRAIL","ALCOA+ / 21 CFR Part 11 aligned record",line,"",
    "Session ID .......... "+r.session_id,"Application ......... "+r.application,
    "Started ............. "+r.started_at,"Completed ........... "+r.completed_at,
    "Original language ... "+r.original_language,"Output language ..... "+r.output_language,
    "Capture method ...... "+r.capture_method,"Condition category .. "+r.condition_category,
    "Flagged for review .. "+r.flagged_count,
    "Specialty routed .... "+r.specialty_routed,"Triage priority ..... "+r.triage_priority,
    "Data classification . "+r.data_classification,"",line,"VERBATIM TRANSCRIPT",line);
  r.transcript.forEach((t,i)=>L.push("  ["+String(i).padStart(2,"0")+"] "+t.ts+"  "+(t.who==="agent"?"VERBATIM ":"PATIENT  "),"       "+t.text));
  L.push("",line,"FIELDS WITH SOURCE TRACEABILITY",line);
  r.fields.forEach(f=>L.push("","  FIELD ............... "+f.label,
    "  Value (es) .......... "+f.value,
    "  Translation (en) .... "+glossEn(f.value),
    "  Stated by patient ... "+(f.stated_by_patient===false?"NO — INFERRED BY SYSTEM":"YES"),
    ...(f.flagged_for_review?["  FLAGGED FOR REVIEW .. "+f.review_reason]:[]),
    "  Source turn ......... "+(f.source_turn!=null?"#"+f.source_turn:"n/a"),
    "  Source span (es) .... "+(f.source_span?'"'+f.source_span+'"':"(derived)"),
    "  Source span (en) .... "+(f.source_span?'"'+glossEn(f.source_span)+'"':"(derived)"),
    "  Captured at ......... "+f.captured_at,
    ...(f.amended?["  AMENDED ............. yes  (original: \""+f.original_value+"\")",
                   "  Last amended at ..... "+f.last_amended_at]:[])));
  L.push("",line,"RESPONSES FLAGGED FOR REVIEW",line);
  const fl=r.fields.filter(f=>f.flagged_for_review);
  if(!fl.length)L.push("  None. All answers matched the expected form for their question.");
  else fl.forEach(f=>L.push("","  FIELD ............... "+f.label,
    "  Value (es) .......... "+f.value,
    "  Reason .............. "+f.review_reason,
    "  Resolved by edit .... "+(f.amended?"yes":"NO — left as captured")));
  L.push("",line,"TEXT EDITS",line);
  if(!r.text_edits.length){L.push("  No text edits were made. All responses are as originally captured.");}
  else{r.text_edits.forEach(e=>L.push("",
    "  EDIT #"+e.sequence,
    "  Date / time ......... "+e.edited_at,
    "  In response to (ES) . "+(e.in_response_to_es||"—"),
    "  In response to (EN) . "+(e.in_response_to_en||"—"),
    "  Field affected ...... "+(e.field_label||"—"),
    "  Transcript turn ..... #"+e.turn_index,
    "  Original text (es) .. \""+e.original_text+"\"",
    "  Original text (en) .. \""+glossEn(e.original_text)+"\"",
    "  Edited text (es) .... \""+e.edited_text+"\"",
    "  Edited text (en) .... \""+glossEn(e.edited_text)+"\"",
    "  Method .............. "+e.edited_via,
    "  Consequence ......... "+((e.consequences&&e.consequences.length)?e.consequences.join("; "):"none")));}
  L.push("",line,"ELECTRONIC SIGNATURE (21 CFR Part 11)",line,"  Status .............. UNSIGNED",
    "  Signer name ......... ____________________________________",
    "  Date / time ......... ____________________________________",
    "  Meaning of signature  'Reviewed and approved for the record'","",line,"RECORD INTEGRITY",line,
    "  SHA-256 ............. "+h,"  Modification changes this hash — alteration is detectable.","",line);
  download("verbatim_audit_"+state.sessionId+".txt",L.join("\n"),"text/plain");};
/* ---------- mic ---------- */
let rec=null,listening=false,buffer="",lastInterim="",silenceTimer=null;
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const pauseMs=()=>parseInt($("pause").value)*1000;

function showInterim(t){
  const el=$("interim");
  if(t&&t.trim()){el.style.display="block";el.innerHTML='<span style="opacity:.6">escuchando…</span> '+t;}
  else{el.style.display="none";el.textContent="";}
}
function resetSilence(){
  if(silenceTimer)clearTimeout(silenceTimer);
  silenceTimer=setTimeout(()=>finalizeSpeech("silence"),pauseMs());
}
function currentSaid(){ return (buffer+" "+lastInterim).replace(/\s+/g," ").trim(); }

function finalizeSpeech(reason){
  if(!listening)return;
  listening=false;
  if(silenceTimer){clearTimeout(silenceTimer);silenceTimer=null;}
  const said=currentSaid();          // <-- includes text still being recognised
  buffer="";lastInterim="";
  try{rec.stop();}catch(e){}
  $("listenRow").style.display="none";
  showInterim("");
  setAv("");
  if(state.recordingTurn!=null){                 // re-recording one answer, not advancing
    const idx=state.recordingTurn;state.recordingTurn=null;
    if(said){
      applyTurnEdit(idx,state.turns[idx].text,said,"voice re-recording");
      renderTranscript();render();
      $("status").textContent="Respuesta regrabada — registrada en el audit trail";
      announceConsequence();
    }else{$("status").textContent="No se detectó voz — intente de nuevo o edite el texto";}
    return;
  }
  if(said){state.usedMic=true;handle(said);}
  else{$("status").textContent="No se detectó voz — intente de nuevo o escriba abajo";}
}
if(SR){
  rec=new SR();rec.lang="es-ES";rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=1;
  rec.onresult=e=>{
    lastInterim="";
    for(let i=e.resultIndex;i<e.results.length;i++){
      const r=e.results[i];
      if(r.isFinal){const t=r[0].transcript.trim();if(t)buffer+=(buffer?" ":"")+t;}
      else lastInterim+=r[0].transcript;
    }
    showInterim(currentSaid());
    resetSilence();                       // every utterance restarts the clock
  };
  rec.onerror=e=>{
    if(e.error==="no-speech"){resetSilence();return;}   // keep waiting patiently
    listening=false;setAv("");$("listenRow").style.display="none";showInterim("");
    $("status").textContent="Micrófono no disponible — escriba la respuesta";
    const m={"not-allowed":"Permiso denegado. Permita el micrófono en la barra de direcciones; en macOS active Chrome en Ajustes → Privacidad → Micrófono.",
      "service-not-allowed":"Verifique que la URL sea http://localhost o https:// y no file://",
      "audio-capture":"No se encontró micrófono.","network":"Este motor de voz requiere conexión a internet."};
    diag("Error de reconocimiento: "+e.error+"\n"+(m[e.error]||""));
  };
  rec.onend=()=>{ if(listening){ setTimeout(()=>{ if(listening)startRecognition(); },120); } };
}else diag("Este navegador no soporta reconocimiento de voz. Use Chrome, o escriba las respuestas.");

/* rec.start() throws InvalidStateError if recognition is still active or
   hasn't finished releasing from a previous session — a real race with
   continuous mode's auto-restart-on-end above. Silently swallowing that
   error (as a bare try/catch does) leaves `listening` true with no actual
   recognizer running, so speech is never captured again. Recover instead:
   force a stop and retry once the engine has had a moment to settle. */
function startRecognition(){
  try{
    rec.start();
  }catch(e){
    try{rec.stop();}catch(_){}
    setTimeout(()=>{ if(listening){ try{rec.start();}catch(_){ listening=false; setAv(""); $("status").textContent="No se pudo activar el micrófono — intente de nuevo o escriba abajo"; } } },250);
  }
}
$("doneSpeak").onclick=()=>finalizeSpeech("manual");
$("resumeSummary").onclick=()=>{exitFixMode();readBack();};

async function ensureMic(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("Micrófono no expuesto. Use Chrome.");
  const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop());}
function hintFor(n){
  if(n==="NotAllowedError")return "→ Permiso denegado. Haga clic en 🔒 en la barra de direcciones y permita el micrófono. macOS: Ajustes → Privacidad y seguridad → Micrófono → active Chrome.";
  if(n==="NotFoundError")return "→ No se detectó micrófono.";
  if(n==="NotReadableError")return "→ Otra aplicación está usando el micrófono. Ciérrela e intente de nuevo.";
  return "→ Verifique que la URL empiece con http://localhost o https:// — el micrófono no funciona con file://";}
$("speak").onclick=async()=>{
  if(!rec){diag("Reconocimiento no disponible. Escriba la respuesta.");return;}
  if(listening){finalizeSpeech("manual");return;}
  speechSynthesis.cancel();
  try{await ensureMic();}catch(err){
    diag("No se pudo acceder al micrófono:\n"+err.name+" — "+err.message+"\n\n"+hintFor(err.name));
    $("status").textContent="Micrófono bloqueado — escriba la respuesta";return;}
  buffer="";lastInterim="";listening=true;
  setAv("listening");
  $("status").textContent="Escuchando… tómese su tiempo";
  $("listenRow").style.display="flex";
  startRecognition();
  resetSilence();};
$("miccheck").onclick=async()=>{
  const L=["URL: "+location.protocol+"//"+location.host];
  L.push(location.protocol==="file:"
    ?"✗ PROBLEMA: abriendo con file://. El micrófono NO funciona así.\n  Solución: python3 -m http.server 8000 → http://localhost:8000/"
    :"✓ Contexto correcto");
  L.push("Contexto seguro: "+(window.isSecureContext?"✓ sí":"✗ no"),
    "Reconocimiento de voz: "+(SR?"✓ disponible":"✗ no — use Chrome"),
    "Síntesis de voz: "+(window.speechSynthesis?"✓ disponible":"✗ no"));
  try{await ensureMic();L.push("Permiso de micrófono: ✓ concedido");}
  catch(err){L.push("Permiso de micrófono: ✗ "+err.name,hintFor(err.name));}
  diag(L.join("\n"));};
$("typed").addEventListener("keydown",e=>{if(e.key==="Enter"){handle(e.target.value);e.target.value="";}});
/* ---------- lifecycle ---------- */
$("start").onclick=()=>{
  state={phase:0,qi:0,cat:null,queue:[],data:{},emergency:false,turns:[],textEdits:[],done:false,usedMic:false,
    sessionId:"VB-"+Date.now().toString(36).toUpperCase(),startedAt:new Date().toISOString(),completedAt:null};
  // hard reset of every transient surface
  listening=false;buffer="";lastInterim="";
  if(silenceTimer){clearTimeout(silenceTimer);silenceTimer=null;}
  try{if(rec)rec.abort();}catch(e){}
  try{speechSynthesis.cancel();}catch(e){}
  stopTalking();
  showInterim("");
  $("listenRow").style.display="none";
  $("transcript").innerHTML="";$("form").querySelector("tbody").innerHTML="";
  $("cat").textContent="—";$("prio").textContent="—";
  $("alert").style.display="none";$("donePanel").style.display="none";$("fixBanner").style.display="none";
  state.recordingTurn=null;
  $("diag").className="";$("diag").textContent="";
  $("typed").value="";
  $("speak").disabled=false;$("typed").disabled=false;
  say("Hola. Soy Verbatim, su asistente de admisión médica. Voy a hacerle algunas preguntas para ayudar a preparar su consulta. ¿Cuál es el motivo principal de su visita hoy?",
      "Hello. I'm Verbatim, your medical intake assistant. I'll ask you a few questions to help prepare for your appointment. What brings you in today?");};
function preferVoice(g){
  g=g||"female";
  if(!VOICES.length)return;
  const male=/jorge|diego|juan|carlos|pablo|enrique|male|hombre/i;
  const female=/m[oó]nica|paulina|marisol|luc[ií]a|sabina|helena|elena|female|mujer/i;
  const want=g==="male"?male:female;
  const i=VOICES.findIndex(v=>want.test(v.name));
  if(i>=0)$("voicePick").value=i;
}
$("reset").onclick=()=>{try{if(rec)rec.abort();}catch(e){}try{speechSynthesis.cancel();}catch(e){}location.reload();};
$("pause").oninput=e=>$("pauseVal").textContent=e.target.value;
$("rate").oninput=e=>$("rateVal").textContent=e.target.value;
$("pitch").oninput=e=>$("pitchVal").textContent=e.target.value;
$("testVoice").onclick=async()=>{const t="Hola, soy Verbatim, su asistente de admisión médica.";
  setAv("speaking");try{$("elOn").checked?await speakEleven(t):await speakBrowser(t);}catch(e){diag("Error de voz: "+e.message);}setAv("");};
stopTalking();
if(window.speechSynthesis)speechSynthesis.getVoices();
