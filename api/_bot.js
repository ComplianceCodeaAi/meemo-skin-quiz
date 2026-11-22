// Meemo SMS bot engine: an ongoing text conversation, not a one-off consult.
// Flow: welcome + disclaimer -> the 11-question consult by text -> optional
// selfie (MMS) -> catalog-bound routine -> open-ended follow-up chat with
// memory of the user's profile, routine, and conversation, plus scheduled
// check-ins (see api/checkin.js).
//
// State is kept per phone number in Upstash Redis / Vercel KV when configured
// (KV_REST_API_URL + KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL + _TOKEN).
// Without those env vars it falls back to in-memory state, which resets when
// the function cold-starts — fine for a demo, not for real users.

const CATALOG = [
  {id:"cosrx-lowph-cleanser",step:"Cleanser",name:"Low pH Good Morning Gel Cleanser",brand:"COSRX",tech:"Low-pH Cleansing System",ingredient:"Tea Tree Leaf Oil",texture:"gel cleanser",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$11–$15",retailer:"Olive Young",url:"https://us.oliveyoung.com/products/UA10823673",rating:"4.8",ratingCount:"",fit:"All skin types, esp. oily/combination and acne-prone; gentle low-pH daily cleanse."},
  {id:"innisfree-green-tea-foam",step:"Cleanser",name:"Green Tea Amino Hydrating Cleansing Foam",brand:"Innisfree",tech:"Green Tea Amino Acid Complex",ingredient:"Green Tea Extract",texture:"foam cleanser",category:"HYDRATE",urgency:"ESSENTIAL",timing:"AM + PM",price:"$10–$16",retailer:"YesStyle",url:"https://www.yesstyle.com/en/innisfree-green-tea-amino-hydrating-cleansing-foam-150g/info.html/pid.1120887593",rating:"4.5",ratingCount:"179",fit:"All skin types; hydrating, non-stripping foam, also a good second-step cleanser."},
  {id:"pyunkang-pore-foam",step:"Cleanser",name:"Low pH Pore Deep Cleansing Foam",brand:"Pyunkang Yul",tech:"Low-pH Pore Cleansing",ingredient:"Centella + Tea Tree",texture:"foam cleanser",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$10–$18",retailer:"iHerb",url:"https://www.iherb.com/pr/pyunkang-yul-low-ph-pore-deep-cleansing-foam-3-4-fl-oz-100-ml/98371",rating:"4.7",ratingCount:"4,098",fit:"Oily/combination and sensitive skin; deep pore and sebum cleansing, low pH."},
  {id:"anua-cleansing-oil",step:"Cleanser",name:"Heartleaf Pore Control Cleansing Oil",brand:"Anua",tech:"Heartleaf Pore Control",ingredient:"Heartleaf Extract",texture:"oil cleanser",category:"REPAIR",urgency:"RECOMMENDED",timing:"PM",price:"$18–$22",retailer:"Ulta Beauty",url:"https://www.ulta.com/p/heartleaf-pore-control-cleansing-oil-pimprod2048919",rating:"4.4",ratingCount:"1,021",fit:"Oily/combination, breakout-prone skin; first-step double cleanse for makeup, sebum and blackheads. Contains fragrance — avoid for very sensitive skin."},
  {id:"roundlab-dokdo-cleanser",step:"Cleanser",name:"1025 Dokdo Cleanser",brand:"Round Lab",tech:"Deep Sea Water Minerals",ingredient:"Ceramide + Panthenol",texture:"foam cleanser",category:"HYDRATE",urgency:"ESSENTIAL",timing:"AM + PM",price:"$12–$15",retailer:"Olive Young",url:"https://us.oliveyoung.com/products/UA10245858",rating:"4.8",ratingCount:"",fit:"All skin types including sensitive; low-pH dense foam with ceramide and panthenol."},
  {id:"somebymi-miracle-toner",step:"Tone",name:"AHA BHA PHA 30 Days Miracle Toner",brand:"Some By Mi",tech:"AHA·BHA·PHA Triple Acid",ingredient:"Tea Tree + Salicylic Acid",texture:"exfoliating toner",category:"BRIGHTEN",urgency:"ESSENTIAL",timing:"PM",price:"$18–$24",retailer:"Ulta Beauty",url:"https://www.ulta.com/p/aha-bha-pha-30-day-miracle-exfoliating-toner-pimprod2051778?sku=2641258",rating:"4.6",ratingCount:"16",fit:"Acne-prone, oily/combination skin; gentle triple-acid exfoliation for pores and texture. Not for highly sensitive skin."},
  {id:"cosrx-bha-liquid",step:"Tone",name:"BHA Blackhead Power Liquid",brand:"COSRX",tech:"Betaine Salicylate 4%",ingredient:"BHA (Betaine Salicylate)",texture:"exfoliating toner",category:"BRIGHTEN",urgency:"RECOMMENDED",timing:"PM",price:"$19–$25",retailer:"Ulta Beauty",url:"https://www.ulta.com/p/bha-blackhead-power-liquid-treatment-xlsImpprod15641056?sku=2504914",rating:"4.1",ratingCount:"246",fit:"Oily/combination, congested skin; leave-on BHA for blackheads, excess sebum and clogged pores. Not for highly sensitive skin."},
  {id:"anua-heartleaf-toner",step:"Tone",name:"Heartleaf 77 Soothing Toner",brand:"Anua",tech:"Heartleaf 77% Soothing",ingredient:"Houttuynia Cordata Extract",texture:"soothing toner",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$19–$23",retailer:"Ulta Beauty",url:"https://www.ulta.com/p/heartleaf-77-soothing-toner-pimprod2048929?sku=2634190",rating:"4.4",ratingCount:"163",fit:"Sensitive, irritated or dry skin; fragrance-free daily soothing and hydrating toner."},
  {id:"pyunkang-essence-toner",step:"Tone",name:"Essence Toner",brand:"Pyunkang Yul",tech:"Astragalus Root Essence",ingredient:"Astragalus Root Extract",texture:"essence toner",category:"HYDRATE",urgency:"ESSENTIAL",timing:"AM + PM",price:"$13–$17",retailer:"iHerb",url:"https://www.iherb.com/pr/pyunkang-yul-essence-toner-3-4-fl-oz-100-ml/80190",rating:"4.6",ratingCount:"6,999",fit:"Dry and sensitive skin; viscous, fragrance-free deep hydration and barrier support."},
  {id:"roundlab-birch-toner",step:"Tone",name:"Birch Juice Moisturizing Toner",brand:"Round Lab",tech:"Birch Juice Hydration",ingredient:"Birch Sap + Hyaluronic Acid",texture:"essence toner",category:"HYDRATE",urgency:"RECOMMENDED",timing:"AM + PM",price:"$20–$27",retailer:"Olive Young",url:"https://us.oliveyoung.com/products/UA71395723",rating:"",ratingCount:"",fit:"Dry/dehydrated skin; ampoule-type hydrating toner for lasting moisture."},
  {id:"cosrx-snail-essence",step:"Essence",name:"Advanced Snail 96 Mucin Power Essence",brand:"COSRX",tech:"Snail Secretion Filtrate 96%",ingredient:"Snail Mucin",texture:"essence serum",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$23–$25",retailer:"COSRX",url:"https://www.cosrx.com/products/advanced-snail-96-mucin-power-essence",rating:"4.8",ratingCount:"3,250",fit:"All skin types, esp. sensitive and post-acne; barrier repair, dullness and dark spots, intense hydration."},
  {id:"cosrx-galactomyces",step:"Essence",name:"Galactomyces 95 Tone Balancing Essence",brand:"COSRX",tech:"Galactomyces Ferment 95%",ingredient:"Galactomyces Ferment Filtrate",texture:"essence serum",category:"BRIGHTEN",urgency:"RECOMMENDED",timing:"AM + PM",price:"$20–$24",retailer:"COSRX",url:"https://www.cosrx.com/products/galactomyces-95-tone-balancing-essence",rating:"4.7",ratingCount:"104",fit:"Dull, rough skin with uneven tone; nourishes for a more radiant, clear look."},
  {id:"boj-glow-serum",step:"Essence",name:"Glow Deep Serum: Rice + Alpha-Arbutin",brand:"Beauty of Joseon",tech:"Rice + Alpha-Arbutin Brightening",ingredient:"Alpha-Arbutin 2%",texture:"essence serum",category:"BRIGHTEN",urgency:"ESSENTIAL",timing:"AM + PM",price:"$15–$17",retailer:"Beauty of Joseon",url:"https://beautyofjoseon.com/products/glow-deep-serum-rice-alpha-arbutin",rating:"4.8",ratingCount:"1,721",fit:"Dullness, dark spots and hyperpigmentation; brightening boost for most skin types."},
  {id:"skin1004-centella-ampoule",step:"Essence",name:"Madagascar Centella Ampoule",brand:"SKIN1004",tech:"Madagascar Centella Extract",ingredient:"Centella Asiatica Extract",texture:"essence serum",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$15–$19",retailer:"Olive Young",url:"https://us.oliveyoung.com/products/UA43792133",rating:"4.8",ratingCount:"",fit:"Sensitive, irritation-prone skin; soothing, fast-absorbing hydration."},
  {id:"anua-heartleaf-ampoule",step:"Essence",name:"Heartleaf 80 Moisture Soothing Ampoule",brand:"Anua",tech:"Heartleaf 80% Soothing",ingredient:"Houttuynia Cordata Extract",texture:"essence serum",category:"BARRIER",urgency:"RECOMMENDED",timing:"AM + PM",price:"$21–$25",retailer:"YesStyle",url:"https://www.yesstyle.com/en/anua-heartleaf-80-moisture-soothing-ampoule-30ml/info.html/pid.1136793651",rating:"4.7",ratingCount:"47",fit:"Sensitive skin prone to external irritation; soothing, nourishing moisture."},
  {id:"isntree-ha-serum",step:"Essence",name:"Ultra-Low Molecular Hyaluronic Acid Serum",brand:"Isntree",tech:"Ultra-Low Molecular Hyaluronic Acid",ingredient:"Multi-Weight Hyaluronic Acid",texture:"essence serum",category:"HYDRATE",urgency:"RECOMMENDED",timing:"AM + PM",price:"$16–$20",retailer:"iHerb",url:"https://www.iherb.com/pr/isntree-ultra-low-molecular-hyaluronic-acid-serum-1-69-fl-oz-50-ml/140866",rating:"4.7",ratingCount:"369",fit:"Dehydrated skin; deep, quick-absorbing hydration, non-irritating and vegan."},
  {id:"laneige-water-bank-cream",step:"Moisturize",name:"Water Bank Blue Hyaluronic Cream Moisturizer",brand:"Laneige",tech:"Blue Hyaluronic Acid Fermentation",ingredient:"Blue Hyaluronic Acid",texture:"gel cream",category:"HYDRATE",urgency:"ESSENTIAL",timing:"AM + PM",price:"$36–$40",retailer:"Laneige",url:"https://us.laneige.com/products/water-bank-blue-hyaluronic-cream-moisturizer",rating:"",ratingCount:"",fit:"Normal to dry skin; deep hydration and moisture-barrier support."},
  {id:"laneige-sleeping-mask",step:"Moisturize",name:"Water Sleeping Mask",brand:"Laneige",tech:"Overnight Probiotic Complex",ingredient:"Squalane + Probiotic Complex",texture:"gel cream",category:"HYDRATE",urgency:"RECOMMENDED",timing:"PM",price:"$30–$33",retailer:"Laneige",url:"https://us.laneige.com/products/water-sleeping-mask",rating:"4.7",ratingCount:"2,502",fit:"Normal to dry skin; overnight hydration and brightening for dull, tired skin, a few nights a week."},
  {id:"illiyoon-ceramide-cream",step:"Moisturize",name:"Ceramide Ato Concentrate Cream",brand:"Illiyoon",tech:"Ceramide Skin Complex",ingredient:"Ceramide NP",texture:"barrier cream",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$28–$33",retailer:"Olive Young",url:"https://us.oliveyoung.com/products/UA39684183",rating:"4.9",ratingCount:"",fit:"Sensitive and extra-dry skin; ceramide barrier repair with long-lasting hydration."},
  {id:"pyunkang-barrier-cream",step:"Moisturize",name:"Calming Moisture Barrier Cream",brand:"Pyunkang Yul",tech:"Calming Barrier Complex",ingredient:"Centella + Ceramide",texture:"barrier cream",category:"BARRIER",urgency:"ESSENTIAL",timing:"AM + PM",price:"$9–$16",retailer:"Stylevana",url:"https://www.stylevana.com/en_US/pyunkang-yul-calming-moisture-barrier-cream-50ml7472.html",rating:"",ratingCount:"",fit:"Sensitive, irritated skin of all types including oily/combination; calming barrier support."},
  {id:"roundlab-birch-cream",step:"Moisturize",name:"Birch Juice Moisturizing Cream",brand:"Round Lab",tech:"Birch Juice Moisture Care",ingredient:"Birch Sap + Hyaluronic Acid",texture:"gel cream",category:"HYDRATE",urgency:"RECOMMENDED",timing:"AM + PM",price:"$19–$23",retailer:"Ulta Beauty",url:"https://www.ulta.com/p/birch-juice-moisturizing-cream-pimprod2049659",rating:"4.8",ratingCount:"171",fit:"Oily and dehydrated skin; long-lasting hydration with oil/sebum care, fragrance-free."},
  {id:"boj-relief-sun",step:"Protect",name:"Relief Sun: Rice + Probiotics SPF50+ PA++++",brand:"Beauty of Joseon",tech:"Rice + Probiotic UV Care",ingredient:"Rice Extract + Grain Ferment",texture:"sunscreen",category:"PROTECT",urgency:"ESSENTIAL",timing:"AM",price:"$14–$18",retailer:"YesStyle",url:"https://www.yesstyle.com/en/beauty-of-joseon-relief-sun-50ml/info.html/pid.1107744417",rating:"4.7",ratingCount:"28,715",fit:"All skin types, esp. dry; lightweight hydrating daily SPF with brightening rice and ferments."},
  {id:"boj-sun-stick",step:"Protect",name:"Matte Sun Stick: Mugwort + Camelia SPF50+ PA++++",brand:"Beauty of Joseon",tech:"Mugwort Sebum-Control Stick",ingredient:"Mugwort + Camelia",texture:"sun stick",category:"PROTECT",urgency:"RECOMMENDED",timing:"AM",price:"$14–$18",retailer:"Stylevana",url:"https://www.stylevana.com/en_US/beauty-of-joseon-matte-sun-stick-mugwort-camelia-spf50-pa-18g21910.html",rating:"",ratingCount:"",fit:"Oily/combination skin; matte, non-greasy hands-free SPF reapplication through the day."},
  {id:"drjart-cicapair-spf",step:"Protect",name:"Cicapair Soothing Color Correcting Treatment SPF 30",brand:"Dr. Jart+",tech:"Cica Color-Correcting SPF",ingredient:"Centella Asiatica (Cica)",texture:"color-correcting cream",category:"PROTECT",urgency:"ESSENTIAL",timing:"AM",price:"$50–$56",retailer:"Sephora",url:"https://www.kohls.com/product/prd-7704170/dr-jart-cicapair-soothing-color-correcting-treatment-spf-30-with-centella-asiatica-extracts.jsp?skuid=75224854",rating:"4.3",ratingCount:"858",fit:"Sensitive, redness- and rosacea-prone skin; green-to-beige cream neutralizes redness while protecting."},
  {id:"skin1004-sun-serum",step:"Protect",name:"Madagascar Centella Hyalu-Cica Water-Fit Sun Serum SPF50+",brand:"SKIN1004",tech:"Hyalu-Cica Water-Fit",ingredient:"Centella + Hyaluronic Acid",texture:"sunscreen",category:"PROTECT",urgency:"ESSENTIAL",timing:"AM",price:"$24–$28",retailer:"Olive Young",url:"https://us.oliveyoung.com/products/UA36240979",rating:"",ratingCount:"",fit:"Dry/normal and sensitive skin; light, watery serum-like hydrating sunscreen, non-greasy."},
  {id:"roundlab-birch-sun",step:"Protect",name:"Birch Juice Moisturizing Sun Cream SPF50+ PA++++",brand:"Round Lab",tech:"Birch Juice Moisturizing UV",ingredient:"Birch Sap",texture:"sunscreen",category:"PROTECT",urgency:"RECOMMENDED",timing:"AM",price:"$16–$20",retailer:"Stylevana",url:"https://www.stylevana.com/en_US/round-lab-birch-juice-moisturizing-sun-cream-spf50-pa-50ml28716.html",rating:"",ratingCount:"",fit:"All skin types, especially dryness concerns; moisturizing daily sun cream."},
  {id:"ryo-rootgen-serum",step:"Scalp",name:"Root:Gen Scalp Serum for Thinning Hair",brand:"Ryo",tech:"Root:Gen Ginseng Tech",ingredient:"Ginseng + Peptides",texture:"scalp serum",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$18–$26",retailer:"Amazon",url:"https://www.amazon.com/dp/B0GMHP5TXD",rating:"",ratingCount:"",fit:"Thinning hair and hair loss due to breakage; cooling scalp care for fuller-looking hair."},
  {id:"drgroot-tonic",step:"Scalp",name:"Multi-Perfection Hair Loss Care Tonic",brand:"Dr. Groot",tech:"Multi-Perfection Hair Loss Care",ingredient:"Scalp Nutrition Complex",texture:"scalp tonic",category:"REPAIR",urgency:"ESSENTIAL",timing:"AM + PM",price:"$26–$30",retailer:"YesStyle",url:"https://www.yesstyle.com/en/dr-groot-multi-perfection-hair-loss-care-tonic-hoofdhuidverzorging/info.html/pid.1129963324",rating:"4.4",ratingCount:"60",fit:"Hair-loss concerns; hydrating, soothing scalp tonic to revitalize the scalp."},
  {id:"somebymi-scalp-tonic",step:"Scalp",name:"Cica Peptide Anti Hair Loss Derma Scalp Tonic",brand:"Some By Mi",tech:"Cica Peptide Complex",ingredient:"Cica + 11 Peptides + Biotin",texture:"scalp tonic",category:"REPAIR",urgency:"RECOMMENDED",timing:"AM + PM",price:"$17–$22",retailer:"Stylevana",url:"https://www.stylevana.com/en_US/some-by-mi-cica-peptide-anti-hair-loss-derma-scalp-tonic-150ml60869.html",rating:"",ratingCount:"",fit:"Stressed or sensitive scalp with hair-loss symptoms; soothing spray tonic."},
  {id:"drgroot-thickening-serum",step:"Scalp",name:"Hair Thickening Serum for Hair Loss",brand:"Dr. Groot",tech:"Roll-On Scalp Serum",ingredient:"Exfoliating Scalp Complex",texture:"scalp serum",category:"REPAIR",urgency:"RECOMMENDED",timing:"PM",price:"$21–$26",retailer:"Amazon",url:"https://www.amazon.com/dp/B0DK22L979",rating:"",ratingCount:"",fit:"Thinning hair; roll-on scalp serum that exfoliates and reduces scalp oil and redness."},
];

const questions = [
  {id:"texture",code:"SKN_01",section:"SKIN",question:"By midday, your skin feels —",sub:"Select all that apply.",options:[{label:"Tight + parched",value:"dry",tag:"DRY"},{label:"Slick all over",value:"oily",tag:"OILY"},{label:"Oily T-zone, dry cheeks",value:"combination",tag:"COMBO"},{label:"Calm + balanced",value:"normal",tag:"NORMAL"}]},
  {id:"sensitivity",code:"SKN_02",section:"SKIN",question:"How does skin respond to new products?",sub:"Select all that apply.",options:[{label:"Burns or turns red",value:"sensitive",tag:"HIGH"},{label:"Occasional breakouts",value:"reactive",tag:"MED"},{label:"Usually adapts fine",value:"tolerant",tag:"LOW"},{label:"Never reacts",value:"resilient",tag:"NONE"}]},
  {id:"concerns",code:"SKN_03",section:"SKIN",question:"Primary skin objectives —",sub:"Select all that apply.",options:[{label:"Dullness + uneven tone",value:"brightening",tag:"GLOW"},{label:"Fine lines + firmness",value:"antiaging",tag:"AGE"},{label:"Acne + congestion",value:"acne",tag:"CLEAR"},{label:"Dehydration + plumpness",value:"hydration",tag:"H2O"},{label:"Dark spots + hyperpigmentation",value:"pigmentation",tag:"PIGMENT"},{label:"Redness + irritation",value:"redness",tag:"CALM"}]},
  {id:"scalp_concern",code:"SCP_01",section:"SCALP",question:"Any scalp concerns? —",sub:"Select all that apply.",options:[{label:"Dry + flaky scalp",value:"dry_scalp",tag:"DRY"},{label:"Oily scalp + buildup",value:"oily_scalp",tag:"OILY"},{label:"Sensitive or itchy scalp",value:"sensitive_scalp",tag:"SENSITIVE"},{label:"Thinning or hair loss",value:"thinning",tag:"THINNING"},{label:"Dandruff",value:"dandruff",tag:"DANDRUFF"},{label:"No scalp concerns",value:"none",tag:"NONE"}]},
  {id:"scalp_habit",code:"SCP_02",section:"SCALP",question:"How often do you wash your hair? —",sub:"Select one.",options:[{label:"Daily",value:"daily",tag:"DAILY"},{label:"Every 2–3 days",value:"every2to3",tag:"2–3 DAYS"},{label:"Twice a week",value:"twice_week",tag:"2X WEEK"},{label:"Once a week or less",value:"weekly",tag:"WEEKLY"}]},
  {id:"scalp",code:"SKN_04",section:"SKIN",question:"How does your scalp feel? —",sub:"Select all that apply.",options:[{label:"Dry + flaky",value:"dry_scalp",tag:"DRY"},{label:"Oily + itchy",value:"oily_scalp",tag:"OILY"},{label:"Sensitive + irritated",value:"sensitive_scalp",tag:"SENSITIVE"},{label:"Hair thinning or loss",value:"thinning",tag:"THINNING"},{label:"Balanced + no concerns",value:"balanced_scalp",tag:"BALANCED"}]},
  {id:"age",code:"PRF_01",section:"PROFILE",question:"Your age range —",sub:"Skin needs shift every decade.",options:[{label:"Under 25",value:"under25",tag:"18–24"},{label:"25 to 34",value:"25to34",tag:"25–34"},{label:"35 to 44",value:"35to44",tag:"35–44"},{label:"45 to 54",value:"45to54",tag:"45–54"},{label:"55 to 64",value:"55to64",tag:"55–64"},{label:"65 to 74",value:"65to74",tag:"65–74"},{label:"75 and over",value:"75plus",tag:"75+"}]},
  {id:"climate",code:"PRF_02",section:"PROFILE",question:"Where do you live? —",sub:"Climate shapes your barrier daily.",options:[{label:"Hot + humid",value:"tropical",tag:"TROPICAL"},{label:"Hot + dry",value:"arid",tag:"ARID"},{label:"Cold + dry",value:"cold",tag:"COLD"},{label:"Mild + temperate",value:"temperate",tag:"MILD"}]},
  {id:"sunlight",code:"LFE_01",section:"LIFESTYLE",question:"Daily sun exposure —",sub:"Average hours of direct sunlight.",options:[{label:"Indoor most of the day",value:"indoor",tag:"< 1HR"},{label:"Some outdoor time",value:"moderate",tag:"1–3HR"},{label:"Outdoors a lot",value:"high",tag:"3–6HR"},{label:"Full day in the sun",value:"extreme",tag:"6HR+"}]},
  {id:"habits",code:"LFE_02",section:"LIFESTYLE",question:"Which habits describe you? —",sub:"Select all that apply.",options:[{label:"Workouts + sweating daily",value:"active",tag:"ACTIVE"},{label:"Mostly desk / screen time",value:"sedentary",tag:"DESK"},{label:"Travel + irregular schedule",value:"travel",tag:"TRAVEL"},{label:"High stress + poor sleep",value:"stressed",tag:"STRESS"},{label:"Drinks alcohol regularly",value:"alcohol",tag:"ALCOHOL"},{label:"Smoker or ex-smoker",value:"smoker",tag:"SMOKE"}]},
  {id:"routine",code:"LFE_03",section:"LIFESTYLE",question:"Current Korean Beauty routine level —",sub:"Be honest.",options:[{label:"Total beginner",value:"beginner",tag:"LVL 0"},{label:"Cleanser + moisturizer",value:"minimal",tag:"LVL 1"},{label:"4–6 step routine",value:"intermediate",tag:"LVL 2"},{label:"Full 10-step devotee",value:"advanced",tag:"LVL 3"}]},
];

const DISCLAIMER = "Quick note: I offer cosmetic guidance only, not medical advice. For persistent skin problems, a dermatologist is the right call.";

const store = (() => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const mem = new Map();
  if (!url || !token) return {
    async get(k) { return mem.get(k) || null; },
    async set(k, v) { mem.set(k, v); },
    async keys() { return [...mem.keys()]; },
  };
  const call = async (cmd) => {
    const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(cmd) });
    const d = await r.json();
    return d.result;
  };
  return {
    async get(k) { const v = await call(["GET", "meemo:bot:" + k]); return v ? JSON.parse(v) : null; },
    async set(k, v) { await call(["SET", "meemo:bot:" + k, JSON.stringify(v)]); },
    async keys() { const ks = await call(["KEYS", "meemo:bot:*"]); return (ks || []).map((k) => k.replace("meemo:bot:", "")); },
  };
})();

export const internals = {
  async callClaude({ system, messages, maxTokens = 1200 }) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: maxTokens, thinking: { type: "disabled" }, ...(system ? { system } : {}), messages }),
    });
    const d = await r.json();
    if (d.type === "error" || d.error) throw new Error("claude error");
    return (d.content || []).filter((i) => i.type === "text").map((i) => i.text || "").join("");
  },
};

