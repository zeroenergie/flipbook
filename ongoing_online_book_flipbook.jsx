import React, { useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, BookOpenText, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Page Components ---
const PageShell = React.forwardRef(({ children, className = "" }, ref) => (
  <div ref={ref} className={`w-full h-full p-6 bg-white shadow-inner ${className}`}>
    <div className="prose prose-zinc max-w-none">{children}</div>
  </div>
));
PageShell.displayName = "PageShell";

const HardCover = React.forwardRef(({ title, subtitle }, ref) => (
  <div ref={ref} className="w-full h-full">
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
      />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1960&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"/>
      <div className="relative h-full w-full flex flex-col items-center justify-center text-center text-zinc-100 p-10">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow"
        >
          THE 22-YEAR ODYSSEY
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4 text-lg md:text-2xl opacity-90"
        >
          A living book — chapters of a life (0 → 22)
        </motion.p>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 inline-flex items-center gap-2 text-sm tracking-wider uppercase bg-white/10 px-4 py-2 rounded-2xl border border-white/20"
        >
          <BookOpenText className="h-4 w-4"/> Flip to begin
        </motion.div>
      </div>
    </div>
  </div>
));
HardCover.displayName = "HardCover";

const TableOfContents = React.forwardRef(({ chapters, onGoTo }, ref) => (
  <PageShell ref={ref} className="bg-zinc-50">
    <h2 className="!mt-0 flex items-center gap-2 text-zinc-800"><ListOrdered className="h-5 w-5"/> Contents</h2>
    <ol className="space-y-2">
      {chapters.map((c, idx) => (
        <li key={idx} className="flex items-start justify-between gap-4">
          <button
            onClick={() => onGoTo(idx)}
            className="text-left hover:underline text-zinc-900"
          >
            <span className="font-medium">{idx + 1}. {c.title}</span>
            <span className="block text-sm text-zinc-500">{c.tagline}</span>
          </button>
          <span className="text-zinc-400">{String(idx + 3).padStart(2, "0")}</span>
        </li>
      ))}
    </ol>
  </PageShell>
));
TableOfContents.displayName = "TableOfContents";

const ChapterPage = React.forwardRef(({ chapter }, ref) => (
  <PageShell ref={ref}>
    <h2 className="!mt-0">{chapter.title}</h2>
    {chapter.image && (
      <img
        src={chapter.image}
        alt={chapter.title}
        className="w-full h-52 object-cover rounded-2xl shadow mb-4"
      />
    )}
    {chapter.tagline && (
      <p className="text-zinc-500 italic -mt-2 mb-4">{chapter.tagline}</p>
    )}
    <p className="whitespace-pre-line leading-7">{chapter.content}</p>
  </PageShell>
));
ChapterPage.displayName = "ChapterPage";

const BackCover = React.forwardRef((props, ref) => (
  <div ref={ref} className="w-full h-full">
    <div className="relative h-full w-full bg-zinc-900 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]"/>
      <div className="relative h-full w-full p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-wide">About this ongoing book</h3>
          <p className="mt-2 text-zinc-300 max-w-prose">
            This book is designed to grow with you. Add chapters anytime, reorder them, and publish online.
          </p>
        </div>
        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} — Your Name. All rights reserved.</p>
      </div>
    </div>
  </div>
));
BackCover.displayName = "BackCover";

