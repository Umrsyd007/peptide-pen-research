import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * How-to video source. Set type to "youtube" (paste a YouTube link) or
 * "file" (an uploaded video URL). Leave src empty to show a placeholder.
 */
const VIDEO: { type: "youtube" | "file"; src: string; thumbnail?: string; uploadDate?: string } = {
  type: "youtube",
  src: "",
};

const TITLE = "How to Use Peptide Pen | Step-by-Step Video Guide";
const DESCRIPTION =
  "Learn how to use your Peptide Pen with our step-by-step video guide: unboxing, attaching the needle, priming, setting the dose, injecting and storing your pen.";
const URL = "https://getpeptidepen.com/how-to-use-peptide-pen";

// DRAFT steps — general handling only; replace with the wording from the printed manual.
const STEPS = [
  { name: "Wash your hands and check the pen", text: "Wash your hands. Check the pen label, expiry date and that the contents look clear." },
  { name: "Attach a new needle", text: "Remove the paper tab from a new pen needle and screw it straight onto the pen. Remove the outer and inner needle caps." },
  { name: "Prime the pen", text: "Dial a small priming amount, hold the pen needle-up, tap gently and press the button until a drop appears at the needle tip." },
  { name: "Set your dose", text: "Turn the dose selector to the amount stated in your instructions." },
  { name: "Inject", text: "Insert the needle into clean skin, press the button fully and hold for about 10 seconds before removing." },
  { name: "Remove the needle and store the pen", text: "Recap and remove the needle, dispose of it safely, replace the pen cap and store the pen as directed in your manual." },
];

function youtubeId(src: string) {
  const m = src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

function ldScripts() {
  const ytId = VIDEO.type === "youtube" ? youtubeId(VIDEO.src) : null;
  const hasVideo = VIDEO.type === "file" ? !!VIDEO.src : !!ytId;
  const scripts: { type: string; children: string }[] = [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to use Peptide Pen",
        description: DESCRIPTION,
        step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, url: `${URL}#step-${i + 1}` })),
      }),
    },
  ];
  if (hasVideo) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: "How to use Peptide Pen",
        description: DESCRIPTION,
        thumbnailUrl: VIDEO.thumbnail ?? (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined),
        uploadDate: VIDEO.uploadDate ?? "2026-11-12",
        ...(ytId ? { embedUrl: `https://www.youtube.com/embed/${ytId}` } : { contentUrl: VIDEO.src }),
      }),
    });
  }
  return scripts;
}

export const Route = createFileRoute("/how-to-use-peptide-pen")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow,max-video-preview:-1" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: ldScripts(),
  }),
  component: HowToPage,
});

function VideoPlayer() {
  const ytId = VIDEO.type === "youtube" ? youtubeId(VIDEO.src) : null;
  if (ytId) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
        title="How to use Peptide Pen video"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  }
  if (VIDEO.type === "file" && VIDEO.src) {
    return (
      <video className="h-full w-full" src={VIDEO.src} poster={VIDEO.thumbnail} controls playsInline preload="metadata">
        Your browser does not support video playback.
      </video>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-muted-foreground">Video coming soon</div>
  );
}

function HowToPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">How to Use Peptide Pen</h1>
      <p className="mt-3 text-muted-foreground">
        Watch the video, then follow the written steps below. Always follow the instructions printed in your manual.
      </p>
      <div className="mt-6 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
        <VideoPlayer />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Step-by-step instructions</h2>
        <ol className="mt-4 space-y-5">
          {STEPS.map((s, i) => (
            <li key={s.name} id={`step-${i + 1}`} className="rounded-lg border border-border p-4">
              <h3 className="font-medium">
                Step {i + 1}: {s.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Storage and safety</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use a new needle each time and never share your pen. Store it as described in your manual, away from direct
          heat and sunlight. Questions? <Link to="/contact" className="underline">Contact us</Link>.
        </p>
      </section>
      <div className="mt-10">
        <Link to="/products" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Shop Peptide Pen
        </Link>
      </div>
    </main>
  );
}
