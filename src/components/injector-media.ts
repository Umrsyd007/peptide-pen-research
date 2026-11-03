// Rendered product imagery for the Needle-Free Injector page.
// Gallery images ship at 200 (thumbnail), 800 and 1600 px.
import heroL from "@/assets/injector/g1-hero-1600.webp";
import heroM from "@/assets/injector/g1-hero-800.webp";
import heroS from "@/assets/injector/g1-hero-200.webp";
import nozzleL from "@/assets/injector/g2-nozzle-1600.webp";
import nozzleM from "@/assets/injector/g2-nozzle-800.webp";
import nozzleS from "@/assets/injector/g2-nozzle-200.webp";
import profileL from "@/assets/injector/g3-profile-1600.webp";
import profileM from "@/assets/injector/g3-profile-800.webp";
import profileS from "@/assets/injector/g3-profile-200.webp";
import kitL from "@/assets/injector/g4-kit-1600.webp";
import kitM from "@/assets/injector/g4-kit-800.webp";
import kitS from "@/assets/injector/g4-kit-200.webp";
import twoL from "@/assets/injector/g5-twopack-1600.webp";
import twoM from "@/assets/injector/g5-twopack-800.webp";
import twoS from "@/assets/injector/g5-twopack-200.webp";
import pressL from "@/assets/injector/g6-press-1600.webp";
import pressM from "@/assets/injector/g6-press-800.webp";
import pressS from "@/assets/injector/g6-press-200.webp";
import stepLoad from "@/assets/injector/s1-load.webp";
import stepPlace from "@/assets/injector/s2-place.webp";
import anatomyL from "@/assets/injector/a-anatomy-1600.webp";
import anatomyM from "@/assets/injector/a-anatomy-1000.webp";
import navyL from "@/assets/injector/b-navy-1600.webp";
import navyM from "@/assets/injector/b-navy-900.webp";

export interface GalleryImage {
  large: string;
  medium: string;
  thumb: string;
  alt: string;
}

export const GALLERY: GalleryImage[] = [
  { large: heroL, medium: heroM, thumb: heroS, alt: "Needle-Free Injector, three-quarter view" },
  { large: nozzleL, medium: nozzleM, thumb: nozzleS, alt: "Close-up of the clear single-use nozzle on the front cap" },
  { large: profileL, medium: profileM, thumb: profileS, alt: "Side view showing the release button and grip" },
  { large: kitL, medium: kitM, thumb: kitS, alt: "The kit: injector in its case, sterile nozzles, adapters, reset tool and quick-start guide" },
  { large: twoL, medium: twoM, thumb: twoS, alt: "Two injectors, as in the 2-Pack" },
  { large: pressL, medium: pressM, thumb: pressS, alt: "Injector tip held flat against skin with the release button pressed" },
];

export const IMG = {
  hero: { large: heroL, medium: heroM },
  twoPack: { large: twoL, medium: twoM },
  kit: { large: kitL, medium: kitM },
  steps: [stepLoad, stepPlace, pressM],
  anatomy: { large: anatomyL, medium: anatomyM },
  navy: { large: navyL, medium: navyM },
};

/** Projected positions of each part in the anatomy render (fractions of width/height). */
export const ANATOMY_ANCHORS = {
  nozzle: [0.1699, 0.4981],
  frontCap: [0.267, 0.4981],
  button: [0.5483, 0.4025],
  grip: [0.656, 0.6438],
  rearCap: [0.8107, 0.4981],
} as const;

export const OG_IMAGE = "https://getpeptidepen.com/og/needle-free-injector.jpg";