const fmtAns = (ans, id) => {
  const a = ans[id];
  if (!a || !a.selected || !a.selected.length) return "not specified";
  return a.selected.join(", ");
};

function catalogText() {
  return ["Cleanser", "Tone", "Essence", "Moisturize", "Protect", "Scalp"].map((st) =>
    "# STEP: " + st + "\n" + CATALOG.filter((p) => p.step === st).map((p) => `- id "${p.id}": ${p.brand} ${p.name} (${p.price}) — ${p.fit}`).join("\n")
  ).join("\n");
}

function recommendPrompt(ans) {
  return `You are a Korean dermatology-informed skincare expert. You recommend products ONLY from the verified catalog below — you never name a product that is not in the catalog.

VERIFIED PRODUCT CATALOG (the only products you may choose; prices and links are fixed and handled by the app):
${catalogText()}

SKIN PROFILE:
- Midday feel: ${fmtAns(ans, "texture")}
- Sensitivity: ${fmtAns(ans, "sensitivity")}
- Concerns: ${fmtAns(ans, "concerns")}
- Scalp: ${fmtAns(ans, "scalp")}

PERSONAL PROFILE:
- Age: ${fmtAns(ans, "age")}
- Climate: ${fmtAns(ans, "climate")}

SCALP:
- Scalp concerns: ${fmtAns(ans, "scalp_concern")}
- Wash frequency: ${fmtAns(ans, "scalp_habit")}

LIFESTYLE:
- Sun exposure: ${fmtAns(ans, "sunlight")}
- Habits: ${fmtAns(ans, "habits")}
- Routine level: ${fmtAns(ans, "routine")}

RULES:
1. Return exactly 5 items, one per step, IN ORDER: Cleanser, Tone, Essence, Moisturize, Protect.
2. SCALP RULE: If scalp concerns are present (not "none" and not "balanced" — dry, oily, sensitive, thinning, or dandruff), ADD a 6th item with step "Scalp". Age 45+ with thinning = prioritize a hair-loss scalp pick.
3. For each item, choose productId (first pick) and altProductId (second pick) from that step's catalog list. The two ids must be different, and each from a different brand where the catalog allows.
4. Match each catalog product's "fit" notes to the profile: e.g. never pick an exfoliating acid toner for highly sensitive skin; tropical/humid climates favor lightweight gel textures; high sun exposure favors the strongest SPF picks; dry/cold profiles favor barrier and cream textures.
5. NEVER contradict the user's answers in why, altWhy, or dataReason. If an answer says "not specified", the user skipped that question — do not invent a value for it.
6. Do NOT output product names, prices, ratings, retailers, or URLs — only the catalog ids and your reasoning text.

Return ONLY a raw JSON array, no markdown, no backticks, no explanation:
[{
  "step": "Cleanser|Tone|Essence|Moisturize|Protect|Scalp",
  "productId": "catalog id of the first pick for this step",
  "why": "personalized reason for the first pick, max 15 words",
  "altProductId": "catalog id of the second pick for this step",
  "altWhy": "one short sentence on why this second pick suits this person",
  "dataReason": "2-3 sentences explaining exactly which quiz inputs drove this recommendation"
}]`;
}

