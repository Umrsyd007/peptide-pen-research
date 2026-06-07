export type Tag = "NEW" | "BESTSELLER" | null;

export interface Product {
  id: string;
  name: string;
  categories: string;
  price: string;
  tag: Tag;
  image: string;
}

export const PRODUCTS: Product[] = [
  { id: "72d3cbf2", name: "AC-Selank-nH2", categories: "Cognitive & Neuro • Cellular Longevity", price: "$126.44", tag: "NEW" , image: "/__l5e/assets-v1/e4032b9d-68c7-4f49-85e5-0c8f5dc27065/72d3cbf2.png" },
  { id: "5696aeb5", name: "Glutathione + Methylene Blue", categories: "Cellular Longevity", price: "$220.40", tag: "NEW" , image: "/__l5e/assets-v1/8092e1f5-a87d-474e-aa2c-0fb583712503/5696aeb5.png" },
  { id: "eaee73bb", name: "Microbiome Test", categories: "Cognitive & Neuro +6", price: "$406.00", tag: "NEW" , image: "/__l5e/assets-v1/b8cc8e64-43e0-4a57-8f4d-d16cb7d75984/eaee73bb.png" },
  { id: "d2a5603b", name: "KPV Peptide (Nasal Spray)", categories: "Cellular Longevity • Immune & Inflammation", price: "$97.44", tag: "NEW" , image: "/__l5e/assets-v1/6ba045d5-1a9f-4929-a8e4-f9376771880e/d2a5603b.png" },
  { id: "75eaa7ac", name: "Melanotan 2 (Nasal Spray)", categories: "Cognitive & Neuro • Aesthetics & Regenerative", price: "$81.20", tag: "NEW" , image: "/__l5e/assets-v1/c903b7c8-fe9b-497c-a606-32cd0ef2d3a3/75eaa7ac.png" },
  { id: "db401164", name: "Nootropic P21 (Nasal Spray)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$142.68", tag: "NEW" , image: "/__l5e/assets-v1/93c07578-5279-487c-a486-d8f4051eec4e/db401164.png" },
  { id: "68831782", name: "SS-31 (Elamipretide)", categories: "Cellular Longevity +2", price: "$223.88", tag: "NEW" , image: "/__l5e/assets-v1/e903d6c4-d071-4af4-ba86-4d0f4c2c7c21/68831782.png" },
  { id: "f5aa4333", name: "Tesamorelin", categories: "Cellular Longevity +2", price: "$162.40", tag: "NEW" , image: "/__l5e/assets-v1/2466bf4d-290f-4967-97ca-2d7eb57396d3/f5aa4333.png" },
  { id: "591b5bd3", name: "Kisspeptin", categories: "Hormonal & Reproductive", price: "$110.20", tag: "NEW" , image: "/__l5e/assets-v1/66a38522-e82c-400c-b7bb-213d006ddb61/591b5bd3.png" },
  { id: "c89a10d5", name: "CJC 1295 no Dac + Ipamorelin", categories: "Cellular Longevity • Muscle & Recovery", price: "$146.16", tag: "NEW" , image: "/__l5e/assets-v1/55643998-dbdd-4a64-a411-30586724d273/c89a10d5.png" },
  { id: "e6a824f0", name: "Thymosin Alpha-1", categories: "Cellular Longevity • Immune & Inflammation", price: "$146.16", tag: "NEW" , image: "/__l5e/assets-v1/81e83dd4-d864-47fe-99a5-44dd9f16f1af/e6a824f0.png" },
  { id: "821f7789", name: "Thymalin", categories: "Cellular Longevity • Immune & Inflammation", price: "$100.92", tag: "NEW" , image: "/__l5e/assets-v1/71f8f245-9c31-4ad5-ac5f-16ef192c4e42/821f7789.png" },
  { id: "a973f518", name: "SLU-PP-332", categories: "Cognitive & Neuro", price: "$145.00", tag: "NEW" , image: "/__l5e/assets-v1/6a852994-7fcc-4e3c-91a6-45818cae1ae9/a973f518.png" },
  { id: "f2a12dcf", name: "Specialized Wellness Consultation", categories: "Cognitive & Neuro +7", price: "$174.00", tag: "NEW" , image: "/__l5e/assets-v1/ba9788a8-ec97-4692-a4fd-c8de3ea14a70/f2a12dcf.jpg" },
  { id: "f76b7c74", name: "Personalized Gut Optimization Protocol", categories: "Cognitive & Neuro +6", price: "$812.00", tag: "NEW" , image: "/__l5e/assets-v1/e200167e-ed2d-4120-91dd-895a91e7d1a7/f76b7c74.png" },
  { id: "94badb0f", name: "DNA Test", categories: "Cognitive & Neuro +7", price: "$464.00", tag: "NEW" , image: "/__l5e/assets-v1/657285c1-2151-4452-823c-26d9078689d7/94badb0f.png" },
  { id: "aff029b8", name: "Ipamorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$74.24", tag: "BESTSELLER" , image: "/__l5e/assets-v1/16fd88b9-7056-4321-bc48-24cd4c04f9c0/aff029b8.png" },
  { id: "e794817e", name: "BPC-157", categories: "Muscle & Recovery", price: "$96.28", tag: "BESTSELLER" , image: "/__l5e/assets-v1/aea7a686-4e08-4473-94a4-a8dccf26502c/e794817e.png" },
  { id: "08f6ee52", name: "Retatrutide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$307.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/bdcf7716-dbb0-4bfa-bab1-b64d01f7ce44/08f6ee52.png" },
  { id: "46f6d800", name: "Melanotan II", categories: "Aesthetics & Regenerative • Hormonal & Reproductive", price: "$88.16", tag: "BESTSELLER" , image: "/__l5e/assets-v1/7965c842-2abd-482e-a19b-b8585d10b15d/46f6d800.png" },
  { id: "3afd37de", name: "Skin Glow (GHK-Cu) (Standard Pen)", categories: "Aesthetics & Regenerative", price: "$107.88", tag: "BESTSELLER" , image: "/__l5e/assets-v1/6b98990b-5897-467b-ad0a-986d0419b570/3afd37de.png" },
  { id: "cd1d9cc4", name: "Somatropin HGH", categories: "Muscle & Recovery", price: "$133.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/aa2443d4-179d-46bf-b29e-059cdf495676/cd1d9cc4.png" },
  { id: "9a7347e7", name: "TB 500 (Thymosin beta 4)", categories: "Muscle & Recovery • Aesthetics & Regenerative", price: "$97.44", tag: "BESTSELLER" , image: "/__l5e/assets-v1/2982e69b-1586-4541-8acb-0dcad12701b7/9a7347e7.png" },
  { id: "eca4f03d", name: "BPC-157 + TB-500", categories: "Cellular Longevity +2", price: "$170.52", tag: "BESTSELLER" , image: "/__l5e/assets-v1/dbe016bd-e65d-4f45-99ed-e63e443e8e73/eca4f03d.png" },
  { id: "1691332d", name: "Epitalon", categories: "Cellular Longevity • Aesthetics & Regenerative", price: "$99.76", tag: "BESTSELLER" , image: "/__l5e/assets-v1/5def8863-9dc3-4f28-a827-0385989df27f/1691332d.png" },
  { id: "c777ccf6", name: "Spermidine", categories: "Cognitive & Neuro • Cellular Longevity", price: "$99.76", tag: "BESTSELLER" , image: "/__l5e/assets-v1/464c8878-a79c-44ac-8c63-5f48997ee373/c777ccf6.png" },
  { id: "b8597fa0", name: "MOTS-c (Standard Pen)", categories: "Cellular Longevity • Metabolic & Fat Optimization", price: "$104.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/85c9e17c-63d4-40a4-8d6d-05e029d4ef49/b8597fa0.png" },
  { id: "ad69b7ac", name: "Glutathione, NAD+ & Resveratrol", categories: "Cognitive & Neuro +2", price: "$276.08", tag: "BESTSELLER" , image: "/__l5e/assets-v1/5c1977a7-258b-4a9f-b354-b4d0b82c10aa/ad69b7ac.png" },
  { id: "7389ae0d", name: "Vitality Complex (Glutathione + NMN + Resveratrol)", categories: "Cellular Longevity", price: "$295.80", tag: "BESTSELLER" , image: "/__l5e/assets-v1/5aa4c884-6a0e-4ea8-9e46-2dc2ecceb5bc/7389ae0d.png" },
  { id: "474ae481", name: "Delta-Sleep-Inducing Peptide", categories: "Cognitive & Neuro", price: "$133.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/63ef2b74-35bf-423e-b9ef-ad5040b530ed/474ae481.png" },
  { id: "322e88af", name: "Semaglutide (Standard Pen)", categories: "Aesthetics & Regenerative • Metabolic & Fat Optimization", price: "$153.12", tag: "BESTSELLER" , image: "/__l5e/assets-v1/c3355bdb-7e93-45cd-9824-e801204d78cd/322e88af.png" },
  { id: "c1680f7a", name: "HGH Fragment (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$80.04", tag: null , image: "/__l5e/assets-v1/528a7afe-7fba-4a3e-94a1-3b98a7b5d5e0/c1680f7a.png" },
  { id: "65df5f32", name: "CJC 1295 (no dac)", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$97.44", tag: null , image: "/__l5e/assets-v1/a3e56e27-48eb-4692-ab62-01a15cdeec84/65df5f32.png" },
  { id: "1b0959b6", name: "Tirzepatide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$174.00", tag: null , image: "/__l5e/assets-v1/4b70368f-ca12-4c2e-8e32-5896c151b353/1b0959b6.png" },
  { id: "f386281f", name: "5-Amino-1MQ", categories: "Cognitive & Neuro • Metabolic & Fat Optimization", price: "$107.88", tag: null , image: "/__l5e/assets-v1/2b931f92-117b-4b7e-9b0d-bc13cb7049e8/f386281f.png" },
  { id: "080bb4c4", name: "NAD+ (Nicotinamide)", categories: "Cognitive & Neuro +2", price: "$366.56", tag: null , image: "/__l5e/assets-v1/6194fe7f-e4ea-4094-878a-4f9b857d3244/080bb4c4.png" },
  { id: "357579fd", name: "PT 141 (Bremelanotide)", categories: "Hormonal & Reproductive", price: "$97.44", tag: null , image: "/__l5e/assets-v1/322ce90f-7dfc-4e60-8c9e-951dcd2e10cc/357579fd.png" },
  { id: "6aa9fd75", name: "Sermorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$124.12", tag: null , image: "/__l5e/assets-v1/dc0e722f-537e-4f8c-9713-1b1a6cb957ec/6aa9fd75.png" },
  { id: "4a666b8b", name: "HCG Choriomon (Standard Pen)", categories: "Hormonal & Reproductive", price: "$61.48", tag: null , image: "/__l5e/assets-v1/4635aaab-ec68-4c63-b033-152fdeccb2f3/4a666b8b.png" },
  { id: "6587dd72", name: "IGF-1LR3", categories: "Muscle & Recovery", price: "$141.52", tag: null , image: "/__l5e/assets-v1/364855ef-5e31-4dad-9c4e-be0e4b39e362/6587dd72.png" },
  { id: "04317a6e", name: "NMN (Nicotinamide Mononucleotide)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$145.00", tag: null , image: "/__l5e/assets-v1/eb9ed7f9-5ac4-43fb-b318-160517792be0/04317a6e.png" },
  { id: "21059df6", name: "Curcumin", categories: "Cognitive & Neuro • Cellular Longevity", price: "$149.64", tag: null , image: "/__l5e/assets-v1/b0268b1b-2189-44b0-ace0-ea472a7f6613/21059df6.png" },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
