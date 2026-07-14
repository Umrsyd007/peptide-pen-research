export interface DeepDiveSection {
  heading: string;
  body: string | string[];
}

export interface ProductDescription {
  tagline: string;
  whatIs: string;
  benefits: string[];
  mechanism?: string;
  protocol?: string;
  stacksWith?: string[];
  sideEffects?: string[];
  faqs?: { q: string; a: string }[];
  deepDive?: DeepDiveSection[];
}

const D: Record<string, ProductDescription> = {
  // ---- Cognitive / Neuro ----
  "72d3cbf2": {
    tagline: "Acetylated Selank nasal peptide for focus, calm and cognitive resilience.",
    whatIs:
      "AC-Selank-NH2 is a modified, acetylated and amidated analog of the heptapeptide Selank, engineered for enhanced nasal stability and prolonged half-life. Originally derived from the Russian neuropeptide tuftsin, it is studied for anxiolytic, nootropic and immunomodulatory activity without sedation or dependence.",
    benefits: [
      "Reduces situational anxiety and stress reactivity",
      "Sharpens focus and verbal working memory",
      "Improves stress-recovery and mood stability",
      "Modulates BDNF and enkephalin pathways",
      "Non-sedating, non-addictive profile in animal models",
    ],
    mechanism:
      "Selank analogs upregulate BDNF expression, modulate GABA-ergic tone, and stabilize the breakdown of endogenous enkephalins, producing a calm-yet-alert state in research models.",
    protocol:
      "Typical research dosing: 1–2 sprays per nostril, 1–3× daily, in 10–21 day cycles. Acetylation extends half-life vs. native Selank.",
    stacksWith: ["Semax", "Noopept", "BPC-157", "NAD+"],
    sideEffects: ["Transient nasal irritation", "Mild headache in early cycles", "Vivid dreams (rare)"],
  },
  "5696aeb5": {
    tagline: "IV-grade glutathione paired with methylene blue for redox and mitochondrial support.",
    whatIs:
      "A dual-action research formulation combining reduced L-glutathione (GSH) — the body's master intracellular antioxidant — with pharmaceutical-grade methylene blue, a mitochondrial electron-cycling agent studied for cognitive and metabolic endpoints.",
    benefits: [
      "Replenishes intracellular glutathione stores",
      "Bypasses Complex I/III dysfunction via electron shuttling",
      "Supports cognitive clarity and processing speed",
      "Reduces oxidative load and lipid peroxidation",
      "Synergizes with NAD+ and red-light protocols",
    ],
    mechanism:
      "Glutathione recycles oxidized vitamins C/E and detoxifies peroxides via GPx. Methylene blue accepts electrons in the mitochondrial ETC, increasing cytochrome-c oxidase activity at low doses.",
    stacksWith: ["NAD+", "NMN", "Resveratrol", "SS-31"],
    sideEffects: ["Blue-tinted urine (expected)", "Mild GI upset", "Serotonergic interaction risk with MAOIs"],
  },
  "eaee73bb": {
    tagline: "At-home gut microbiome analysis with actionable diversity and dysbiosis scoring.",
    whatIs:
      "A clinical-grade stool microbiome test using 16S rRNA / shotgun sequencing to quantify bacterial diversity, opportunistic pathogens, SCFA producers and inflammation markers. Returns a personalized report with diet, prebiotic and probiotic recommendations.",
    benefits: [
      "Identifies dysbiosis and pathogen overgrowth",
      "Quantifies SCFA-producing keystone species",
      "Personalized diet and supplement protocol",
      "Tracks gut diversity over time",
    ],
    protocol: "Single-collection stool kit. Results in 3–4 weeks via secure dashboard.",
  },
  "d2a5603b": {
    tagline: "KPV tripeptide nasal spray for mucosal inflammation and gut-barrier research.",
    whatIs:
      "KPV (Lys-Pro-Val) is the C-terminal tripeptide of α-MSH, studied for its potent anti-inflammatory effects on mucosal surfaces, the gut lining, and the skin without α-MSH's pigmentation activity.",
    benefits: [
      "Modulates NF-κB inflammatory cascade",
      "Supports gut-mucosa and intestinal barrier",
      "Reduces sinonasal inflammation in research models",
      "Pairs well with BPC-157 for GI protocols",
    ],
    stacksWith: ["BPC-157", "TB-500", "Thymosin Alpha-1"],
  },
  "75eaa7ac": {
    tagline: "Melanotan II nasal delivery for melanogenesis and libido research.",
    whatIs:
      "Melanotan II (MT-2) is a synthetic analog of α-MSH that binds melanocortin receptors (MC1R / MC3R / MC4R). The nasal spray format provides a needle-free research route.",
    benefits: [
      "Stimulates melanogenesis (MC1R)",
      "Modulates sexual arousal pathways (MC4R)",
      "Mild appetite suppression",
    ],
    sideEffects: ["Nausea on early doses", "Facial flushing", "Darkening of moles/nevi"],
  },
  "db401164": {
    tagline: "P21 neurogenic nasal peptide modeled on Cerebrolysin's active fragment.",
    whatIs:
      "Nootropic P21 is a synthetic peptide derived from ciliary neurotrophic factor (CNTF), designed to mimic the neurogenic activity of Cerebrolysin while remaining stable for nasal delivery.",
    benefits: [
      "Promotes adult hippocampal neurogenesis",
      "Upregulates BDNF and NGF",
      "Supports memory consolidation",
      "Studied for cognitive aging and TBI recovery",
    ],
    stacksWith: ["Semax", "Selank", "Dihexa", "NAD+"],
  },
  "68831782": {
    tagline: "SS-31 (Elamipretide) — cardiolipin-binding mitochondrial peptide.",
    whatIs:
      "SS-31 / Elamipretide is a tetrapeptide that selectively binds cardiolipin on the inner mitochondrial membrane, stabilizing cristae architecture and improving electron-transport efficiency. Studied for heart failure, sarcopenia and age-related mitochondrial decline.",
    benefits: [
      "Restores mitochondrial cristae and ATP output",
      "Reduces ROS leak from Complex I/III",
      "Improves exercise capacity in aged models",
      "Supports cardiac and renal mitochondrial health",
    ],
    mechanism: "Binds cardiolipin without altering membrane potential, preserving ETC supercomplex assembly.",
    stacksWith: ["NAD+", "Urolithin A", "MOTS-c", "Glutathione"],
  },
  "f5aa4333": {
    tagline: "Tesamorelin — GHRH analog for visceral fat and IGF-1 research.",
    whatIs:
      "Tesamorelin is a stabilized 44-amino-acid GHRH analog, FDA-approved for HIV-associated lipodystrophy. It stimulates pulsatile endogenous GH release without bypassing pituitary feedback.",
    benefits: [
      "Significant reduction in visceral adipose tissue",
      "Raises IGF-1 within physiologic ranges",
      "Improves lipid panel and cognition in aging studies",
      "Preserves pulsatile GH architecture",
    ],
    protocol: "Research dosing: 1–2 mg SC nightly, 5 on / 2 off cycles.",
    stacksWith: ["Ipamorelin", "CJC-1295", "BPC-157"],
    sideEffects: ["Injection-site reaction", "Joint stiffness", "Transient glucose elevation"],
  },
  "591b5bd3": {
    tagline: "Kisspeptin-10 — upstream regulator of the HPG axis.",
    whatIs:
      "Kisspeptin-10 is the active decapeptide of the KISS1 gene product, the master initiator of GnRH pulsatility. Studied for hypogonadism, fertility, and post-cycle endocrine recovery.",
    benefits: [
      "Stimulates endogenous LH and FSH release",
      "Restores GnRH pulsatility",
      "Supports natural testosterone and estradiol",
      "Studied in fertility and hypothalamic amenorrhea",
    ],
    stacksWith: ["HCG", "Enclomiphene"],
  },
  "c89a10d5": {
    tagline: "CJC-1295 no-DAC + Ipamorelin — the classic GH pulsatility stack.",
    whatIs:
      "A 1:1 research blend of CJC-1295 (without DAC) — a short-acting GHRH analog — and Ipamorelin, a selective GHRP. Together they mimic and amplify a natural pulse of growth hormone without elevating cortisol or prolactin.",
    benefits: [
      "Amplifies endogenous GH pulse 5–10×",
      "Preserves physiologic feedback loops",
      "Improves sleep depth and recovery",
      "Supports lean mass and skin quality",
    ],
    protocol: "Common research dose: 100 mcg + 100 mcg SC pre-bed, 5 on / 2 off.",
    stacksWith: ["BPC-157", "Tesamorelin", "MK-677"],
    sideEffects: ["Flushing", "Head-rush at injection", "Transient water retention"],
  },
  "e6a824f0": {
    tagline: "Thymosin Alpha-1 — immune-modulating peptide for chronic infection research.",
    whatIs:
      "Tα1 is a 28-amino-acid peptide secreted by the thymus that matures T-cells and shifts the immune response toward Th1. Used clinically in 35+ countries for hepatitis, sepsis adjunct and oncology support.",
    benefits: [
      "Enhances T-cell maturation and NK activity",
      "Shifts Th2-dominant profiles toward Th1",
      "Studied for chronic viral infections and cancer adjunct",
      "Supports vaccine response in immunosenescence",
    ],
    stacksWith: ["Thymalin", "BPC-157", "KPV"],
  },
  "821f7789": {
    tagline: "Thymalin — peptide bioregulator of thymic function.",
    whatIs:
      "A polypeptide complex extracted via the Khavinson bioregulator paradigm. Restores thymic-derived T-cell production in aging models and is studied for immunorestoration and longevity.",
    benefits: [
      "Restores age-related thymic involution",
      "Increases CD4+/CD8+ ratio",
      "Studied for lifespan extension in elderly cohorts",
    ],
    stacksWith: ["Thymosin Alpha-1", "Epitalon"],
  },
  "a973f518": {
    tagline: "SLU-PP-332 — ERR agonist mimicking exercise at the mitochondrial level.",
    whatIs:
      "SLU-PP-332 is a pan-agonist of estrogen-related receptors (ERRα/β/γ), the transcription factors that drive oxidative metabolism and mitochondrial biogenesis in muscle. Preclinical work shows it reproduces many endurance-training adaptations without exercise.",
    benefits: [
      "Increases mitochondrial biogenesis (PGC-1α pathway)",
      "Improves endurance in rodent models (+70%)",
      "Reduces adiposity without caloric restriction",
      "Upregulates fat oxidation gene programs",
    ],
    stacksWith: ["5-Amino-1MQ", "MOTS-c", "NAD+"],
  },
  "f2a12dcf": {
    tagline: "1:1 telehealth consult with a peptide-literate clinician.",
    whatIs:
      "A 60-minute consultation with a clinician experienced in peptide, hormone and longevity research. Includes lab review, protocol design and follow-up notes.",
    benefits: ["Personalized protocol", "Lab interpretation", "Drug-interaction screen", "Written follow-up summary"],
  },
  "f76b7c74": {
    tagline: "8-week personalized gut-restoration program built on microbiome data.",
    whatIs:
      "A clinician-guided protocol combining microbiome testing, targeted prebiotics/probiotics, dietary structure and (where indicated) gut-active peptides like BPC-157 and KPV.",
    benefits: ["Microbiome diversity gains", "Dysbiosis correction", "SCFA optimization", "Symptom tracking dashboard"],
  },
  "94badb0f": {
    tagline: "Whole-genome DNA test with actionable longevity and pharmacogenomic insights.",
    whatIs:
      "Saliva-based DNA test covering 700,000+ SNPs across longevity, methylation, detox, hormones, sport-performance and pharmacogenomic loci. Includes a clinician-reviewed report.",
    benefits: ["Pharmacogenomic profile", "Methylation/MTHFR status", "Polygenic risk scoring", "Personalized supplement panel"],
  },

  // ---- Bestsellers ----
  "aff029b8": {
    tagline: "Ipamorelin — the cleanest selective GHRP for steady growth-hormone pulses.",
    whatIs:
      "Ipamorelin is a pentapeptide GHRP that selectively activates the ghrelin / GHS-R receptor to release pulsatile growth hormone, without affecting cortisol, prolactin or appetite — a key reason it remains the most-studied GHRP in research.",
    benefits: [
      "Selective pulsatile GH release",
      "No cortisol or prolactin spike",
      "Improves sleep quality and recovery",
      "Supports lean mass and skin elasticity",
    ],
    protocol: "Research dosing: 100–300 mcg SC, 1–3× daily, often paired with CJC-1295.",
    stacksWith: ["CJC-1295", "Tesamorelin", "BPC-157"],
    sideEffects: ["Mild flushing", "Brief lightheadedness post-injection"],
  },
  "e794817e": {
    tagline: "BPC-157 — the body protection peptide for tendon, gut and vascular repair.",
    whatIs:
      "Body Protective Compound-157 is a 15-amino-acid sequence isolated from human gastric juice. The most-studied 'repair peptide' in animal models, it accelerates healing across virtually every tissue tested — tendon, ligament, muscle, gut, brain and vasculature.",
    benefits: [
      "Accelerates tendon, ligament and muscle repair",
      "Heals GI ulceration and leaky-gut models",
      "Promotes angiogenesis at injury sites",
      "Neuroprotective in TBI / serotonergic damage models",
      "Stable across oral and injectable routes",
    ],
    mechanism: "Upregulates VEGFR2 and FAK/paxillin pathways, restoring blood flow and fibroblast migration at injured tissue.",
    protocol: "Research dosing: 250–500 mcg SC near injury site, 1–2× daily, 4–8 week cycles.",
    stacksWith: ["TB-500", "KPV", "GHK-Cu", "CJC/Ipa"],
    sideEffects: ["Generally well-tolerated", "Mild injection-site sensitivity"],
  },
  "08f6ee52": {
    tagline: "Retatrutide — the next-generation triple agonist for fat loss research.",
    whatIs:
      "Retatrutide is Lilly's investigational triple agonist of GLP-1, GIP and glucagon receptors. Phase 2 data showed up to 24% body-weight reduction at 48 weeks — outperforming semaglutide and tirzepatide.",
    benefits: [
      "Triple incretin/glucagon receptor activation",
      "Up to ~24% weight reduction in trials",
      "Improves glycemic control and lipid profile",
      "Energy expenditure boost via glucagon arm",
    ],
    protocol: "Weekly subcutaneous research dosing, titrated from low microgram range.",
    sideEffects: ["Nausea (titration-dependent)", "Constipation", "Transient HR increase"],
    deepDive: [
      {
        heading: "What is Retatrutide?",
        body: [
          "Retatrutide is a peptide that simultaneously activates three receptors: GLP-1 (glucagon-like peptide-1), GIP (glucose-dependent insulinotropic polypeptide), and glucagon receptors. This multi-receptor targeting approach offers a highly effective way to study complex metabolic conditions such as type 2 diabetes, obesity, and related cardiovascular diseases.",
          "Unlike traditional peptide agonists that act on only one receptor, Retatrutide engages three distinct metabolic pathways, delivering enhanced efficacy and better tolerability in research models. It has a prolonged duration of action that supports convenient once-weekly dosing, making it an ideal compound for research in metabolic diseases and regenerative medicine.",
          "Besides metabolic and obesity research, Retatrutide is also being studied for its potential in reducing inflammation, improving lipid profiles, and preventing cardiovascular complications.",
          "Designed to significantly improve blood sugar regulation, promote fat loss, and enhance overall metabolic markers, Retatrutide's triple receptor mechanism opens up unique opportunities for medical research.",
        ],
      },
      {
        heading: "How does Retatrutide work?",
        body: [
          "Retatrutide works by activating three key metabolic receptors — GLP-1, GIP, and glucagon — resulting in combined effects that improve blood sugar control, suppress appetite, and promote fat loss.",
          "• GLP-1 receptors: Stimulation boosts insulin secretion, helping reduce blood glucose levels. It also slows gastric emptying, extending feelings of fullness and lowering calorie intake, while suppressing glucagon — a hormone that raises liver glucose production.",
          "• GIP receptors: Activation complements GLP-1 by enhancing insulin response and improving peripheral insulin sensitivity. GIP activity also reduces inflammation and supports better lipid metabolism by lowering triglycerides and LDL cholesterol.",
          "• Glucagon receptors: Promote fat breakdown (lipolysis) and thermogenesis, aiding in fat tissue reduction. This effect is especially useful for obesity research and energy balance regulation.",
        ],
      },
      {
        heading: "Research on Retatrutide",
        body: "Retatrutide has undergone extensive preclinical and clinical evaluation, demonstrating safety and effectiveness in metabolic disorder models. Ongoing clinical trials, including phase 2 studies, are further investigating its impact on obesity, type 2 diabetes, lipid metabolism, and inflammation.",
      },
      {
        heading: "Clinical Trials and Findings",
        body: "Clinical trials have tested Retatrutide's ability to influence metabolic disease markers. Researchers continue to explore its long-term effects on blood sugar regulation, weight reduction, and cardiovascular protection.",
      },
      {
        heading: "Phase 2 Results",
        body: "Phase 2 trials have shown notable weight reduction and improved blood sugar control. Participants experienced lasting reductions in body fat, enhanced insulin sensitivity, and better lipid metabolism — with up to ~24% body-weight reduction at 48 weeks.",
      },
      {
        heading: "Retatrutide in Obesity and Type 2 Diabetes Research",
        body: [
          "• Type 2 Diabetes: Studies indicate Retatrutide significantly lowers HbA1c (glycated hemoglobin) levels, improving long-term glucose management. Its triple receptor action offers superior glycemic control compared to single-target GLP-1 agonists.",
          "• Weight Loss: In obese cohorts, Retatrutide promotes substantial fat reduction by suppressing appetite, increasing thermogenesis (heat production to burn fat), and stimulating fat breakdown. These mechanisms make it a potent agent for weight management research.",
        ],
      },
      {
        heading: "Metabolic and Cardiovascular Benefits",
        body: "Retatrutide has been shown to improve lipid profiles by lowering triglycerides and LDL cholesterol while increasing HDL (good cholesterol), thereby reducing cardiovascular risk markers. It also exhibits anti-inflammatory effects, which may benefit studies on chronic inflammation, metabolic syndrome, and autoimmune disease.",
      },
      {
        heading: "Molecular and Structural Properties",
        body: "Retatrutide is a multi-receptor peptide agonist engineered to target GLP-1, GIP, and glucagon receptors efficiently. Its stabilized helical structure enhances receptor binding and extends its biological half-life, reducing the frequency of administration. This unique structure supports its metabolic effects — increased lipolysis, appetite regulation, and glucose balance — making it valuable for obesity and metabolic disorder research.",
      },
      {
        heading: "Development Background",
        body: "Developed as part of a new wave of multi-target peptide therapies, Retatrutide aims to surpass the limitations of single-receptor agonists by combining triple receptor activation. Clinical and preclinical studies have demonstrated its superior efficacy and prolonged action, with ongoing research exploring broader therapeutic applications in metabolic and cardiovascular conditions.",
      },
      {
        heading: "Benefits and Applications",
        body: [
          "• Blood Sugar Control: Enhances insulin secretion, sensitivity, and reduces glucagon — driving excellent glucose regulation in type 2 diabetes research.",
          "• Weight Loss: Suppresses appetite and promotes fat breakdown, making it effective in obesity studies.",
          "• Cardiovascular Protection: Improves lipid profiles and reduces inflammation, lowering cardiovascular risk markers.",
          "• Metabolic Research: A useful tool for investigating energy balance, lipid metabolism, and metabolic syndrome mechanisms.",
          "• Chronic Disease Potential: May offer benefits in chronic inflammatory and neurodegenerative disease models.",
          "• Quality of Life Markers: Supports increased energy, less fatigue, and overall improvement through metabolic control.",
        ],
      },
      {
        heading: "Possible Side Effects",
        body: [
          "Retatrutide is generally well tolerated in studies, but some mild to moderate side effects may occur — often early in titration — including:",
          "• Gastrointestinal symptoms (nausea, vomiting, diarrhea, constipation)",
          "• Headaches",
          "• Mild heart rate increase",
          "• Application site reactions (redness, itching, swelling)",
          "• Fatigue or weakness",
          "These effects are usually temporary. Severe or persistent symptoms should be addressed with a healthcare professional.",
        ],
      },
      {
        heading: "Retatrutide vs. Tirzepatide",
        body: "Both peptides are advanced metabolic compounds, but Retatrutide activates three receptors (GLP-1, GIP, glucagon) while Tirzepatide targets only two (GLP-1, GIP). This triple receptor action may provide enhanced fat metabolism, thermogenesis, and energy regulation, positioning Retatrutide as a promising option for obesity and metabolic research. Studies continue to clarify the distinct benefits of each peptide in glucose control and cardiovascular health.",
      },
      {
        heading: "Disclaimer: Research Use Only",
        body: "This compound is intended strictly for in-vitro observation and research-related purposes. The information presented is based on a range of scientific studies and analyses but is not intended to diagnose, treat, or prevent any medical conditions.",
      },
    ],
  },
  "46f6d800": {
    tagline: "Melanotan II — α-MSH analog for melanogenesis and libido research.",
    whatIs:
      "Melanotan II is a synthetic non-selective melanocortin receptor agonist. Activation of MC1R drives eumelanin production; MC4R activation modulates libido and appetite.",
    benefits: ["Stimulates skin pigmentation", "Modulates libido (MC4R)", "Mild appetite suppression"],
    sideEffects: ["Nausea early-cycle", "Facial flushing", "Mole darkening"],
  },
  "3afd37de": {
    tagline: "Skin Glow — GHK-Cu pen for collagen, hair and skin regeneration.",
    whatIs:
      "GHK-Cu is a naturally occurring copper-binding tripeptide (Gly-His-Lys) that plummets ~60% with age. Studied for stimulating collagen, elastin and glycosaminoglycan synthesis while modulating ~4,000 human genes toward youthful expression.",
    benefits: [
      "Stimulates collagen and elastin synthesis",
      "Improves skin firmness and wrinkle depth",
      "Promotes hair-follicle size and density",
      "Anti-inflammatory and wound-healing activity",
    ],
    stacksWith: ["BPC-157", "TB-500", "Epitalon"],
  },
  "cd1d9cc4": {
    tagline: "Somatropin (rHGH) — recombinant 191-aa human growth hormone.",
    whatIs:
      "Somatropin is the recombinant form of endogenous 22-kDa human growth hormone, identical in 191-amino-acid sequence to pituitary GH. Used clinically for GH deficiency and studied broadly in body composition, recovery and longevity research.",
    benefits: [
      "Direct IGF-1 elevation",
      "Lean mass accretion and fat-mass reduction",
      "Improved skin, hair and connective-tissue quality",
      "Deeper sleep architecture and recovery",
    ],
    protocol: "Research dosing typically 1–4 IU/day SC, AM or split AM/PM.",
    sideEffects: ["Water retention", "Carpal-tunnel-like symptoms", "Glucose intolerance at high doses"],
  },
  "9a7347e7": {
    tagline: "TB-500 (Thymosin β-4) — the systemic recovery and angiogenesis peptide.",
    whatIs:
      "TB-500 is the synthetic active fragment of Thymosin β-4, a 43-amino-acid actin-binding protein expressed in nearly every human cell. It drives cell migration, angiogenesis and tissue remodeling.",
    benefits: [
      "Systemic recovery and soft-tissue repair",
      "Promotes angiogenesis and capillary growth",
      "Reduces inflammation at injury sites",
      "Synergistic with BPC-157",
    ],
    protocol: "Research dosing: 2–2.5 mg SC weekly (loading 4–6 weeks, then maintenance).",
    stacksWith: ["BPC-157", "GHK-Cu", "CJC/Ipa"],
  },
  "eca4f03d": {
    tagline: "BPC-157 + TB-500 — the gold-standard regenerative stack.",
    whatIs:
      "A 1:1 research blend of the two most-studied repair peptides. BPC-157 acts locally on tendons, gut and vasculature; TB-500 works systemically through actin sequestration and cell migration. Together they cover both local and global recovery axes.",
    benefits: [
      "Combines local + systemic tissue repair",
      "Accelerates tendon, muscle and ligament recovery",
      "Improves angiogenesis and capillary density",
      "Convenient single-pen administration",
    ],
    stacksWith: ["GHK-Cu", "CJC/Ipa", "IGF-1 LR3"],
  },
  "1691332d": {
    tagline: "Epitalon — Khavinson's telomerase-activating longevity peptide.",
    whatIs:
      "Epitalon (Ala-Glu-Asp-Gly) is a synthetic tetrapeptide derived from epithalamin, a pineal-gland extract. Long-term Russian clinical work suggests telomerase upregulation, melatonin normalization and reduced age-related mortality.",
    benefits: [
      "Activates telomerase in somatic cells",
      "Normalizes melatonin and cortisol rhythm",
      "Improves sleep architecture",
      "Studied for lifespan extension in elderly cohorts",
    ],
    protocol: "Research dosing: 5–10 mg SC nightly × 10–20 day cycles, 1–2× per year.",
    stacksWith: ["Thymalin", "NAD+", "SS-31"],
  },
  "c777ccf6": {
    tagline: "Spermidine — autophagy-inducing polyamine for cellular renewal.",
    whatIs:
      "Spermidine is a naturally occurring polyamine that declines with age. It is one of the most robust pharmacological inducers of autophagy known, extending lifespan in yeast, worms, flies and mice.",
    benefits: [
      "Induces autophagy and mitophagy",
      "Cardioprotective in animal models",
      "Supports memory and hippocampal function",
      "Hair-growth and follicle support",
    ],
    stacksWith: ["NAD+", "Resveratrol", "Rapamycin protocols"],
  },
  "b8597fa0": {
    tagline: "MOTS-c — mitochondrial-derived peptide for metabolic flexibility.",
    whatIs:
      "MOTS-c is a 16-amino-acid peptide encoded in mitochondrial DNA. It acts as a mitokine, signaling to skeletal muscle and adipose tissue to enhance insulin sensitivity and fat oxidation — effectively mimicking an exercise / fasting signal.",
    benefits: [
      "Improves insulin sensitivity",
      "Reverses high-fat-diet weight gain in rodents",
      "Enhances mitochondrial fat oxidation",
      "Exercise-mimetic gene expression",
    ],
    stacksWith: ["SLU-PP-332", "5-Amino-1MQ", "NAD+"],
  },
  "ad69b7ac": {
    tagline: "Glutathione + NAD+ + Resveratrol — the three-axis longevity infusion pen.",
    whatIs:
      "A combined research formulation: reduced glutathione for redox defense, NAD+ for sirtuin/PARP fuel and mitochondrial respiration, and trans-resveratrol as a sirtuin activator and bioenhancer.",
    benefits: [
      "Replenishes NAD+ and glutathione together",
      "Activates SIRT1 / SIRT3 longevity pathways",
      "Supports cognition, energy and recovery",
      "Reduces systemic oxidative stress",
    ],
    stacksWith: ["SS-31", "Spermidine", "MOTS-c"],
  },
  "7389ae0d": {
    tagline: "Vitality Complex — glutathione + NMN + resveratrol for daily longevity stack.",
    whatIs:
      "A daily longevity pen combining NMN (the most efficient NAD+ precursor), glutathione (master antioxidant) and trans-resveratrol (sirtuin activator) in research-grade ratios.",
    benefits: [
      "Restores NAD+ via NMN",
      "Supports SIRT1 activation",
      "Lowers oxidative stress markers",
      "Improves energy and recovery in aging cohorts",
    ],
    stacksWith: ["Spermidine", "SS-31", "Epitalon"],
  },
  "474ae481": {
    tagline: "DSIP — Delta Sleep-Inducing Peptide for deep-sleep research.",
    whatIs:
      "DSIP is a 9-amino-acid neuropeptide isolated from rabbit cerebral venous blood during electrically induced sleep. Studied for sleep onset, delta-wave architecture and stress-resilience.",
    benefits: [
      "Increases delta-wave (deep) sleep",
      "Reduces sleep latency",
      "Modulates HPA-axis and cortisol",
      "Non-sedating, non-habituating profile",
    ],
    stacksWith: ["Epitalon", "Selank"],
  },
  "322e88af": {
    tagline: "Semaglutide — the GLP-1 receptor agonist that redefined weight-loss research.",
    whatIs:
      "Semaglutide is a long-acting GLP-1 receptor agonist with 94% homology to native GLP-1, engineered for weekly subcutaneous dosing. STEP trial program demonstrated ~15% mean body-weight reduction.",
    benefits: [
      "~15% mean body-weight reduction in trials",
      "Strong appetite and craving suppression",
      "Improves HbA1c and cardiovascular endpoints",
      "Weekly dosing — convenient titration",
    ],
    protocol: "Standard titration: 0.25 → 0.5 → 1.0 → 1.7 → 2.4 mg weekly SC.",
    stacksWith: ["Tirzepatide (transition)", "BPC-157 (GI)", "L-Carnitine"],
    sideEffects: ["Nausea", "Constipation", "Sulfur burps", "Gallbladder events at high dose"],
  },
  "c1680f7a": {
    tagline: "HGH Fragment 176-191 — targeted lipolytic GH fragment.",
    whatIs:
      "HGH Frag 176-191 is the C-terminal 16-amino-acid sequence of human growth hormone, isolating GH's lipolytic activity without affecting blood glucose or IGF-1.",
    benefits: [
      "Selective lipolysis (visceral and subcutaneous)",
      "No effect on IGF-1 or insulin sensitivity",
      "Pairs well with GHRP/GHRH stacks",
    ],
    sideEffects: ["Injection-site soreness", "Hunger modulation"],
  },
  "65df5f32": {
    tagline: "CJC-1295 (no-DAC) — short-acting GHRH analog for natural GH pulses.",
    whatIs:
      "CJC-1295 without DAC (also called Mod GRF 1-29) is a stabilized 30-amino-acid GHRH analog with a 30-minute half-life — long enough to amplify a single GH pulse, short enough to preserve pulsatility.",
    benefits: [
      "Amplifies endogenous GH pulse",
      "Preserves natural GH rhythm",
      "Synergistic with all GHRPs",
    ],
    stacksWith: ["Ipamorelin", "GHRP-6", "Hexarelin"],
  },
  "1b0959b6": {
    tagline: "Tirzepatide — dual GIP/GLP-1 agonist for next-tier metabolic research.",
    whatIs:
      "Tirzepatide is a once-weekly dual agonist of GIP and GLP-1 receptors. SURMOUNT trials showed up to ~22.5% mean body-weight reduction at the 15 mg dose — currently the leading approved weight-loss agent.",
    benefits: [
      "Dual incretin activation",
      "Up to ~22.5% weight loss in trials",
      "Superior HbA1c reduction vs. GLP-1 mono",
      "Improved lipid and inflammation markers",
    ],
    protocol: "Weekly SC titration: 2.5 → 5 → 7.5 → 10 → 12.5 → 15 mg.",
    sideEffects: ["Nausea (titration-dependent)", "Diarrhea", "Decreased appetite", "Injection-site reaction"],
  },
  "f386281f": {
    tagline: "5-Amino-1MQ — NNMT inhibitor for metabolic and muscle research.",
    whatIs:
      "5-Amino-1-methylquinolinium is a small-molecule inhibitor of nicotinamide N-methyltransferase (NNMT), an enzyme overexpressed in adipose tissue that drains the cellular methyl donor pool and sequesters NAD+ precursors.",
    benefits: [
      "Increases cellular NAD+ and SAM availability",
      "Reduces adipocyte size in obese models",
      "Improves muscle stem-cell function in aged models",
      "Restores methylation balance",
    ],
    stacksWith: ["MOTS-c", "NMN", "SLU-PP-332"],
  },
  "080bb4c4": {
    tagline: "NAD+ injectable — direct mitochondrial substrate for energy and longevity.",
    whatIs:
      "Direct injectable Nicotinamide Adenine Dinucleotide — the universal cellular cofactor for redox reactions, sirtuin activity, PARP DNA repair and mitochondrial respiration. Levels decline ~50% by middle age.",
    benefits: [
      "Restores cellular NAD+ pools rapidly",
      "Fuels SIRT1/3 and PARP1 activity",
      "Supports cognition, energy and recovery",
      "Studied for addiction recovery and aging",
    ],
    protocol: "Research dosing: 50–300 mg SC, slow titration to tolerance.",
    sideEffects: ["Flushing", "Chest pressure (rate-related)", "Nausea at fast infusion"],
  },
  "357579fd": {
    tagline: "PT-141 (Bremelanotide) — melanocortin agonist for libido research.",
    whatIs:
      "PT-141 is a synthetic melanocortin (MC3R/MC4R) agonist derived from Melanotan II. Unlike PDE5 inhibitors, it acts centrally on the nervous system — approved as Vyleesi for HSDD in women, widely studied for male and female libido.",
    benefits: [
      "Centrally mediated libido response",
      "Effective in both sexes",
      "Works independently of vascular pathway",
    ],
    sideEffects: ["Nausea (most common)", "Flushing", "Transient BP increase"],
  },
  "6aa9fd75": {
    tagline: "Sermorelin — classic GHRH (1-29) for natural GH support.",
    whatIs:
      "Sermorelin is the first 29 amino acids of GHRH — the smallest fragment retaining full GHRH activity. The longest-used GHRH analog clinically, originally for pediatric GH deficiency and now studied in adult anti-aging.",
    benefits: [
      "Stimulates endogenous GH and IGF-1",
      "Preserves pulsatile feedback",
      "Improves sleep and recovery",
      "Long clinical safety record",
    ],
    stacksWith: ["Ipamorelin", "GHRP-2"],
  },
  "4a666b8b": {
    tagline: "HCG Choriomon — human chorionic gonadotropin for testicular and PCT research.",
    whatIs:
      "HCG mimics LH at the Leydig cell receptor, stimulating endogenous testosterone and intratesticular steroidogenesis. Choriomon is a pharmaceutical-grade preparation widely used in fertility, hypogonadism and post-cycle research.",
    benefits: [
      "Stimulates endogenous testosterone",
      "Preserves testicular volume on TRT",
      "Supports spermatogenesis",
      "Key tool in PCT protocols",
    ],
    protocol: "Research dosing: 250–500 IU SC, 2–3× weekly.",
    stacksWith: ["Kisspeptin", "Enclomiphene"],
  },
  "6587dd72": {
    tagline: "IGF-1 LR3 — long-arginine IGF-1 for muscle hyperplasia research.",
    whatIs:
      "IGF-1 LR3 is an 83-amino-acid analog of IGF-1 with an N-terminal extension that reduces binding to IGFBPs, extending half-life from ~20 minutes to ~20–30 hours and dramatically increasing free bioactivity.",
    benefits: [
      "Promotes muscle hyperplasia (cell number)",
      "Enhances nutrient partitioning",
      "Synergistic with GH protocols",
    ],
    protocol: "Research dosing: 20–50 mcg SC near target muscle, post-workout.",
    sideEffects: ["Hypoglycemia risk", "Injection-site swelling"],
  },
  "04317a6e": {
    tagline: "NMN — the most efficient injectable NAD+ precursor.",
    whatIs:
      "Nicotinamide Mononucleotide is the direct biosynthetic precursor to NAD+. Subcutaneous delivery bypasses oral bioavailability limitations, raising tissue NAD+ rapidly.",
    benefits: [
      "Rapid NAD+ restoration",
      "Supports sirtuin and PARP activity",
      "Improves muscle insulin sensitivity in trials",
      "Cardiovascular and cognitive support",
    ],
    stacksWith: ["Resveratrol", "Spermidine", "TMG"],
  },
  "21059df6": {
    tagline: "Curcumin injectable — bioavailable curcuminoid for inflammation research.",
    whatIs:
      "A research-grade injectable curcumin formulation bypassing curcumin's notoriously poor oral bioavailability. Studied for NF-κB modulation, joint inflammation and metabolic endpoints.",
    benefits: [
      "Modulates NF-κB and COX-2 inflammation",
      "Joint and tendon support",
      "Antioxidant and anti-fibrotic activity",
    ],
    stacksWith: ["BPC-157", "Glutathione"],
  },
};

const DEFAULT: ProductDescription = {
  tagline: "Research-grade peptide pen with batch-matched COA.",
  whatIs:
    "A pre-filled research pen delivered in cold-chain packaging. Each batch is third-party assayed for identity, purity and concentration. For in-vitro laboratory research only.",
  benefits: [
    "Pre-mixed, ready-to-use pen format",
    "≥99% purity by HPLC",
    "Batch-matched certificate of analysis",
    "Cold-chain shipping with temperature logging",
  ],
};

import { DEEP_DIVES } from "@/lib/product-deep-dives";

export function getDescription(id: string): ProductDescription {
  const base = D[id] ?? DEFAULT;
  // Prefer hand-authored deepDive (e.g. retatrutide). Otherwise fall back to scraped research library.
  if (base.deepDive && base.deepDive.length > 0) return base;
  const scraped = DEEP_DIVES[id];
  if (scraped && scraped.length > 0) return { ...base, deepDive: scraped };
  return base;
}