function mapPicks(parsed, ans) {
  const byId = {}; CATALOG.forEach((p) => { byId[p.id] = p; });
  const stepDefault = {}; CATALOG.forEach((p) => { if (!stepDefault[p.step]) stepDefault[p.step] = p; });
  const toRec = (f, alt, item) => ({ name: f.name, brand: f.brand, step: f.step, texture: f.texture, why: (item && item.why) || f.fit, timing: f.timing, price: f.price, retailer: f.retailer, url: f.url, rating: f.rating, altName: alt ? alt.name : "", altBrand: alt ? alt.brand : "", altPrice: alt ? alt.price : "", altUrl: alt ? alt.url : "", altWhy: (item && item.altWhy) || "", dataReason: (item && item.dataReason) || "" });
  const mapped = []; const seen = new Set();
  for (const item of parsed) {
    const first = byId[item.productId];
    const step = item.step || (first ? first.step : null);
    if (!step || seen.has(step) || !stepDefault[step]) continue;
    const f = (first && first.step === step) ? first : stepDefault[step];
    let alt = byId[item.altProductId];
    if (!alt || alt.step !== step || alt.id === f.id) alt = CATALOG.find((p) => p.step === step && p.id !== f.id) || null;
    seen.add(step); mapped.push(toRec(f, alt, item));
  }
  ["Cleanser", "Tone", "Essence", "Moisturize", "Protect"].forEach((st) => { if (!seen.has(st)) { const f = stepDefault[st]; mapped.push(toRec(f, CATALOG.find((p) => p.step === st && p.id !== f.id) || null, null)); } });
  const scalpVals = [...((ans.scalp_concern || {}).selected || []), ...((ans.scalp || {}).selected || [])];
  if (scalpVals.some((v) => !["none", "balanced_scalp"].includes(v)) && !seen.has("Scalp")) {
    const f = stepDefault["Scalp"]; mapped.push(toRec(f, CATALOG.find((p) => p.step === "Scalp" && p.id !== f.id) || null, null));
  }
  const order = { Cleanser: 1, Tone: 2, Essence: 3, Scalp: 4, Moisturize: 5, Protect: 6 };
  return mapped.sort((a, b) => order[a.step] - order[b.step]);
}

