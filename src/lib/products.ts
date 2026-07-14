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
  { id: "72d3cbf2", name: "AC-Selank-nH2", categories: "Cognitive & Neuro • Cellular Longevity", price: "$126.44", tag: "NEW" , image: "/__l5e/assets-v1/434b906a-7615-4b61-a745-b343bcf8deb5/72d3cbf2.png" },
  { id: "d2a5603b", name: "KPV Peptide (Nasal Spray)", categories: "Cellular Longevity • Immune & Inflammation", price: "$97.44", tag: "NEW" , image: "/__l5e/assets-v1/b815d774-9df8-4296-9363-f568c59bc388/d2a5603b.png" },
  { id: "68831782", name: "SS-31 (Elamipretide)", categories: "Cellular Longevity +2", price: "$223.88", tag: "NEW" , image: "/__l5e/assets-v1/5975af56-caae-4b16-907e-3c7fc4adda1c/68831782.png" },
  { id: "f5aa4333", name: "Tesamorelin", categories: "Cellular Longevity +2", price: "$162.40", tag: "NEW" , image: "/__l5e/assets-v1/2239e7fa-8e6f-404a-9f67-cb67a5a23478/f5aa4333.png" },
  { id: "591b5bd3", name: "Kisspeptin", categories: "Hormonal & Reproductive", price: "$110.20", tag: "NEW" , image: "/__l5e/assets-v1/7a5fed47-908c-4d5d-9fca-94e6a39cee0d/591b5bd3.png" },
  { id: "c89a10d5", name: "CJC 1295 no Dac + Ipamorelin", categories: "Cellular Longevity • Muscle & Recovery", price: "$146.16", tag: "NEW" , image: "/__l5e/assets-v1/0f42e533-fa08-4948-ab66-234388a6b6a8/c89a10d5.png" },
  { id: "e6a824f0", name: "Thymosin Alpha-1", categories: "Cellular Longevity • Immune & Inflammation", price: "$146.16", tag: "NEW" , image: "/__l5e/assets-v1/e78548b2-b3c8-4ec8-a7d5-057dca82d4d8/e6a824f0.png" },
  { id: "821f7789", name: "Thymalin", categories: "Cellular Longevity • Immune & Inflammation", price: "$100.92", tag: "NEW" , image: "/__l5e/assets-v1/488e2efa-9c7b-41df-ada7-bcd0c4a96669/821f7789.png" },
  { id: "a973f518", name: "SLU-PP-332", categories: "Cognitive & Neuro", price: "$145.00", tag: "NEW" , image: "/__l5e/assets-v1/ed485362-4f95-44fc-925b-ce0149f4acc7/a973f518.png" },
  { id: "aff029b8", name: "Ipamorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$74.24", tag: "BESTSELLER" , image: "/__l5e/assets-v1/6c4f537d-5f51-4cd7-a88b-77401c6bb96c/aff029b8.png" },
  { id: "e794817e", name: "BPC-157", categories: "Muscle & Recovery", price: "$96.28", tag: "BESTSELLER" , image: "/__l5e/assets-v1/0b941693-5b49-4141-a42c-b3151269c7fe/e794817e.png" },
  { id: "08f6ee52", name: "Retatrutide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$307.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/7c637d58-c76e-4ddd-b830-9f83ca801425/08f6ee52.png" },
  { id: "46f6d800", name: "Melanotan II", categories: "Aesthetics & Regenerative • Hormonal & Reproductive", price: "$88.16", tag: "BESTSELLER" , image: "/__l5e/assets-v1/df75f675-22f7-44b1-8ea6-ddca7203073e/46f6d800.png" },
  { id: "3afd37de", name: "Skin Glow (GHK-Cu) (Standard Pen)", categories: "Aesthetics & Regenerative", price: "$107.88", tag: "BESTSELLER" , image: "/__l5e/assets-v1/2ff6d675-8bf4-442c-9e11-02e65244c3f0/3afd37de.png" },
  { id: "cd1d9cc4", name: "Somatropin HGH", categories: "Muscle & Recovery", price: "$133.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/df13ab50-e67e-404c-88dd-c398c10c682f/cd1d9cc4.png" },
  { id: "9a7347e7", name: "TB 500 (Thymosin beta 4)", categories: "Muscle & Recovery • Aesthetics & Regenerative", price: "$97.44", tag: "BESTSELLER" , image: "/__l5e/assets-v1/4bc43ec5-a6c0-47f6-8275-1f052b1c2f8a/9a7347e7.png" },
  { id: "eca4f03d", name: "BPC-157 + TB-500", categories: "Cellular Longevity +2", price: "$170.52", tag: "BESTSELLER" , image: "/__l5e/assets-v1/8e12efda-f53d-4c3a-bedd-2c6fb48ae415/eca4f03d.png" },
  { id: "1691332d", name: "Epitalon", categories: "Cellular Longevity • Aesthetics & Regenerative", price: "$99.76", tag: "BESTSELLER" , image: "/__l5e/assets-v1/f094c2a8-39e4-4305-9897-c9f818caf33c/1691332d.png" },
  { id: "c777ccf6", name: "Spermidine", categories: "Cognitive & Neuro • Cellular Longevity", price: "$99.76", tag: "BESTSELLER" , image: "/__l5e/assets-v1/454ad424-f967-4d72-9f05-4f1c7688572c/c777ccf6.png" },
  { id: "b8597fa0", name: "MOTS-c (Standard Pen)", categories: "Cellular Longevity • Metabolic & Fat Optimization", price: "$104.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/8b86d926-6fa3-415b-a439-7581e289d6c3/b8597fa0.png" },
  { id: "ad69b7ac", name: "Glutathione, NAD+ & Resveratrol", categories: "Cognitive & Neuro +2", price: "$276.08", tag: "BESTSELLER" , image: "/__l5e/assets-v1/f12ce240-42b5-446a-8fa2-51e4322c7c4a/ad69b7ac.png" },
  { id: "7389ae0d", name: "Vitality Complex (Glutathione + NMN + Resveratrol)", categories: "Cellular Longevity", price: "$295.80", tag: "BESTSELLER" , image: "/__l5e/assets-v1/b9e43deb-4373-4a85-a752-3e44aa5ae7bc/7389ae0d.png" },
  { id: "474ae481", name: "Delta-Sleep-Inducing Peptide", categories: "Cognitive & Neuro", price: "$133.40", tag: "BESTSELLER" , image: "/__l5e/assets-v1/a28d34c1-7d9a-4e8b-a9f5-8e722ec3fe07/474ae481.png" },
  { id: "322e88af", name: "Semaglutide (Standard Pen)", categories: "Aesthetics & Regenerative • Metabolic & Fat Optimization", price: "$153.12", tag: "BESTSELLER" , image: "/__l5e/assets-v1/965015d3-fcc3-4eaa-b010-4896500ebc1b/322e88af.png" },
  { id: "c1680f7a", name: "HGH Fragment (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$80.04", tag: null , image: "/__l5e/assets-v1/fa93a304-7f3f-4c3b-ae26-335cbc133e2e/c1680f7a.png" },
  { id: "65df5f32", name: "CJC 1295 (no dac)", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$97.44", tag: null , image: "/__l5e/assets-v1/e728236e-2502-4042-9942-5589593048f8/65df5f32.png" },
  { id: "1b0959b6", name: "Tirzepatide (Standard Pen)", categories: "Metabolic & Fat Optimization", price: "$174.00", tag: null , image: "/__l5e/assets-v1/d686d7c1-56e1-4cae-abfe-3fe084a85a34/1b0959b6.png" },
  { id: "080bb4c4", name: "NAD+ (Nicotinamide)", categories: "Cognitive & Neuro +2", price: "$366.56", tag: null , image: "/__l5e/assets-v1/e8283c99-0372-4cae-bc4c-1467202ee469/080bb4c4.png" },
  { id: "357579fd", name: "PT 141 (Bremelanotide)", categories: "Hormonal & Reproductive", price: "$97.44", tag: null , image: "/__l5e/assets-v1/8bdce692-3960-414e-a6a5-681bf3e04ad1/357579fd.png" },
  { id: "6aa9fd75", name: "Sermorelin", categories: "Muscle & Recovery • Metabolic & Fat Optimization", price: "$124.12", tag: null , image: "/__l5e/assets-v1/81e3b92e-cae6-4a7c-bbce-855bbe0f8542/6aa9fd75.png" },
  { id: "4a666b8b", name: "HCG Choriomon (Standard Pen)", categories: "Hormonal & Reproductive", price: "$61.48", tag: null , image: "/__l5e/assets-v1/a6192d47-c0e0-4bca-b899-d0d265e9634d/4a666b8b.png" },
  { id: "6587dd72", name: "IGF-1LR3", categories: "Muscle & Recovery", price: "$141.52", tag: null , image: "/__l5e/assets-v1/77ad356b-1af0-4b2d-a84a-cf72539ab487/6587dd72.png" },
  { id: "04317a6e", name: "NMN (Nicotinamide Mononucleotide)", categories: "Cognitive & Neuro • Cellular Longevity", price: "$145.00", tag: null , image: "/__l5e/assets-v1/54f18cbd-73e1-4c3f-a8ac-515253921174/04317a6e.png" },
  { id: "21059df6", name: "Curcumin", categories: "Cognitive & Neuro • Cellular Longevity", price: "$149.64", tag: null , image: "/__l5e/assets-v1/00c31390-f8af-4c06-a63f-951c86f7a545/21059df6.png" },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
