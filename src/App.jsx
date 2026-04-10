import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0a0a0a", surface: "#111111", border: "#1e1e1e",
  amber: "#e8920a", text: "#f0ece6", textMuted: "#9a928a", textDim: "#5a5450",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  sans: "'IBM Plex Sans', sans-serif",
};
const sectionColors = { SKIN: "#e8920a", PROFILE: "#4ecdc4", LIFESTYLE: "#a29bfe" };
const catColor = { BARRIER: "#4ecdc4", BRIGHTEN: "#e8920a", HYDRATE: "#74b9ff", REPAIR: "#a29bfe", PROTECT: "#55efc4" };
const urgencyStyle = {
  ESSENTIAL: { color: "#e8920a", bg: "rgba(232,146,10,0.08)", border: "rgba(232,146,10,0.35)" },
  RECOMMENDED: { color: "#4ecdc4", bg: "rgba(78,205,196,0.08)", border: "rgba(78,205,196,0.35)" },
  BOOST: { color: "#a29bfe", bg: "rgba(162,155,254,0.08)", border: "rgba(162,155,254,0.35)" },
};
const retailerColor = { Amazon: "#ff9900", YesStyle: "#e94b6e", "Soko Glam": "#7b68ee", iHerb: "#5aac44", "Beauty of Joseon": "#c9a96e", StyleKorean: "#00b0c8", Stylevana: "#ff6b9d", "Olive Young": "#4ecdc4" };

function getRetailerURL(retailer, name, brand) {
  const q = encodeURIComponent(`${name} ${brand}`);
  const n = encodeURIComponent(name);
  const map = {
    "Amazon": `https://www.amazon.com/s?k=${q}`,
    "YesStyle": `https://www.yesstyle.com/en/search.html#/keyword=${n}&hl=en`,
    "iHerb": `https://www.iherb.com/search?kw=${q}`,
    "Soko Glam": `https://sokoglam.com/search?q=${n}`,
    "StyleKorean": `https://www.stylekorean.com/search?search=${n}`,
    "Stylevana": `https://www.stylevana.com/en_US/search?q=${n}`,
    "Olive Young": `https://www.oliveyoung.com/search?query=${n}`,
  };
  return map[retailer] || `https://www.google.com/search?q=${encodeURIComponent(name + " " + brand + " buy")}`;
}

const STEP_ORDER = { "oil cleanser":1,"balm cleanser":1,"cleansing oil":1,"foam cleanser":2,"gel cleanser":2,"cleanser":2,"exfoliating toner":3,"essence toner":3,"toner":3,"serum ampoule":4,"ampoule":4,"lightweight serum":4,"serum":4,"essence":4,"sheet mask":5,"sleeping mask":5,"mask":5,"eye cream":6,"water-jelly cream":7,"gel cream":7,"moisturizer":7,"cream":7,"emulsion":7,"color-correcting cream":8,"sunscreen":9,"spf cream":9 };
function stepOrder(tex=""){ const t=tex.toLowerCase(); for(const[k,v]of Object.entries(STEP_ORDER))if(t.includes(k))return v; return 6; }
function stepLabel(tex=""){ const t=tex.toLowerCase();
  if(t.includes("cleanser")||t.includes("cleansing")||t.includes("foam"))return"STEP 1 · CLEANSE";
  if(t.includes("toner")||t.includes("exfoliat"))return"STEP 2 · TONE";
  if(t.includes("ampoule")||t.includes("serum")||t.includes("essence"))return"STEP 3 · TREAT";
  if(t.includes("mask"))return"STEP 4 · MASK";
  if(t.includes("eye"))return"STEP 4 · EYE CREAM";
  if(t.includes("cream")||t.includes("moistur")||t.includes("emulsion")||t.includes("jelly"))return"STEP 4 · MOISTURIZE";
  if(t.includes("spf")||t.includes("sun")||t.includes("color-correct"))return"STEP 5 · PROTECT";
  return"STEP · APPLY"; }