async function generateRoutine(state, imgData) {
  const prompt = recommendPrompt(state.answers);
  const content = imgData
    ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imgData } }, { type: "text", text: prompt + "\n\nA selfie is attached. Factor visible skin observations (redness, oiliness, dryness, dark spots, pores, texture) into your choices." }]
    : [{ type: "text", text: prompt }];
  const raw = await internals.callClaude({ messages: [{ role: "user", content }], maxTokens: 3000 });
  const s = raw.indexOf("["), e = raw.lastIndexOf("]");
  if (s === -1 || e === -1) throw new Error("no json");
  return mapPicks(JSON.parse(raw.slice(s, e + 1)), state.answers);
}

const STEP_LABEL = { Cleanser: "CLEANSE", Tone: "TONE", Essence: "TREAT", Scalp: "SCALP", Moisturize: "MOISTURIZE", Protect: "PROTECT" };

function formatRoutine(recs) {
  const msgs = ["Your Meemo routine is ready ✨ Here's your lineup:"];
  recs.forEach((r, i) => {
    let m = `${i + 1}. ${STEP_LABEL[r.step] || r.step} (${r.timing})\n${r.brand} ${r.name} — ${r.price}\n${r.why}\nBuy: ${r.url}`;
    if (r.altName) m += `\nAlt: ${r.altBrand} ${r.altName} (${r.altPrice}) ${r.altUrl}`;
    msgs.push(m);
  });
  const lo = recs.reduce((t, r) => t + (parseInt((r.price.match(/\$(\d+)/) || [])[1]) || 0), 0);
  const hi = recs.reduce((t, r) => { const m = r.price.match(/\$\d+–\$(\d+)/); return t + (m ? parseInt(m[1]) : parseInt((r.price.match(/\$(\d+)/) || [])[1]) || 0); }, 0);
  msgs.push(`Estimated total: $${lo}–$${hi}.\n\nI'm here whenever — ask me how to use something, tell me how your skin feels, or say SWAP plus a step number for alternatives. I'll check in in a few days to see how it's going.`);
  return msgs;
}