// --- Main App ---
export default function FlipBookApp() {
  const bookRef = useRef(null);
  const [chapters, setChapters] = useState(() => initialChapters());

  const [draft, setDraft] = useState({ title: "", tagline: "", image: "", content: "" });

  const goToPage = (pageIndex) => {
    // Cover (0), TOC (1), Chapters start at page 2
    const target = pageIndex + 2; // account for cover and TOC
    bookRef.current?.pageFlip().flip(target);
  };

  const addChapter = () => {
    if (!draft.title.trim()) return;
    setChapters((prev) => [...prev, { ...draft }]);
    setDraft({ title: "", tagline: "", image: "", content: "" });
    // Flip to the newly added chapter (last index)
    setTimeout(() => {
      const idx = chapters.length; // new chapter index
      goToPage(idx);
    }, 50);
  };

  const pages = useMemo(() => {
    return [
      { type: "cover" },
      { type: "toc" },
      ...chapters.map((c) => ({ type: "chapter", data: c })),
      { type: "back" },
    ];
  }, [chapters]);

  return (
    <div className="min-h-screen bg-zinc-100 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 text-zinc-100 grid place-content-center shadow">
              <BookOpenText className="h-5 w-5"/>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Ongoing Book</h1>
              <p className="text-sm text-zinc-500">Flip through chapters or add new ones anytime.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => bookRef.current?.pageFlip().flipPrev()} className="rounded-2xl">
              <ChevronLeft className="h-4 w-4 mr-1"/> Prev
            </Button>
            <Button onClick={() => bookRef.current?.pageFlip().flipNext()} className="rounded-2xl">
              Next <ChevronRight className="h-4 w-4 ml-1"/>
            </Button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Book */}
          <div className="md:col-span-2">
            <div className="rounded-2xl shadow-2xl p-3 bg-gradient-to-br from-zinc-200 to-zinc-50">
              <HTMLFlipBook
                width={420}
                height={560}
                size="stretch"
                minWidth={300}
                maxWidth={650}
                minHeight={400}
                maxHeight={900}
                drawShadow={true}
                flippingTime={700}
                usePortrait={true}
                startZIndex={2}
                autoSize={true}
                showCover={true}
                mobileScrollSupport={true}
                ref={bookRef}
                className="book rounded-lg"
              >
                {/* FRONT HARD COVER */}
                <div className="hard overflow-hidden rounded-lg border border-zinc-800">
                  <HardCover />
                </div>

                {/* TOC */}
                <div className="soft rounded-lg">
                  <TableOfContents chapters={chapters} onGoTo={(idx) => goToPage(idx)} />
                </div>

                {/* CHAPTERS */}
                {chapters.map((ch, i) => (
                  <div key={i} className="soft rounded-lg">
                    <ChapterPage chapter={ch} />
                  </div>
                ))}

                {/* BACK COVER */}
                <div className="hard overflow-hidden rounded-lg border border-zinc-800">
                  <BackCover />
                </div>
              </HTMLFlipBook>
            </div>
          </div>

          {/* Editor / Add Chapter */}
          <div className="bg-white rounded-2xl shadow-md p-4 sticky top-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Plus className="h-4 w-4"/> Add Chapter</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-zinc-600">Title</label>
                <Input placeholder="Chapter title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-zinc-600">Tagline (optional)</label>
                <Input placeholder="A short one-liner" value={draft.tagline} onChange={(e) => setDraft((d) => ({ ...d, tagline: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-zinc-600">Image URL (optional)</label>
                <Input placeholder="https://..." value={draft.image} onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-zinc-600">Content</label>
                <Textarea rows={6} placeholder="Write the chapter..." value={draft.content} onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))} />
              </div>
              <Button className="w-full rounded-2xl" onClick={addChapter}>Add to Book</Button>
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              Tip: You can press your keyboard's left/right arrows to flip pages on desktop.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sample Content: Life of a 22-year-old (up to now) ---
function initialChapters() {
  return [
    {
      title: "Childhood Echoes (0–5)",
      tagline: "Smells of monsoon, steel tiffin, crayons.",
      image:
        "https://images.unsplash.com/photo-1503457574462-bd27054394c1?q=80&w=1974&auto=format&fit=crop",
      content:
        "Memory arrives in flashes — the blue bucket on the terrace, the tinny ring of a bell from the street vendor, someone tying my shoelaces too tight. I learned that home is not the walls, it's the rituals: breakfast at the window, cartoons too early, the slow dignity of afternoon naps.",
    },
    {
      title: "First Internet Café (6–10)",
      tagline: "A rupee coin feeding a new universe.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1973&auto=format&fit=crop",
      content:
        "The dial-up song taught me patience. I typed with two fingers and a racing heart, discovering games that took five minutes to load and memories that wouldn’t. The café was cold, the screens bulky, and possibility felt infinite and fluorescent.",
    },
    {
      title: "Street Cricket Republic (10–13)",
      tagline: "One broken window, many broken rules.",
      image:
        "https://images.unsplash.com/photo-1606925797300-0f86d8c8ec2f?q=80&w=1936&auto=format&fit=crop",
      content:
        "We negotiated peace treaties about ‘one-hand catch’ and ‘last man bats’. The bat had a crack, the ball had more tape than leather, and yet the scoreboard in our heads was immaculate. Losing hurt for five minutes, winning lasted till dinner.",
    },
    {
      title: "High School Pivots (14–16)",
      tagline: "Trying on futures like thrift-store jackets.",
      image:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1974&auto=format&fit=crop",
      content:
        "I toggled between coder, musician, athlete, and a quiet kid who took good notes. Crushes became subplots, exams became cliffhangers. I learned that friendship is a shared silence as much as it is a shared playlist.",
    },
    {
      title: "Entrance Season (17)",
      tagline: "Coaching center lights never sleep.",
      image:
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1932&auto=format&fit=crop",
      content:
        "The city smelled like photocopies and chai. I measured days in mock tests and nights in doubts that grew fangs. Somewhere in the noise I learned how to fail politely and try again loudly.",
    },
    {
      title: "Hostel Physics & Maggi (18–19)",
      tagline: "2 AM noodles and borrowed notes.",
      image:
        "https://images.unsplash.com/photo-1529680459049-bf0340fa0755?q=80&w=1975&auto=format&fit=crop",
      content:
        "Hostel corridors were a symphony: laughter, pressure cookers, someone singing off-key. We traded formulas and life hacks. Money was tight, time was tighter, and Maggi was non-negotiable.",
    },
    {
      title: "Internship 001 (20)",
      tagline: "First ID card, first impostor syndrome.",
      image:
        "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1962&auto=format&fit=crop",
      content:
        "I learned how offices breathe — in meetings, out deadlines. Coffee became a verb. I discovered that asking a good question can be more useful than giving a half-right answer.",
    },
    {
      title: "Turning 21: The Quiet Upgrade",
      tagline: "No fireworks, just a firmware update.",
      image:
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1974&auto=format&fit=crop",
      content:
        "I didn’t become a different person; I became the same person with better backups. Fewer hot takes, more long walks. The appetite for risk stayed; the aim got steadier.",
    },
    {
      title: "Year 22: Building from Scraps",
      tagline: "Learning to ship, not just dream.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1974&auto=format&fit=crop",
      content:
        "I started stacking small wins: a project finished, a client replied, a morning routine kept. The future no longer feels like a cliff; it looks like steps I can climb if I keep showing up.",
    },
    {
      title: "Lessons So Far",
      tagline: "Five rules I actually use.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1974&auto=format&fit=crop",
      content:
        "(1) Start ugly. (2) Ask for help. (3) Sleep is a feature, not a bug. (4) Make next week easier for yourself. (5) Be kind in the comments — including the ones in your head.",
    },
    {
      title: "Road Ahead (Draft)",
      tagline: "Plans drawn in pencil, not ink.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop",
      content:
        "I’m collecting skills like tools: writing, building, selling, listening. The goal isn’t to predict the future — it’s to become someone who can handle it when it arrives.",
    },
  ];
}
