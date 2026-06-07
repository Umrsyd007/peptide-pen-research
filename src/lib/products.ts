export type Tag = "NEW" | "BESTSELLER" | null;

export interface Product {
  id: string;
  name: string;
  categories: string;
  price: string;
  tag: Tag;
}

export const PRODUCTS: Product[] = [
  { id: "72d3cbf2", name: "AC-Selank-nH2", categories: "Cognitive & Neuro • Cellular Longevity", price: "$126.44", tag: "NEW" },
  { id: "5696aeb5", name: "Glutathione + Methylene Blue", categories: "Cellular Longevity", price: "$220.40", tag: "NEW" },
  { id: "eaee73bb", name: "Microbiome Test", categories: "Cognitive & Neuro +6", price: "$406.00", tag: "NEW" },
  { id: "d2a5603b", name: "KPV Peptide (Nasal Spray)", categories: "Cellular Longevity • Immune & Inflammation", price: "$97.44", tag: "NEW" },
  { id: "75eaa7ac", name: "Melanotan 2 (Nasal Spray)", categories: "Cognitive & Neuro • Aesthetics & Regenerative", price: "$81.20", tag: "NEW" },
  { id: "db401164", name: "Nootropic P21 (Nasal Spray)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$142.68", tag: "NEW" },
  { id: "68831782", name: "SS-31 (Elamipretide)", categories: "Cellular Longevity +2", price: "$223.88", tag: "NEW" },
  { id: "f5aa4333", name: "Tesamorelin", categories: "Cellular Longevity +2", price: "$162.40", tag: "NEW" },
  { id: "591b5bd3", name: "Kisspeptin", categories: "Hormonal & Reproductive", price: "$110.20", tag: "NEW" },
  { id: "c89a10d5", name: "CJC 1295 no Dac + Ipamorelin", categories: "Cellular Longevity • Muscle & Recovery", price: "$146.16", tag: "NEW" },
  { id: "e6a824f0", name: "Thymosin Alpha-1", categories: "Cellular Longevity • Immune & Inflammation", price: "$146.16", tag: "NEW" },
  { id: "821f7789", name: "Thymalin", categories: "Cellular Longevity • Immune & Inflammation", price: "$100.92", tag: "NEW" },
  { id: "a973f518", name: "SLU-PP-332", categories: "Cognitive & Neuro", price: "$145.00", tag: "NEW" },
  { id: "f2a12dcf", name: "Specialized Wellness Consultation", categories: "Cognitive & Neuro +7", price: "$174.00", tag: "NEW" },
  { id: "f76b7c74", name: "Personalized Gut Optimization Protocol", categories: "Cognitive & Neuro +6", price: "$812.00", tag: "NEW" },
  { id: "94badb0f", name: "DNA Test", categories: "Cognitive & Neuro +7", price: "$464.00", tag: "NEW" },
  { id: "aff029b8", name: "Ipamorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$74.24", tag: "BESTSELLER" },
  { id: "e794817e", name: "BPC-157", categories: "Muscle & Recovery", price: "$96.28", tag: "BESTSELLER" },
  { id: "08f6ee52", name: "Retatrutide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$307.40", tag: "BESTSELLER" },
  { id: "46f6d800", name: "Melanotan II", categories: "Aesthetics & Regenerative • Hormonal & Reproductive", price: "$88.16", tag: "BESTSELLER" },
  { id: "3afd37de", name: "Skin Glow (GHK-Cu) (Standard Pen)", categories: "Aesthetics & Regenerative", price: "$107.88", tag: "BESTSELLER" },
  { id: "cd1d9cc4", name: "Somatropin HGH", categories: "Muscle & Recovery", price: "$133.40", tag: "BESTSELLER" },
  { id: "9a7347e7", name: "TB 500 (Thymosin beta 4)", categories: "Muscle & Recovery • Aesthetics & Regenerative", price: "$97.44", tag: "BESTSELLER" },
  { id: "eca4f03d", name: "BPC-157 + TB-500", categories: "Cellular Longevity +2", price: "$170.52", tag: "BESTSELLER" },
  { id: "1691332d", name: "Epitalon", categories: "Cellular Longevity • Aesthetics & Regenerative", price: "$99.76", tag: "BESTSELLER" },
  { id: "c777ccf6", name: "Spermidine", categories: "Cognitive & Neuro • Cellular Longevity", price: "$99.76", tag: "BESTSELLER" },
  { id: "b8597fa0", name: "MOTS-c (Standard Pen)", categories: "Cellular Longevity • Metabolic & Fat Optimization", price: "$104.40", tag: "BESTSELLER" },
  { id: "ad69b7ac", name: "Glutathione, NAD+ & Resveratrol", categories: "Cognitive & Neuro +2", price: "$276.08", tag: "BESTSELLER" },
  { id: "7389ae0d", name: "Vitality Complex (Glutathione + NMN + Resveratrol)", categories: "Cellular Longevity", price: "$295.80", tag: "BESTSELLER" },
  { id: "474ae481", name: "Delta-Sleep-Inducing Peptide", categories: "Cognitive & Neuro", price: "$133.40", tag: "BESTSELLER" },
  { id: "322e88af", name: "Semaglutide (Standard Pen)", categories: "Aesthetics & Regenerative • Metabolic & Fat Optimization", price: "$153.12", tag: "BESTSELLER" },
  { id: "c1680f7a", name: "HGH Fragment (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$80.04", tag: null },
  { id: "65df5f32", name: "CJC 1295 (no dac)", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$97.44", tag: null },
  { id: "1b0959b6", name: "Tirzepatide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$174.00", tag: null },
  { id: "f386281f", name: "5-Amino-1MQ", categories: "Cognitive & Neuro • Metabolic & Fat Optimization", price: "$107.88", tag: null },
  { id: "080bb4c4", name: "NAD+ (Nicotinamide)", categories: "Cognitive & Neuro +2", price: "$366.56", tag: null },
  { id: "357579fd", name: "PT 141 (Bremelanotide)", categories: "Hormonal & Reproductive", price: "$97.44", tag: null },
  { id: "6aa9fd75", name: "Sermorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$124.12", tag: null },
  { id: "4a666b8b", name: "HCG Choriomon (Standard Pen)", categories: "Hormonal & Reproductive", price: "$61.48", tag: null },
  { id: "6587dd72", name: "IGF-1LR3", categories: "Muscle & Recovery", price: "$141.52", tag: null },
  { id: "04317a6e", name: "NMN (Nicotinamide Mononucleotide)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$145.00", tag: null },
  { id: "21059df6", name: "Curcumin", categories: "Cognitive & Neuro • Cellular Longevity", price: "$149.64", tag: null },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