function profileSummary(state) {
  const a = state.answers || {};
  const parts = [];
  for (const id of ["texture", "sensitivity", "concerns", "age", "climate", "sunlight", "scalp_concern", "scalp_habit", "routine"]) {
    const v = fmtAns(a, id);
    if (v !== "not specified") parts.push(`${id}: ${v}`);
  }
  return parts.join("; ") || "no profile answers recorded";
}

function chatSystem(state) {
  const routine = (state.recs || []).map((r, i) => `${i + 1}. [${r.step}] ${r.brand} ${r.name} (${r.price}, ${r.retailer}) — ${r.why} | alt: ${r.altBrand} ${r.altName}`).join("\n");
  const catalog = CATALOG.map((p) => `${p.brand} ${p.name} [${p.step}] ${p.price}`).join("; ");
  return `You are Meemo, a friendly skincare guide texting with a returning user. This is an ongoing conversation — you remember their profile and routine.

USER PROFILE: ${profileSummary(state)}
THEIR CURRENT ROUTINE:
${routine || "(none yet)"}

VERIFIED CATALOG (the only products you may ever recommend — never invent a product, price, or link):
${catalog}

RULES:
- Keep replies short and text-friendly: 1-3 short paragraphs max, no markdown tables.
- When suggesting a product, use its exact catalog name and price. If it's in their routine or the catalog alt for that step, say so.
- If they report a new concern (dryness, breakouts, irritation), relate it to their profile and routine; you may suggest swapping a step to another catalog product in the same step.
- If they mention pain, a rash that spreads, swelling, or anything that sounds medical, advise pausing actives and seeing a dermatologist. You give cosmetic guidance only.
- Never contradict their profile. If they say their skin has changed, acknowledge the change and adapt.
- If they ask for their routine, list it briefly with prices.
${DISCLAIMER}`;
}

