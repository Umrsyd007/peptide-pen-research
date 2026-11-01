import { useState } from "react";
import type { ProductImage } from "@/lib/product-images";

/** The parent keys this gallery by product and SKU so a new variant shows its cover. */
export function ProductGallery({ images }: { images: readonly ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];
  if (!active) return null;

  return (
    <div className="space-y-4" role="group" aria-label="Product photos">
      <div className="aspect-square w-full rounded-2xl border border-border bg-white overflow-hidden flex items-center justify-center">
        <img
          key={active.src}
          src={active.src}
          alt={active.alt}
          width={active.width}
          height={active.height}
          loading="eager"
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          decoding="async"
          className="w-full h-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3" aria-label="Choose a product photo">
          {images.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Show image ${index + 1} of ${images.length}: ${photo.alt}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`aspect-square rounded-xl border-2 bg-white overflow-hidden flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${index === activeIndex ? "border-primary" : "border-border hover:border-primary/40"}`}
            >
              <img
                src={photo.src}
                alt=""
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Image {activeIndex + 1} of {images.length}: {active.alt}
      </p>
    </div>
  );
}