const DEMO_RECS = [
  {name:"Low pH Good Morning Cleanser",brand:"COSRX",tech:"pH-Balanced Surfactant System",ingredient:"Tea Tree Oil",texture:"gel cleanser",why:"Gentle pH-balanced formula clears congestion without stripping combination skin.",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$11–$14",retailer:"Amazon",rating:"4.7",ratingCount:"89k+",altName:"Real Fresh Foam Cleanser",altBrand:"Innisfree",altPrice:"$13–$16",altRetailer:"YesStyle",altRating:"4.5",dataReason:"Your oily/combination skin needs a low-pH cleanser that won't over-strip."},
  {name:"AHA BHA PHA 30 Days Miracle Toner",brand:"Some By Mi",tech:"Triple Acid Exfoliation",ingredient:"Salicylic Acid BHA",texture:"exfoliating toner",why:"Unclogs pores and fades dark spots without heavy peeling — PM use only.",category:"BRIGHTEN",urgency:"ESSENTIAL",timing:"PM",price:"$14–$18",retailer:"YesStyle",rating:"4.6",ratingCount:"42k+",altName:"BHA Blackhead Power Liquid",altBrand:"COSRX",altPrice:"$18–$22",altRetailer:"Amazon",altRating:"4.5",dataReason:"Pigmentation and dullness concerns + oily skin = BHA exfoliation is the highest-leverage step."},
  {name:"Snail Mucin 96% Power Repairing Essence",brand:"COSRX",tech:"Snail Secretion Filtrate",ingredient:"Snail Mucin 96%",texture:"essence serum",why:"Deeply repairs barrier and boosts hydration — ideal for stressed or reactive skin.",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$18–$25",retailer:"Amazon",rating:"4.8",ratingCount:"127k+",altName:"Galactomyces 95 Tone Balancing Essence",altBrand:"Some By Mi",altPrice:"$15–$19",altRetailer:"iHerb",altRating:"4.6",dataReason:"Sensitivity + stress habit selected. Snail mucin is the most clinically backed barrier repair ingredient."},
  {name:"Water Bomb Cherry Blossom Jelly Cream",brand:"Laneige",tech:"Moisture Wrap Technology",ingredient:"Cherry Blossom Extract",texture:"water-jelly cream",why:"Locks in hydration without heaviness — perfect for oily skin in warm climates.",category:"HYDRATE",urgency:"RECOMMENDED",timing:"AM + PM",price:"$22–$28",retailer:"Soko Glam",rating:"4.6",ratingCount:"31k+",altName:"Water Sleeping Mask",altBrand:"Laneige",altPrice:"$18–$24",altRetailer:"Amazon",altRating:"4.7",dataReason:"Hot/humid climate + combination skin means a gel-texture moisturizer over a heavy cream."},
  {name:"Cicapair Tiger Grass Color Correcting SPF 30",brand:"Dr. Jart+",tech:"Cica Complex + UV Shield",ingredient:"Centella Asiatica",texture:"color-correcting cream",why:"Protects and corrects uneven tone — essential for outdoor exposure and redness.",category:"PROTECT",urgency:"ESSENTIAL",timing:"AM",price:"$30–$38",retailer:"Soko Glam",rating:"4.5",ratingCount:"18k+",altName:"Airy Sun Stick SPF 50+",altBrand:"Beauty of Joseon",altPrice:"$12–$16",altRetailer:"Amazon",altRating:"4.8",dataReason:"Sun exposure + redness + uneven tone = SPF with Cica is the highest-urgency morning product."},
];

const questions = [
  {id:"texture",code:"SKN_01",section:"SKIN",question:"By midday, your skin feels —",sub:"Select all that apply.",options:[{label:"Tight + parched",value:"dry",tag:"DRY"},{label:"Slick all over",value:"oily",tag:"OILY"},{label:"Oily T-zone, dry cheeks",value:"combination",tag:"COMBO"},{label:"Calm + balanced",value:"normal",tag:"NORMAL"}]},
  {id:"sensitivity",code:"SKN_02",section:"SKIN",question:"How does skin respond to new products?",sub:"Select all that apply.",options:[{label:"Burns or turns red",value:"sensitive",tag:"HIGH"},{label:"Occasional breakouts",value:"reactive",tag:"MED"},{label:"Usually adapts fine",value:"tolerant",tag:"LOW"},{label:"Never reacts",value:"resilient",tag:"NONE"}]},
  {id:"concerns",code:"SKN_03",section:"SKIN",question:"Primary skin objectives —",sub:"Select all that apply.",options:[{label:"Dullness + uneven tone",value:"brightening",tag:"GLOW"},{label:"Fine lines + firmness",value:"antiaging",tag:"AGE"},{label:"Acne + congestion",value:"acne",tag:"CLEAR"},{label:"Dehydration + plumpness",value:"hydration",tag:"H2O"},{label:"Dark spots + hyperpigmentation",value:"pigmentation",tag:"PIGMENT"},{label:"Redness + irritation",value:"redness",tag:"CALM"}]},
  {id:"age",code:"PRF_01",section:"PROFILE",question:"Your age range —",sub:"Skin needs shift every decade.",options:[{label:"Under 25",value:"under25",tag:"18–24"},{label:"25 to 34",value:"25to34",tag:"25–34"},{label:"35 to 44",value:"35to44",tag:"35–44"},{label:"45 to 54",value:"45to54",tag:"45–54"},{label:"55 to 64",value:"55to64",tag:"55–64"},{label:"65 to 74",value:"65to74",tag:"65–74"},{label:"75 and over",value:"75plus",tag:"75+"}]},
  {id:"climate",code:"PRF_02",section:"PROFILE",question:"Where do you live? —",sub:"Climate shapes your barrier daily.",options:[{label:"Hot + humid",value:"tropical",tag:"TROPICAL"},{label:"Hot + dry",value:"arid",tag:"ARID"},{label:"Cold + dry",value:"cold",tag:"COLD"},{label:"Mild + temperate",value:"temperate",tag:"MILD"}]},
  {id:"sunlight",code:"LFE_01",section:"LIFESTYLE",question:"Daily sun exposure —",sub:"Average hours of direct sunlight.",options:[{label:"Indoor most of the day",value:"indoor",tag:"< 1HR"},{label:"Some outdoor time",value:"moderate",tag:"1–3HR"},{label:"Outdoors a lot",value:"high",tag:"3–6HR"},{label:"Full day in the sun",value:"extreme",tag:"6HR+"}]},
  {id:"habits",code:"LFE_02",section:"LIFESTYLE",question:"Which habits describe you? —",sub:"Select all that apply.",options:[{label:"Workouts + sweating daily",value:"active",tag:"ACTIVE"},{label:"Mostly desk / screen time",value:"sedentary",tag:"DESK"},{label:"Travel + irregular schedule",value:"travel",tag:"TRAVEL"},{label:"High stress + poor sleep",value:"stressed",tag:"STRESS"},{label:"Drinks alcohol regularly",value:"alcohol",tag:"ALCOHOL"},{label:"Smoker or ex-smoker",value:"smoker",tag:"SMOKE"}]},
  {id:"routine",code:"LFE_03",section:"LIFESTYLE",question:"Current Korean Beauty routine level —",sub:"Be honest.",options:[{label:"Total beginner",value:"beginner",tag:"LVL 0"},{label:"Cleanser + moisturizer",value:"minimal",tag:"LVL 1"},{label:"4–6 step routine",value:"intermediate",tag:"LVL 2"},{label:"Full 10-step devotee",value:"advanced",tag:"LVL 3"}]},
];

function LoadingLine({text,delay}){
  const[vis,setVis]=useState(false);const[done,setDone]=useState(false);
  useEffect(()=>{const t1=setTimeout(()=>setVis(true),delay);const t2=setTimeout(()=>setDone(true),delay+500);return()=>{clearTimeout(t1);clearTimeout(t2);};},[delay]);
  if(!vis)return null;
  return(<div style={{fontSize:"0.86rem",color:done?"#4ecdc4":C.textMuted,marginBottom:"0.75rem",letterSpacing:"0.04em",animation:"fadeUp 0.3s ease"}}>
    <span style={{color:done?"#4ecdc4":C.amber,marginRight:"0.8rem"}}>{done?"✓":"›"}</span>{text}</div>);
}

function RecCard({rec,index,stepNum}){
  const[open,setOpen]=useState(false);
  const urg=urgencyStyle[rec.urgency]||urgencyStyle.RECOMMENDED;
  const col=catColor[rec.category]||C.amber;
  const sl=stepLabel(rec.texture);
  const retCol=retailerColor[rec.retailer]||C.amber;
  return(
    <div style={{border:`1px solid ${C.border}`,borderRadius:"4px",background:"#0d0d0d",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${index*0.09}s both`}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:col,boxShadow:`0 0 10px ${col}60`}}/>
      <div style={{padding:"0.9rem 1.1rem 0.9rem 1.33rem"}}>
        {/* step + badges */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.64rem"}}>
          <span style={{fontSize:"0.69rem",color:col,letterSpacing:"0.2em",fontWeight:600}}>STEP {stepNum} · {sl.split("·")[1]?.trim()||sl}</span>
          <div style={{display:"flex",gap:"0.47rem"}}>
            {rec.timing&&<span style={{fontSize:"0.65rem",color:C.textDim,border:`1px solid ${C.border}`,borderRadius:"2px",padding:"0.1rem 0.55rem",letterSpacing:"0.1em"}}>{rec.timing}</span>}
            <span style={{fontSize:"0.65rem",letterSpacing:"0.12em",color:urg.color,border:`1px solid ${urg.border}`,borderRadius:"2px",padding:"0.1rem 0.55rem",background:urg.bg}}>{rec.urgency}</span>
          </div>
        </div>
        {/* first pick label */}
        <div style={{fontSize:"0.6rem",color:col,letterSpacing:"0.1em",marginBottom:"0.18rem"}}>FIRST PICK ──</div>
        {/* brand + name */}
        <div style={{fontSize:"0.69rem",color:C.textDim,letterSpacing:"0.2em",marginBottom:"0.35rem"}}>{rec.brand?.toUpperCase()}</div>
        <div style={{fontSize:"1.04rem",color:C.text,fontFamily:C.sans,fontWeight:400,lineHeight:1.25,marginBottom:"0.62rem"}}>{rec.name}</div>
        {/* why italic */}
        <p style={{fontSize:"0.85rem",color:"#908888",lineHeight:1.55,marginBottom:"0.72rem",fontStyle:"italic"}}>"{rec.why}"</p>
        {/* tech chips */}
        <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.8rem"}}>
          {[["TECH",rec.tech],["KEY",rec.ingredient],["FORM",rec.texture]].map(([l,v])=>(
            <span key={l} style={{fontSize:"0.67rem",color:C.textMuted,background:"#161616",border:`1px solid ${C.border}`,borderRadius:"2px",padding:"0.12rem 0.6rem"}}>
              <span style={{color:C.textDim}}>{l}: </span>{v}</span>))}
        </div>

        {/* price + rating + buy */}
        <div style={{display:"flex",alignItems:"stretch",gap:"0.5rem",marginBottom:"0.75rem"}}>
          <div style={{padding:"0.5rem 0.75rem",background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:"3px",flex:1}}>
            <div style={{fontSize:"0.6rem",color:C.textDim,letterSpacing:"0.08em",marginBottom:"0.2rem"}}>FIRST CHOICE</div>
            <div style={{fontSize:"1rem",color:C.text,fontFamily:C.sans,fontWeight:500,marginBottom:"0.25rem"}}>{rec.price}</div>
            {rec.rating&&<div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
              <span style={{color:"#f4c542",fontSize:"0.75rem"}}>{"★".repeat(Math.round(parseFloat(rec.rating||0)))}</span>
              <span style={{fontSize:"0.68rem",color:C.textMuted}}>{rec.rating} {rec.ratingCount&&<span style={{color:C.textDim}}>({rec.ratingCount})</span>}</span>
            </div>}
          </div>
          <a href={getRetailerURL(rec.retailer, rec.name, rec.brand)} target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0.5rem 0.75rem",background:`${retCol}14`,border:`1px solid ${retCol}50`,borderRadius:"3px",textDecoration:"none",flexShrink:0,width:"100px",maxWidth:"100px",overflow:"hidden",transition:"all 0.15s"}}>
            <span style={{fontSize:"0.75rem",color:retCol,fontWeight:600,letterSpacing:"0.03em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rec.retailer} →</span>
          </a>
        </div>

        {/* alt product — always render if any alt field exists */}
        {(rec.altName||rec.altBrand)&&(
          <div style={{marginBottom:"0.75rem",padding:"0.65rem 0.75rem",background:"#080808",border:`1px solid ${C.border}`,borderLeft:`2px solid ${col}40`,borderRadius:"3px"}}>
            <div style={{fontSize:"0.6rem",color:C.textDim,letterSpacing:"0.1em",marginBottom:"0.4rem"}}>SECOND PICK ──</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem"}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"0.6rem",color:C.textDim,letterSpacing:"0.12em",marginBottom:"0.1rem"}}>{(rec.altBrand||"").toUpperCase()}</div>
                <div style={{fontSize:"0.88rem",color:"#c8c0b8",fontFamily:C.sans,lineHeight:1.25,marginBottom:"0.28rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rec.altName}</div>
                <div style={{display:"flex",alignItems:"center",gap:"0.35rem",flexWrap:"wrap"}}>
                  {rec.altRating&&<span style={{color:"#f4c542",fontSize:"0.68rem"}}>{"★".repeat(Math.round(parseFloat(rec.altRating||0)))}</span>}
                  {rec.altRating&&<span style={{fontSize:"0.65rem",color:C.textMuted}}>{rec.altRating}</span>}
                  {rec.altPrice&&<span style={{fontSize:"0.68rem",color:C.textMuted}}>{rec.altPrice}</span>}
                </div>
              </div>
              {rec.altRetailer&&<a href={getRetailerURL(rec.altRetailer,rec.altName||"",rec.altBrand||"")} target="_blank" rel="noopener noreferrer"
                style={{fontSize:"0.65rem",color:retailerColor[rec.altRetailer]||C.textMuted,border:`1px solid ${(retailerColor[rec.altRetailer]||C.textMuted)+"40"}`,borderRadius:"2px",padding:"0.28rem 0.6rem",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>
                {rec.altRetailer} →
              </a>}
            </div>
          </div>
        )}

        {/* why recommended — expandable */}
        <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:"0.62rem",background:"transparent",border:"none",cursor:"pointer",padding:0,fontFamily:C.mono}}>
          <span style={{fontSize:"0.69rem",color:C.textDim,letterSpacing:"0.10em"}}>WHY THIS WAS RECOMMENDED</span>
          <span style={{fontSize:"0.75rem",color:C.textDim,transition:"transform 0.2s",display:"inline-block",transform:open?"rotate(90deg)":"rotate(0deg)"}}>›</span>
        </button>
        {open&&(
          <div style={{marginTop:"0.57rem",padding:"0.5rem 0.83rem",background:"#111",border:`1px solid ${C.border}`,borderRadius:"3px",animation:"fadeUp 0.2s ease"}}>
            <div style={{fontSize:"0.8rem",color:C.textMuted,lineHeight:1.65}}>{rec.dataReason}</div>
          </div>
        )}
      </div>
    </div>);
}

function buildText(recs,answers){
  const profile=[answers.texture?.selected?.join(", "),answers.age?.selected?.join(", "),answers.climate?.selected?.join(", "),answers.sunlight?.selected?.join(", ")].filter(Boolean).join(" · ");
  return["✦ MY MEEMO KOREAN BEAUTY PROTOCOL","Profile: "+profile,"",...recs.map((r,i)=>{
    const stars="★".repeat(Math.round(parseFloat(r.rating||0)));
    const alt=r.altName?`   ALT: ${r.altName} — ${r.altBrand} · ${r.altPrice} · ${r.altRetailer}\n`:"";
    return `${i+1}. ${r.name} — ${r.brand}\n   ${stepLabel(r.texture)} · ${r.timing||""}\n   Rating: ${stars} ${r.rating} (${r.ratingCount})\n   First choice: ${r.price} · Buy: ${getRetailerURL(r.retailer,r.name,r.brand)}\n${alt}   Key: ${r.ingredient} · ${r.tech}\n   "${r.why}"\n`;
  }),"Generated by Meemo Wellness AI"].join("\n");
}

export default function MeemoSkinQuiz(){
  const[step,setStep]=useState(0);
  const[answers,setAnswers]=useState({});
  const[fading,setFading]=useState(false);
  const[loading,setLoading]=useState(false);
  const[recs,setRecs]=useState(null);
  const[apiNote,setApiNote]=useState(null);
  const[dots,setDots]=useState(".");
  const[cursor,setCursor]=useState(true);
  const[scanY,setScanY]=useState(0);
  const[copied,setCopied]=useState(false);
  const[phone,setPhone]=useState("");
  const[smsSent,setSmsSent]=useState(false);
  const[profileName,setProfileName]=useState("");
  const[profileEmail,setProfileEmail]=useState("");
  const[profileSaved,setProfileSaved]=useState(false);
  const[selfieData,setSelfieData]=useState(null);
  const[selfiePreview,setSelfiePreview]=useState(null);
  const[selfieAnalysis,setSelfieAnalysis]=useState(null);
  const[skinScan,setSkinScan]=useState(null);
  const selfieRef=useRef(null);
  const shareRef=useRef(null);

  const totalSteps=questions.length;
  const currentQ=questions[step-1];
  const currentAns=currentQ?(answers[currentQ.id]||{selected:[],comment:""}):{selected:[],comment:""};
  const prevSection=step>1?questions[step-2]?.section:null;
  const isNewSection=step>=1&&step<=totalSteps&&currentQ.section!==prevSection;
  const sortedRecs=recs?[...recs].sort((a,b)=>{const diff=stepOrder(a.texture)-stepOrder(b.texture);return diff!==0?diff:0;}):[];

  useEffect(()=>{const iv=setInterval(()=>setCursor(c=>!c),530);return()=>clearInterval(iv);},[]);
  useEffect(()=>{if(!loading)return;const iv=setInterval(()=>setDots(d=>d.length>=3?".":d+"."),380);return()=>clearInterval(iv);},[loading]);
  useEffect(()=>{const iv=setInterval(()=>setScanY(y=>(y+0.4)%100),30);return()=>clearInterval(iv);},[]);

  const go=(cb)=>new Promise(r=>{setFading(true);setTimeout(()=>{cb();setFading(false);r();},280);});
  const toggleOption=(value)=>{const prev=answers[currentQ.id]||{selected:[],comment:""};const already=prev.selected.includes(value);setAnswers({...answers,[currentQ.id]:{...prev,selected:already?prev.selected.filter(v=>v!==value):[...prev.selected,value]}});};
  const setComment=(text)=>{const prev=answers[currentQ.id]||{selected:[],comment:""};setAnswers({...answers,[currentQ.id]:{...prev,comment:text}});};
  const canContinue=currentAns.selected.length>0||currentAns.comment.trim().length>0;

  const SELFIE_STEP=totalSteps+1;
  const LOADING_STEP=totalSteps+2;
  const RESULTS_STEP=totalSteps+3;

  const handleNext=async()=>{
    if(step===0){await go(()=>setStep(1));return;}
    if(step>=1&&step<=totalSteps){
      if(!canContinue)return;
      if(step<totalSteps){await go(()=>setStep(step+1));}
      else{await go(()=>setStep(SELFIE_STEP));}
      return;
    }
    if(step===SELFIE_STEP){
      await go(()=>{setStep(LOADING_STEP);setLoading(true);});
      await fetchRecs(answers,selfieData);
      setLoading(false);
      await go(()=>setStep(RESULTS_STEP));
    }
  };
  const handleBack=()=>{
    if(step===SELFIE_STEP){go(()=>setStep(totalSteps));return;}
    if(step<2)return;
    go(()=>setStep(step-1));
  };

  const fetchRecs=async(ans,imgData=null)=>{
    setApiNote(null);
    const fmt=(id)=>{const a=ans[id];if(!a)return"not specified";const p=[];if(a.selected?.length)p.push(a.selected.join(", "));if(a.comment?.trim())p.push(`[note: ${a.comment.trim()}]`);return p.join(" — ")||"not specified";};
    const prompt=`You are a Korean Beauty expert and dermatology-informed skincare advisor. Recommend exactly 5 Korean skincare products forming a complete routine.

SKIN PROFILE:
- Midday feel: ${fmt("texture")}
- Sensitivity: ${fmt("sensitivity")}
- Concerns: ${fmt("concerns")}

PERSONAL PROFILE:
- Age: ${fmt("age")}
- Climate: ${fmt("climate")}

LIFESTYLE:
- Sun exposure: ${fmt("sunlight")}
- Habits: ${fmt("habits")}
- Routine level: ${fmt("routine")}

RULES:
1. Return products IN ORDER of application: cleanser first, then toner, then serum/ampoule, then moisturizer, then SPF last. The JSON array order must match the application sequence.
2. Each from a different brand
3. Prioritize high sun exposure → UV protection first
4. Age 45+ → retinol, peptides, collagen actives
5. Stressed/poor sleep → cortisol + barrier repair focus
6. Tropical/humid → lightweight gel textures only
7. Include REALISTIC price ranges in USD and the cheapest reliable retailer (Amazon, YesStyle, iHerb, Soko Glam, StyleKorean, Stylevana)
8. dataReason must explain EXACTLY which quiz answers drove this specific product choice

Return ONLY a raw JSON array of 5 objects, no markdown, no backticks, no explanation:
[{
  "name": "product name",
  "brand": "Korean brand",
  "tech": "key technology",
  "ingredient": "hero ingredient",
  "texture": "exact texture type",
  "why": "personalized reason max 15 words",
  "category": "BARRIER|BRIGHTEN|HYDRATE|REPAIR|PROTECT",
  "urgency": "ESSENTIAL|RECOMMENDED|BOOST",
  "timing": "AM|PM|AM + PM",
  "price": "$XX–$XX",
  "retailer": "best value retailer name",
  "retailerNote": "one sentence tip on where to get best price",
  "rating": "overall rating out of 5 e.g. 4.7",
  "ratingCount": "number of reviews e.g. 12k+",
  "altName": "second best product name for same step",
  "altBrand": "second best brand",
  "altPrice": "$XX–$XX",
  "altRetailer": "best value retailer for alt product",
  "altRating": "rating out of 5",
  "dataReason": "2-3 sentences explaining exactly which quiz inputs drove this recommendation"
}]`;
    const userContent=imgData
      ?[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData}},{type:"text",text:prompt+"\n\nIMPORTANT: A selfie has been provided. Do two things:\n1. Analyze the visible skin carefully — look for redness, oiliness, dryness, dark spots, enlarged pores, uneven texture, fine lines, or any visible concerns.\n2. Before the JSON product array, output a skin scan summary in this EXACT format (no markdown):\nSKIN_SCAN_START\n{\"redness\":\"low|moderate|high — describe location\",\"oiliness\":\"low|moderate|high — describe\",\"pores\":\"small|medium|large — describe\",\"darkSpots\":\"none|mild|moderate|significant — describe\",\"texture\":\"smooth|slightly uneven|rough — describe\",\"hydration\":\"well hydrated|slightly dehydrated|dehydrated\",\"overall\":\"one sentence summary of what you see\"}\nSKIN_SCAN_END\nThen output the product JSON array. Factor all visual observations into product choices."}]
      :[{type:"text",text:prompt}];
    try{
      const res=await fetch("/api/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,messages:[{role:"user",content:userContent}]})});
      const data=await res.json();
      if(data.type==="error"||data.error){setApiNote("Showing curated recommendations");setRecs(DEMO_RECS);return;}
      const raw=data.content?.map(i=>i.text||"").join("")||"";
      // Extract skin scan if present
      const scanStart=raw.indexOf("SKIN_SCAN_START");
      const scanEnd=raw.indexOf("SKIN_SCAN_END");
      if(scanStart!==-1&&scanEnd!==-1){
        try{
          const scanJson=raw.slice(scanStart+15,scanEnd).trim();
          setSkinScan(JSON.parse(scanJson));
        }catch(e){}
      }
      const s=raw.indexOf("["),e=raw.lastIndexOf("]");
      if(s===-1||e===-1)throw new Error("no json");
      const parsed=JSON.parse(raw.slice(s,e+1));
      if(!Array.isArray(parsed)||!parsed.length)throw new Error("empty");
      setRecs(parsed);
    }catch(err){setApiNote("Showing curated recommendations");setRecs(DEMO_RECS);}
  };

  const handleSelfie=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const base64=ev.target.result.split(",")[1];
      setSelfieData(base64);
      setSelfiePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy=()=>{
    const text=buildText(sortedRecs,answers);
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}).catch(()=>fallbackCopy());}
      else{fallbackCopy();}
    }catch(e){fallbackCopy();}
  };
  const fallbackCopy=()=>{if(shareRef.current){shareRef.current.select();document.execCommand("copy");setCopied(true);setTimeout(()=>setCopied(false),2500);}};
  const handleEmail=()=>{const text=buildText(sortedRecs,answers);window.location.href=`mailto:?subject=${encodeURIComponent("My Meemo Korean Beauty Skin Protocol")}&body=${encodeURIComponent(text)}`;};
  const restart=()=>{setStep(0);setAnswers({});setRecs(null);setApiNote(null);setCopied(false);setPhone("");setSmsSent(false);setProfileSaved(false);setProfileName("");setProfileEmail("");setSelfieData(null);setSelfiePreview(null);setSelfieAnalysis(null);setSkinScan(null);};

  // Fire Meta + TikTok pixel on results
  useEffect(()=>{
    if(step===RESULTS_STEP&&!loading&&recs){
      try{
        // Meta Pixel — replace PIXEL_ID_HERE with your actual ID
        if(window.fbq){window.fbq("track","CompleteRegistration",{content_name:"Meemo Skin Analysis",skin_type:answers.texture?.selected?.join(","),concern:answers.concerns?.selected?.join(",")});}
        // TikTok Pixel — replace TIKTOK_PIXEL_ID in index.html
        if(window.ttq){window.ttq.track("CompletePayment",{content_name:"Meemo Skin Analysis"});}
      }catch(e){}
    }
  },[step,loading,recs]);

  const handleSMS=()=>{
    if(!phone.trim())return;
    const text=buildText(sortedRecs,answers);
    const body=encodeURIComponent(text);
    // Opens native SMS app with pre-filled message
    window.location.href=`sms:${phone.trim().replace(/\D/g,"")}?body=${body}`;
    setSmsSent(true);
  };

  const handleSaveProfile=()=>{
    if(!profileName.trim()&&!profileEmail.trim())return;
    const profile={name:profileName,email:profileEmail,skinType:answers.texture?.selected,concerns:answers.concerns?.selected,age:answers.age?.selected,climate:answers.climate?.selected,habits:answers.habits?.selected,savedAt:new Date().toISOString(),regime:sortedRecs.map(r=>({name:r.name,brand:r.brand,step:stepLabel(r.texture),timing:r.timing}))};
    try{localStorage.setItem("meemo_profile",JSON.stringify(profile));}catch(e){}
    setProfileSaved(true);
  };

  const primaryBtn={background:C.amber,color:"#000",border:"none",borderRadius:"3px",padding:"0.8rem 1.33rem",fontSize:"0.9rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,fontWeight:500};
  const ghostBtn={background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.8rem 1.2rem",fontSize:"0.88rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,flexShrink:0};

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.1rem",fontFamily:C.mono,position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",backgroundImage:`linear-gradient(rgba(232,146,10,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(232,146,10,0.022) 1px, transparent 1px)`,backgroundSize:"44px 44px"}}/>
      <div style={{position:"fixed",left:0,right:0,height:"2px",top:`${scanY}%`,background:"linear-gradient(90deg, transparent, rgba(232,146,10,0.055), transparent)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",top:"25%",left:"50%",transform:"translateX(-50%)",width:"700px",height:"350px",borderRadius:"50%",background:"radial-gradient(ellipse, rgba(232,146,10,0.035) 0%, transparent 65%)",pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:"580px",opacity:fading?0:1,transform:fading?"translateY(10px)":"translateY(0)",transition:"all 0.28s cubic-bezier(0.16,1,0.3,1)"}}>

        {/* topbar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.8rem",paddingBottom:"0.88rem",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.72rem"}}>
            <div style={{width:"9px",height:"9px",borderRadius:"50%",background:C.amber,boxShadow:`0 0 8px ${C.amber}`}}/>
            <span style={{fontSize:"0.8rem",color:C.amber,letterSpacing:"0.14em"}}>MEEMO</span>
            <span style={{fontSize:"0.8rem",color:C.textDim,letterSpacing:"0.1em"}}>SKIN_ANALYSIS</span>
          </div>
          {step>0&&step<=totalSteps&&<span style={{fontSize:"0.78rem",color:C.textMuted,letterSpacing:"0.10em"}}>{String(step).padStart(2,"0")} / {String(totalSteps).padStart(2,"0")}</span>}
        </div>

        {/* progress */}
        {step>0&&step<=totalSteps&&(
          <div style={{marginBottom:"1.58rem"}}>
            <div style={{display:"flex",gap:"4px",marginBottom:"0.72rem"}}>
              {questions.map((q,i)=><div key={i} style={{flex:1,height:"2px",background:i<step?(sectionColors[q.section]||C.amber):C.border,boxShadow:i<step?`0 0 6px ${sectionColors[q.section]||C.amber}55`:"none",transition:"all 0.4s ease",borderRadius:"1px"}}/>)}
            </div>
            <div style={{display:"flex",gap:"1.3rem"}}>
              {["SKIN","PROFILE","LIFESTYLE"].map(sec=><span key={sec} style={{fontSize:"0.72rem",letterSpacing:"0.10em",color:currentQ?.section===sec?sectionColors[sec]:C.textDim,transition:"color 0.3s"}}>{sec}</span>)}
            </div>
          </div>
        )}

        {/* card */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:"4px",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.7)"}}>
          <div style={{background:"#0d0d0d",borderBottom:`1px solid ${C.border}`,padding:"0.6rem 1.3rem",display:"flex",alignItems:"center",gap:"0.67rem"}}>
            {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:"8px",height:"8px",borderRadius:"50%",background:c,opacity:0.65}}/>)}
            <span style={{fontSize:"0.78rem",color:C.textDim,letterSpacing:"0.10em",marginLeft:"0.8rem"}}>
              {step===0?"skin_diagnostics.meemo":step<=totalSteps?`${currentQ?.section?.toLowerCase()}_${currentQ?.code?.toLowerCase()}.run`:step===SELFIE_STEP?"skin_scan.meemo":loading?"processing_results.meemo":"skin_report.output"}
            </span>
          </div>

          <div style={{padding:"2rem 2.25rem 2.5rem"}}>

            {/* INTRO */}
            {step===0&&(
              <div>
                <div style={{fontSize:"0.78rem",color:C.amber,letterSpacing:"0.14em",marginBottom:"1.1rem"}}>MEEMO / SKIN_DIAGNOSTICS v2.5</div>
                <div style={{fontSize:"0.88rem",color:C.textDim,marginBottom:"0.9rem"}}>
                  <span style={{color:C.textMuted}}>$ init </span><span style={{color:C.text}}>skin_analysis --full-profile --pricing</span>
                  <span style={{color:C.amber,opacity:cursor?1:0}}>_</span>
                </div>
                <h1 style={{fontFamily:C.sans,fontSize:"1.9rem",fontWeight:300,color:C.text,lineHeight:1.2,marginBottom:"1.1rem"}}>
                  Know Your Skin.<br/><span style={{color:C.amber}}>Find Your Formula.</span>
                </h1>
                <p style={{fontSize:"0.88rem",color:C.textMuted,lineHeight:1.85,marginBottom:"1.58rem"}}>
                  8-question deep profile. AI recommends 5 products with pricing, where to buy for less, and exactly why each was chosen for you.
                </p>
                <div style={{display:"flex",gap:"0.62rem",marginBottom:"1.58rem"}}>
                  {[["SKIN","3 q's","#e8920a"],["PROFILE","2 q's","#4ecdc4"],["LIFESTYLE","3 q's","#a29bfe"]].map(([sec,n,col])=>(
                    <div key={sec} style={{flex:1,border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.7rem 0.95rem",background:"#0d0d0d",borderTop:`2px solid ${col}`}}>
                      <div style={{fontSize:"0.72rem",color:col,letterSpacing:"0.10em",marginBottom:"0.47rem"}}>{sec}</div>
                      <div style={{fontSize:"0.8rem",color:C.textMuted}}>{n}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.62rem",marginBottom:"1.58rem"}}>
                  {[["PRICE RANGES","Realistic USD estimates"],["BEST RETAILER","Amazon, YesStyle, iHerb"],["WHY EACH PRODUCT","Tied to your exact inputs"],["ORDERED REGIME","Correct application sequence"]].map(([t,d])=>(
                    <div key={t} style={{border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.65rem 0.95rem",background:"#0d0d0d"}}>
                      <div style={{fontSize:"0.72rem",color:C.amber,letterSpacing:"0.10em",marginBottom:"0.44rem"}}>{t}</div>
                      <div style={{fontSize:"0.8rem",color:C.textMuted}}>{d}</div>
                    </div>
                  ))}
                </div>
                <button onClick={handleNext} style={{...primaryBtn,width:"100%"}}>begin full analysis →</button>
              </div>
            )}

            {/* QUESTIONS */}
            {step>=1&&step<=totalSteps&&(
              <div>
                {isNewSection&&(
                  <div style={{display:"flex",alignItems:"center",gap:"0.8rem",marginBottom:"1.3rem",paddingBottom:"0.88rem",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:"3px",height:"14px",background:sectionColors[currentQ.section],borderRadius:"2px",boxShadow:`0 0 6px ${sectionColors[currentQ.section]}`}}/>
                    <span style={{fontSize:"0.72rem",color:sectionColors[currentQ.section],letterSpacing:"0.14em"}}>{currentQ.section} PROFILE</span>
                  </div>
                )}
                <div style={{marginBottom:"1.33rem"}}>
                  <div style={{fontSize:"0.74rem",color:sectionColors[currentQ.section]||C.amber,letterSpacing:"0.2em",marginBottom:"0.72rem"}}>{currentQ.code} ──</div>
                  <h2 style={{fontFamily:C.sans,fontSize:"1.2rem",fontWeight:400,color:C.text,lineHeight:1.35,marginBottom:"0.47rem"}}>{currentQ.question}</h2>
                  <p style={{fontSize:"0.8rem",color:C.textMuted}}>{currentQ.sub}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1.1rem"}}>
                  {currentQ.options.map(opt=>{
                    const on=currentAns.selected.includes(opt.value);
                    const sec=sectionColors[currentQ.section]||C.amber;
                    return(
                      <button key={opt.value} onClick={()=>toggleOption(opt.value)} style={{display:"flex",alignItems:"center",gap:"0.97rem",padding:"0.7rem 1.02rem",background:on?`${sec}10`:"transparent",border:`1px solid ${on?sec:C.border}`,borderRadius:"3px",cursor:"pointer",textAlign:"left",transition:"all 0.14s",fontFamily:C.mono}}>
                        <div style={{width:"13px",height:"13px",borderRadius:"2px",flexShrink:0,border:`1px solid ${on?sec:C.border}`,background:on?sec:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.14s"}}>
                          {on&&<span style={{fontSize:"0.72rem",color:"#000",fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontSize:"0.72rem",letterSpacing:"0.10em",color:on?sec:C.textDim,minWidth:"46px",transition:"color 0.14s"}}>{opt.tag}</span>
                        <span style={{fontSize:"0.94rem",color:on?C.text:"#7a7068",transition:"color 0.14s"}}>{opt.label}</span>
                      </button>);
                  })}
                </div>
                <div style={{marginBottom:"1.58rem"}}>
                  <div style={{fontSize:"0.71rem",color:C.textDim,letterSpacing:"0.10em",marginBottom:"0.6rem"}}>
                    <span style={{color:sectionColors[currentQ.section]||C.amber}}>+</span> ADD A NOTE <span style={{color:C.textDim}}>— optional</span>
                  </div>
                  <textarea value={currentAns.comment} onChange={e=>setComment(e.target.value)} placeholder="Allergies, products tried, doctor notes, specific concerns…" rows={2}
                    style={{width:"100%",background:"#0d0d0d",border:`1px solid ${currentAns.comment?(sectionColors[currentQ.section]||C.amber)+"55":C.border}`,borderRadius:"3px",padding:"0.65rem 0.97rem",color:C.text,fontFamily:C.mono,fontSize:"0.84rem",lineHeight:1.6,resize:"vertical",outline:"none",transition:"border-color 0.15s"}}
                    onFocus={e=>e.target.style.borderColor=(sectionColors[currentQ.section]||C.amber)+"80"}
                    onBlur={e=>e.target.style.borderColor=currentAns.comment?(sectionColors[currentQ.section]||C.amber)+"55":C.border}/>
                  {currentAns.comment&&<div style={{fontSize:"0.71rem",color:sectionColors[currentQ.section]||C.amber,marginTop:"0.44rem",letterSpacing:"0.1em"}}>✓ note saved</div>}
                </div>
                <div style={{display:"flex",gap:"0.72rem"}}>
                  {step>1&&<button onClick={handleBack} style={ghostBtn}>← back</button>}
                  <button onClick={handleNext} disabled={!canContinue} style={{...primaryBtn,flex:1,opacity:canContinue?1:0.3,cursor:canContinue?"pointer":"not-allowed"}}>
                    {step===totalSteps?"run full analysis →":"continue →"}
                  </button>
                </div>
                {!canContinue&&<div style={{fontSize:"0.71rem",color:C.textDim,textAlign:"center",marginTop:"0.75rem",letterSpacing:"0.08em"}}>select an option or add a note to continue</div>}
              </div>
            )}

            {/* SELFIE STEP */}
            {step===SELFIE_STEP&&(
              <div>
                <div style={{marginBottom:"1.25rem"}}>
                  <div style={{fontSize:"0.58rem",color:"#4ecdc4",letterSpacing:"0.2em",marginBottom:"0.5rem"}}>SKIN_SCAN ──</div>
                  <h2 style={{fontFamily:C.sans,fontSize:"1.35rem",fontWeight:400,color:C.text,lineHeight:1.3,marginBottom:"0.35rem"}}>Optional: Scan your skin</h2>
                  <p style={{fontSize:"0.78rem",color:C.textMuted,lineHeight:1.75}}>Upload a selfie for AI-powered visual skin analysis. We analyze visible redness, oiliness, texture, pores, and tone — then layer it on top of your quiz answers for more accurate recommendations.</p>
                </div>

                {/* upload area */}
                <div onClick={()=>selfieRef.current?.click()} style={{border:`2px dashed ${selfiePreview?"#4ecdc4":C.border}`,borderRadius:"6px",padding:"1.5rem",textAlign:"center",cursor:"pointer",marginBottom:"1rem",background:selfiePreview?"rgba(78,205,196,0.05)":"transparent",transition:"all 0.2s"}}>
                  {selfiePreview?(
                    <div>
                      <img src={selfiePreview} alt="selfie" style={{width:"120px",height:"120px",objectFit:"cover",borderRadius:"50%",border:"2px solid #4ecdc4",marginBottom:"0.75rem"}}/>
                      <div style={{fontSize:"0.72rem",color:"#4ecdc4",letterSpacing:"0.1em"}}>✓ Photo ready — AI will analyze your skin</div>
                      <div style={{fontSize:"0.62rem",color:C.textMuted,marginTop:"0.3rem"}}>Tap to change</div>
                    </div>
                  ):(
                    <div>
                      <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>📷</div>
                      <div style={{fontSize:"0.78rem",color:C.textMuted,marginBottom:"0.25rem"}}>Tap to upload a selfie</div>
                      <div style={{fontSize:"0.62rem",color:C.textDim}}>JPG or PNG · Front-facing, good lighting</div>
                    </div>
                  )}
                </div>
                <input ref={selfieRef} type="file" accept="image/*" capture="user" onChange={handleSelfie} style={{display:"none"}}/>

                {/* privacy note */}
                <div style={{padding:"0.6rem 0.75rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",marginBottom:"1.25rem"}}>
                  <div style={{fontSize:"0.6rem",color:C.textDim,lineHeight:1.65}}>
                    🔒 Your photo is sent directly to Claude AI for analysis and is never stored. Analysis happens in real time and is deleted immediately after.
                  </div>
                </div>

                <div style={{display:"flex",gap:"0.5rem",justifyContent:"space-between"}}>
                  <button onClick={handleBack} style={{...ghostBtn}}>← back</button>
                  <button onClick={handleNext} style={{...primaryBtn,flex:1}}>
                    {selfiePreview?"analyze my skin →":"skip — use quiz answers only →"}
                  </button>
                </div>
              </div>
            )}

            {/* LOADING */}
            {step===LOADING_STEP&&loading&&(
              <div style={{padding:"1rem 0"}}>
                <div style={{fontSize:"0.78rem",color:C.amber,letterSpacing:"0.14em",marginBottom:"1.58rem"}}>PROCESSING{dots}</div>
                {["Mapping skin barrier + age profile","Calibrating for climate conditions","Analyzing UV exposure damage risk","Cross-referencing lifestyle factors","Reading your personal notes","Building step-by-step routine order","Finding best prices + retailers","Generating personalized protocol"].map((line,i)=>(
                  <LoadingLine key={line} text={line} delay={i*480}/>
                ))}
              </div>
            )}

            {/* RESULTS */}
            {step===RESULTS_STEP&&!loading&&recs&&(
              <div>
                {/* header */}
                <div style={{marginBottom:"1.2rem"}}>
                  <div style={{fontSize:"0.76rem",color:C.amber,letterSpacing:"0.14em",marginBottom:"0.57rem"}}>ANALYSIS COMPLETE ──</div>
                  <h2 style={{fontFamily:C.sans,fontSize:"1.2rem",fontWeight:400,color:C.text,marginBottom:"0.72rem"}}>Your Korean Beauty Regime</h2>
                  {apiNote&&<div style={{fontSize:"0.72rem",color:C.textMuted,background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.35rem 0.8rem",marginBottom:"0.72rem",letterSpacing:"0.05em"}}>ℹ {apiNote}</div>}

                  {/* ── SKIN SCAN CARD ── */}
                  {skinScan&&selfiePreview&&(
                    <div style={{border:`1px solid #4ecdc440`,borderRadius:"4px",background:"#0d0d0d",padding:"1rem 1.15rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"#4ecdc4",boxShadow:"0 0 8px #4ecdc460"}}/>
                      <div style={{paddingLeft:"0.75rem"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.85rem",marginBottom:"0.75rem"}}>
                          <img src={selfiePreview} alt="scan" style={{width:"48px",height:"48px",borderRadius:"50%",objectFit:"cover",border:"1.5px solid #4ecdc4",flexShrink:0}}/>
                          <div>
                            <div style={{fontSize:"0.62rem",color:"#4ecdc4",letterSpacing:"0.18em",marginBottom:"0.15rem"}}>SKIN SCAN ANALYSIS ──</div>
                            <div style={{fontSize:"0.78rem",color:C.textMuted,lineHeight:1.5}}>{skinScan.overall}</div>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem"}}>
                          {[
                            ["Redness",skinScan.redness],
                            ["Oiliness",skinScan.oiliness],
                            ["Pores",skinScan.pores],
                            ["Dark spots",skinScan.darkSpots],
                            ["Texture",skinScan.texture],
                            ["Hydration",skinScan.hydration],
                          ].filter(([,v])=>v).map(([label,val])=>(
                            <div key={label} style={{padding:"0.4rem 0.55rem",background:"#111",border:`1px solid ${C.border}`,borderRadius:"3px"}}>
                              <div style={{fontSize:"0.52rem",color:C.textDim,letterSpacing:"0.12em",marginBottom:"0.1rem"}}>{label.toUpperCase()}</div>
                              <div style={{fontSize:"0.7rem",color:C.textMuted,lineHeight:1.4}}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{fontSize:"0.58rem",color:C.textDim,marginTop:"0.6rem",letterSpacing:"0.06em"}}>
                          ✓ Visual observations factored into your regime below
                        </div>
                      </div>
                    </div>
                  )}

                  {/* what drove these recs */}
                  <div style={{padding:"0.65rem 0.9rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",marginBottom:"0.8rem"}}>
                    <div style={{fontSize:"0.69rem",color:C.amber,letterSpacing:"0.10em",marginBottom:"0.62rem"}}>BASED ON YOUR INPUTS ──</div>
                    <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
                      {[
                        ["SKIN TYPE",answers.texture?.selected,"SKIN"],
                        ["SENSITIVITY",answers.sensitivity?.selected,"SKIN"],
                        ["CONCERN",answers.concerns?.selected,"SKIN"],
                        ["AGE",answers.age?.selected,"PROFILE"],
                        ["CLIMATE",answers.climate?.selected,"PROFILE"],
                        ["SUN",answers.sunlight?.selected,"PROFILE"],
                        ["HABITS",answers.habits?.selected,"LIFESTYLE"],
                        ["ROUTINE",answers.routine?.selected,"LIFESTYLE"],
                      ].map(([k,v,sec])=>v?.length?<span key={k} style={{fontSize:"0.66rem",letterSpacing:"0.1em",color:sectionColors[sec],border:`1px solid ${sectionColors[sec]}25`,borderRadius:"2px",padding:"0.12rem 0.57rem",background:`${sectionColors[sec]}07`,marginBottom:"0.42rem"}}>{k}: {v.join("+").toUpperCase()}</span>:null)}
                    </div>
                    {Object.entries(answers).some(([,v])=>v.comment?.trim())&&(
                      <div style={{marginTop:"0.62rem",paddingTop:"0.62rem",borderTop:`1px solid ${C.border}`}}>
                        {Object.entries(answers).filter(([,v])=>v.comment?.trim()).map(([id,v])=>(
                          <div key={id} style={{fontSize:"0.75rem",color:C.textMuted,lineHeight:1.5}}><span style={{color:C.textDim}}>#{id} note: </span>{v.comment}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{fontSize:"0.72rem",color:C.textDim,letterSpacing:"0.08em",lineHeight:1.6}}>
                    Each product below shows its price range, best retailer, and a <span style={{color:C.amber}}>›</span> button explaining exactly which of your inputs triggered it.
                  </div>
                </div>

                {/* regime cards */}
                <div style={{display:"flex",flexDirection:"column",gap:"0.8rem",marginBottom:"1.33rem"}}>
                  {sortedRecs.map((rec,i)=><RecCard key={i} rec={rec} index={i} stepNum={i+1}/>)}
                </div>

                {/* estimated total */}
                <div style={{padding:"0.6rem 0.9rem",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.33rem"}}>
                  <span style={{fontSize:"0.72rem",color:C.textMuted,letterSpacing:"0.10em"}}>ESTIMATED FULL ROUTINE COST</span>
                  <span style={{fontSize:"1.02rem",color:C.text,fontFamily:C.sans}}>
                    ${sortedRecs.reduce((sum,r)=>{const m=r.price?.match(/\$(\d+)/);return sum+(m?parseInt(m[1]):20);},0)}–${sortedRecs.reduce((sum,r)=>{const m=r.price?.match(/\$\d+–\$(\d+)/);return sum+(m?parseInt(m[1]):30);},0)}
                  </span>
                </div>

                {/* ── SAVE TO MEEMO PROFILE ── */}
                <div style={{border:`1px solid ${C.border}`,borderRadius:"4px",background:"#0d0d0d",padding:"1.1rem 1.33rem",marginBottom:"0.83rem",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"#a29bfe",boxShadow:"0 0 10px #a29bfe60"}}/>
                  <div style={{paddingLeft:"0.9rem"}}>
                    <div style={{fontSize:"0.72rem",color:"#a29bfe",letterSpacing:"0.2em",marginBottom:"0.57rem"}}>SAVE TO MEEMO PROFILE ──</div>
                    <p style={{fontSize:"0.8rem",color:C.textMuted,lineHeight:1.6,marginBottom:"0.9rem"}}>Save your regime to your Meemo profile. We will remember your skin type, routine, and concerns for next time.</p>
                    {!profileSaved?(
                      <div style={{display:"flex",flexDirection:"column",gap:"0.62rem"}}>
                        <input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Your name" style={{width:"100%",background:"#111",border:`1px solid ${profileName?"#a29bfe55":C.border}`,borderRadius:"3px",padding:"0.6rem 0.9rem",color:C.text,fontFamily:C.mono,fontSize:"0.88rem",outline:"none"}}/>
                        <input value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} placeholder="Email address" type="email" style={{width:"100%",background:"#111",border:`1px solid ${profileEmail?"#a29bfe55":C.border}`,borderRadius:"3px",padding:"0.6rem 0.9rem",color:C.text,fontFamily:C.mono,fontSize:"0.88rem",outline:"none"}}/>
                        <button onClick={handleSaveProfile} disabled={!profileName.trim()&&!profileEmail.trim()} style={{background:"#a29bfe",color:"#000",border:"none",borderRadius:"3px",padding:"0.88rem",fontSize:"0.86rem",letterSpacing:"0.08em",cursor:"pointer",fontFamily:C.mono,fontWeight:500,opacity:(!profileName.trim()&&!profileEmail.trim())?0.35:1}}>
                          save my skin profile →
                        </button>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",gap:"0.72rem",padding:"0.6rem 0.9rem",background:"rgba(162,155,254,0.08)",border:"1px solid rgba(162,155,254,0.3)",borderRadius:"3px"}}>
                        <span style={{color:"#a29bfe"}}>✓</span>
                        <span style={{fontSize:"0.83rem",color:"#a29bfe"}}>Profile saved — welcome to Meemo, {profileName||profileEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── SMS DELIVERY ── */}
                <div style={{border:`1px solid ${C.border}`,borderRadius:"4px",background:"#0d0d0d",padding:"1.1rem 1.33rem",marginBottom:"0.83rem",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"#4ecdc4",boxShadow:"0 0 10px #4ecdc460"}}/>
                  <div style={{paddingLeft:"0.9rem"}}>
                    <div style={{fontSize:"0.72rem",color:"#4ecdc4",letterSpacing:"0.2em",marginBottom:"0.57rem"}}>TEXT MY REGIME ──</div>
                    <p style={{fontSize:"0.8rem",color:C.textMuted,lineHeight:1.6,marginBottom:"0.9rem"}}>Send your full Korean Beauty routine to your phone. Opens your SMS app with the protocol pre-filled.</p>
                    {!smsSent?(
                      <div style={{display:"flex",gap:"0.62rem"}}>
                        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 000 0000" type="tel" style={{flex:1,background:"#111",border:`1px solid ${phone?"#4ecdc455":C.border}`,borderRadius:"3px",padding:"0.6rem 0.9rem",color:C.text,fontFamily:C.mono,fontSize:"0.88rem",outline:"none"}}/>
                        <button onClick={handleSMS} disabled={!phone.trim()} style={{background:"#4ecdc4",color:"#000",border:"none",borderRadius:"3px",padding:"0.6rem 1.1rem",fontSize:"0.86rem",letterSpacing:"0.06em",cursor:"pointer",fontFamily:C.mono,fontWeight:500,flexShrink:0,opacity:!phone.trim()?0.35:1}}>
                          send →
                        </button>
                      </div>
                    ):(
                      <div style={{display:"flex",alignItems:"center",gap:"0.72rem",padding:"0.6rem 0.9rem",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.3)",borderRadius:"3px"}}>
                        <span style={{color:"#4ecdc4"}}>✓</span>
                        <span style={{fontSize:"0.83rem",color:"#4ecdc4"}}>Opening SMS app — paste your regime and hit send</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── COPY + EMAIL ── */}
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"1.33rem",marginBottom:"1.33rem"}}>
                  <div style={{fontSize:"0.72rem",color:C.amber,letterSpacing:"0.2em",marginBottom:"0.9rem"}}>COPY + SHARE ──</div>
                  <div style={{display:"flex",gap:"0.67rem",marginBottom:"0.9rem"}}>
                    <button onClick={handleCopy} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.52rem",padding:"0.85rem 0.72rem",background:copied?"rgba(78,205,196,0.08)":"rgba(232,146,10,0.07)",border:`1px solid ${copied?"#4ecdc4":C.amber}`,borderRadius:"3px",cursor:"pointer",fontFamily:C.mono,transition:"all 0.2s"}}>
                      <span style={{fontSize:"1.2rem",lineHeight:1}}>{copied?"✓":"⎘"}</span>
                      <span style={{fontSize:"0.72rem",color:copied?"#4ecdc4":C.amber,letterSpacing:"0.1em"}}>{copied?"COPIED!":"COPY"}</span>
                    </button>
                    <a href={`mailto:?subject=${encodeURIComponent("My Meemo Korean Beauty Skin Protocol")}&body=${encodeURIComponent(buildText(sortedRecs,answers))}`}
                      style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.52rem",padding:"0.85rem 0.72rem",background:"transparent",border:`1px solid ${C.border}`,borderRadius:"3px",cursor:"pointer",fontFamily:C.mono,transition:"all 0.15s",textDecoration:"none"}}>
                      <span style={{fontSize:"1.2rem",lineHeight:1,color:C.textMuted}}>✉</span>
                      <span style={{fontSize:"0.72rem",color:C.textMuted,letterSpacing:"0.1em"}}>EMAIL</span>
                    </a>
                  </div>
                  <div style={{fontSize:"0.7rem",color:C.textDim,letterSpacing:"0.10em",marginBottom:"0.57rem"}}>TEXT PREVIEW — tap to select all</div>
                  <textarea ref={shareRef} readOnly value={buildText(sortedRecs,answers)} rows={5} onClick={e=>e.target.select()}
                    style={{width:"100%",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:"3px",padding:"0.65rem 0.97rem",color:C.textMuted,fontFamily:C.mono,fontSize:"0.73rem",lineHeight:1.75,resize:"none",outline:"none",cursor:"text"}}/>
                </div>

                <button onClick={restart} style={{...ghostBtn,width:"100%",textAlign:"center"}}>↺ restart analysis</button>
              </div>
            )}
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:"1.3rem",fontSize:"0.72rem",color:C.textDim,letterSpacing:"0.14em"}}>
          <span>MEEMO WELLNESS AI</span><span>KOREAN BEAUTY SKIN INTELLIGENCE v2.5</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        textarea::placeholder{color:#2a2520;}
        textarea{color-scheme:dark;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
    </div>
  );
}