function questionText(q, idx) {
  const multi = (q.sub || "").includes("Select all");
  const opts = q.options.map((o, i) => `${i + 1}) ${o.label}`).join("\n");
  return `Q${idx + 1}/${questions.length}: ${q.question}\n${opts}\n${multi ? "Reply with the number(s), separated by commas." : "Reply with one number."} Or say SKIP.`;
}

function parseAnswer(q, text) {
  const t = (text || "").trim().toLowerCase();
  if (t === "skip") return { selected: [] };
  const multi = (q.sub || "").includes("Select all");
  const nums = t.match(/\d+/g);
  let picked = [];
  if (nums) picked = nums.map((n) => parseInt(n) - 1).filter((i) => i >= 0 && i < q.options.length);
  if (!picked.length) {
    const idx = q.options.findIndex((o) => t.includes(o.label.toLowerCase().split(" + ")[0].split(" ")[0]) || t === o.value);
    if (idx >= 0) picked = [idx];
  }
  if (!picked.length) return null;
  if (!multi) picked = [picked[0]];
  return { selected: [...new Set(picked)].map((i) => q.options[i].value) };
}

const newState = () => ({ stage: "quiz", qIndex: 0, answers: {}, recs: null, history: [], checkinsSent: [], createdAt: Date.now(), lastSeen: Date.now() });

export async function handleMessage(phone, text, mediaBase64) {
  let state = await store.get(phone);
  const t = (text || "").trim();
  const lower = t.toLowerCase();
  if (!state) {
    state = newState();
    state.stage = "quiz"; state.qIndex = 0;
    await store.set(phone, state);
    return [
      "Hi, I'm Meemo 🌿 I build Korean skincare routines from a short consult — and I'll stick around after: ask me anything, tell me how your skin's doing, and I'll help you adjust.",
      DISCLAIMER,
      "Let's start. " + questionText(questions[0], 0),
    ];
  }
  state.lastSeen = Date.now();

  if (lower === "restart" || lower === "start over") {
    const keepRecs = state.recs;
    state = newState(); state.recs = keepRecs;
    await store.set(phone, state);
    return ["Fresh start — new consult, same me. " + questionText(questions[0], 0)];
  }

  if (state.stage === "quiz") {
    const q = questions[state.qIndex];
    const parsed = parseAnswer(q, t);
    if (!parsed) {
      await store.set(phone, state);
      return ["I didn't catch that — " + questionText(q, state.qIndex)];
    }
    state.answers[q.id] = parsed;
    state.qIndex += 1;
    if (state.qIndex < questions.length) {
      await store.set(phone, state);
      return [questionText(questions[state.qIndex], state.qIndex)];
    }
    state.stage = "selfie";
    await store.set(phone, state);
    return ["That's the consult done ✓\nWant a skin scan? Send a selfie (front-facing, natural light) and I'll factor it in — or reply SKIP."];
  }

  if (state.stage === "selfie") {
    const img = mediaBase64 || null;
    if (!img && lower !== "skip") {
      await store.set(phone, state);
      return ["Just send the photo when you're ready, or reply SKIP to build your routine from your answers alone."];
    }
    try {
      state.recs = await generateRoutine(state, img);
      state.stage = "chat";
      state.checkinDue = Date.now() + 3 * 24 * 3600 * 1000;
      await store.set(phone, state);
      return formatRoutine(state.recs);
    } catch (e) {
      state.stage = "chat";
      await store.set(phone, state);
      return ["Hmm — my analysis hit a snag. Give me a moment and text me anything (even 'hi') and I'll build your routine then."];
    }
  }

  // stage === "chat": the ongoing conversation
  if (lower === "routine" || lower === "my routine") {
    await store.set(phone, state);
    return state.recs ? formatRoutine(state.recs) : ["You don't have a routine yet — say RESTART and we'll do the consult."];
  }
  if (!state.recs) {
    // Routine generation failed earlier; retry now.
    try {
      state.recs = await generateRoutine(state, null);
      state.checkinDue = Date.now() + 3 * 24 * 3600 * 1000;
      await store.set(phone, state);
      return formatRoutine(state.recs);
    } catch (e) { /* fall through to chat */ }
  }
  state.history = [...(state.history || []), { role: "user", content: t }].slice(-12);
  try {
    const reply = await internals.callClaude({ system: chatSystem(state), messages: state.history, maxTokens: 700 });
    state.history = [...state.history, { role: "assistant", content: reply }].slice(-12);
    await store.set(phone, state);
    return [reply];
  } catch (e) {
    await store.set(phone, state);
    return ["My brain hiccuped — try me again in a moment?"];
  }
}

export async function dueCheckins() {
  const phones = await store.keys();
  const due = [];
  for (const phone of phones) {
    const s = await store.get(phone);
    if (s && s.stage === "chat" && s.recs && s.checkinDue && s.checkinDue <= Date.now()) due.push({ phone, state: s });
  }
  return due;
}

export async function markCheckinSent(phone) {
  const s = await store.get(phone);
  if (!s) return;
  const sent = [...(s.checkinsSent || []), Date.now()];
  s.checkinsSent = sent;
  // Next check-in: +11 days after the first, +16 after the second, then stop.
  s.checkinDue = sent.length === 1 ? Date.now() + 11 * 24 * 3600 * 1000 : sent.length === 2 ? Date.now() + 16 * 24 * 3600 * 1000 : null;
  await store.set(phone, s);
}

export const CHECKIN_MESSAGE = "Hi, it's Meemo 🌿 Checking in — how's your skin feeling with the routine so far? Anything too harsh, too heavy, or just not working? Tell me and I'll adjust it.";
