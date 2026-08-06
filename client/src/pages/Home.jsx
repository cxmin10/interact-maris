import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import StarfieldBackground from "../components/StarfieldBackground";

const projects = [
  {
    number: "01",
    category: "Comunitate",
    title: "Proiecte cu impact local",
    description:
      "Construim inițiative care răspund nevoilor reale ale comunității și aduc oamenii împreună.",
  },
  {
    number: "02",
    category: "Leadership",
    title: "Dezvoltarea tinerilor",
    description:
      "Învățăm să coordonăm echipe, să comunicăm și să transformăm ideile în proiecte concrete.",
  },
  {
    number: "03",
    category: "Voluntariat",
    title: "Implicare și prietenie",
    description:
      "Fiecare activitate este o oportunitate de a ajuta, de a învăța și de a crea legături autentice.",
  },
];


const reveal = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  function handleMove(event) {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;

    element.style.transform =
      `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }

  function resetTilt() {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const heroRef = useRef(null);
  const storyRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });

  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1.05, 1.2]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const storyImageY = useTransform(storyProgress, [0, 1], [-90, 90]);
  const storyTextY = useTransform(storyProgress, [0, 1], [90, -40]);
  const orbitRotate = useTransform(smoothProgress, [0, 1], [0, 220]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative overflow-hidden bg-[#f4f1eb] text-[#121212]">
      <StarfieldBackground />
      <motion.div
        className="fixed left-0 top-0 z-[120] h-1 bg-[#f7c948]"
        style={{ scaleX: smoothProgress, transformOrigin: "0%" }}
      />

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#07172f]/88 shadow-2xl backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-12">
          <Link to="/" className="flex items-center gap-3 text-white">
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.65 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur"
              style={{ transformStyle: "preserve-3d" }}
            >
              <span className="text-lg font-bold text-[#f7c948]">IM</span>
            </motion.div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">
                Interact
              </p>
              <p className="text-xs uppercase tracking-[0.35em] text-white/65">
                Maris
              </p>
            </div>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
            {[
              ["Acasă", "#acasa"],
              ["Despre noi", "#despre"],
              ["Proiecte", "#proiecte"],
              ["Galerie", "#galerie"],
              ["Contact", "#contact"],
            ].map(([label, href], index) => (
              <a
                key={label}
                href={href}
                className="group relative text-sm font-light text-white transition hover:text-[#f7c948]"
              >
                {label}
                <span
                  className={`absolute left-1/2 top-7 h-1 w-1 -translate-x-1/2 rounded-full bg-[#f7c948] transition ${
                    index === 0
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#081b3a]"
            >
              Intră în platformă
              <ArrowRight size={17} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-white lg:hidden"
            aria-label="Deschide meniul"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#07172f] px-7 py-7 text-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold uppercase tracking-[0.25em]">
              Interact Maris
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Închide meniul"
            >
              <X size={30} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-7">
            {[
              ["Acasă", "#acasa"],
              ["Despre noi", "#despre"],
              ["Proiecte", "#proiecte"],
              ["Galerie", "#galerie"],
              ["Contact", "#contact"],
            ].map(([label, href], index) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-semibold"
              >
                {label}
              </motion.a>
            ))}

            <Link
              to="/login"
              className="mt-5 rounded-full bg-[#f7c948] px-8 py-4 font-bold text-[#081b3a]"
            >
              Intră în platformă
            </Link>
          </nav>
        </motion.div>
      )}

      <section
        ref={heroRef}
        id="acasa"
        className="relative z-10 flex min-h-screen items-center overflow-hidden bg-transparent"
      >

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-[#07172f]/35 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(23,69,143,0.42),transparent_42%)]" />

        <motion.div
          className="absolute -right-24 top-16 h-80 w-80 rounded-full border border-white/10"
          style={{ rotate: orbitRotate }}
        >
          <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-[#f7c948] shadow-[0_0_30px_#f7c948]" />
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pt-28 lg:px-12"
          style={{ y: heroTextY, opacity: heroTextOpacity }}
        >
          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="mb-7 text-xs font-semibold uppercase tracking-[0.4em] text-[#f7c948] md:text-sm"
            >
              Interact Târgu Mureș Maris
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 45, rotateX: 18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-5xl text-5xl font-medium leading-[0.96] text-white sm:text-6xl md:text-7xl lg:text-[6.8rem]"
              style={{
                fontFamily: '"Playfair Display", serif',
                transformPerspective: 1200,
              }}
            >
              Împreună transformăm
              <br />
              ideile în{" "}
              <span className="italic text-[#f7c948]">schimbare.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.35 }}
              className="mt-8 max-w-2xl text-lg font-light leading-8 text-white/80 md:text-xl"
            >
              O comunitate de tineri care construiește proiecte, prietenii și
              experiențe cu impact real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#despre"
                className="inline-flex items-center gap-3 rounded-full bg-[#f7c948] px-8 py-4 font-semibold text-[#081b3a] shadow-lg transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(247,201,72,0.35)]"
              >
                Descoperă clubul
                <ArrowRight size={19} />
              </a>

              <Link
                to="/events"
                className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#081b3a]"
              >
                Vezi evenimentele
                <ArrowRight size={19} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.1, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-white"
        >
          <a
            href="#despre"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur"
            aria-label="Derulează"
          >
            <ArrowDown size={18} />
          </a>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/80">
            Descoperă mai mult
          </span>
        </motion.div>
      </section>

      <section
        id="despre"
        className="relative z-10 mx-auto max-w-[1400px] bg-[#f4f1eb] px-6 py-24 lg:px-12 lg:py-32"
      >
        <div className="absolute left-[-8rem] top-32 h-72 w-72 rounded-full bg-[#17458f]/10 blur-3xl" />

        <div className="grid items-center gap-14 xl:grid-cols-[0.95fr_1.05fr] xl:gap-20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#17458f]">
              Despre noi
            </p>

            <h2
              className="mt-5 text-5xl font-medium leading-tight md:text-6xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Mai mult decât
              <br />
              un club
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Interact Maris este comunitatea în care tinerii învață să
              conducă, să colaboreze și să schimbe lumea din jurul lor prin
              proiecte de voluntariat și inițiative curajoase.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                ["80+", "Membri"],
                ["20+", "Proiecte"],
                ["800+", "Ore"],
                ["10", "Ani de activitate"],
              ].map(([value, label], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <p className="text-3xl font-bold text-[#17458f]">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <TiltCard className="relative min-w-0 xl:pl-6">
            <div style={{ transform: "translateZ(35px)" }}>
              <img
                src="/images/interact-board-indoor.jpg"
                alt="Board Interact Maris"
                className="h-[480px] w-full rounded-[2rem] object-cover object-center shadow-2xl sm:h-[560px] xl:h-[620px]"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-5 right-5 max-w-xs rounded-2xl bg-[#081b3a]/95 p-6 text-white shadow-2xl backdrop-blur md:bottom-7 md:right-7"
              style={{ transform: "translateZ(65px)" }}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-[#f7c948]">
                Valorile noastre
              </p>
              <p className="mt-3 text-xl font-semibold">
                Prietenie. Leadership. Comunitate.
              </p>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      <section
        ref={storyRef}
        className="relative overflow-hidden bg-[#07172f] py-24 text-white lg:py-32"
      >
        <div className="absolute right-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-[#17458f]/30 blur-3xl" />

        <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 lg:grid-cols-2 lg:px-12">
          <motion.div
            className="relative mx-auto max-w-lg"
            style={{ y: storyImageY }}
          >
            <div className="absolute -left-16 -top-16 text-[12rem] font-black leading-none text-white/[0.04]">
              01
            </div>

            <TiltCard>
              <img
                src="/images/interact-board-building.jpg"
                alt="Interact Maris la sediu"
                className="relative h-[720px] w-full rounded-[2rem] object-cover shadow-2xl"
              />
            </TiltCard>
          </motion.div>

          <motion.div style={{ y: storyTextY }}>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7c948]">
              Povestea noastră
            </p>

            <h2
              className="mt-5 text-5xl font-medium leading-tight md:text-6xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Generația care alege să se implice
            </h2>

            <p className="mt-8 text-lg font-light leading-8 text-white/70">
              Credem că schimbarea începe cu oameni care aleg să nu rămână
              indiferenți. Prin fiecare proiect, membrii noștri își dezvoltă
              curajul, creativitatea și capacitatea de a lucra împreună.
            </p>

            <p className="mt-5 text-lg font-light leading-8 text-white/70">
              Interact Maris este locul în care prieteniile se transformă în
              echipe, iar echipele transformă ideile în impact.
            </p>
          </motion.div>
        </div>
      </section>

      <section
        id="proiecte"
        className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 max-w-3xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#17458f]">
            Implicare
          </p>
          <h2
            className="mt-5 text-5xl font-medium md:text-6xl"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Proiecte care lasă urme
          </h2>
        </motion.div>

        <div className="grid gap-7 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.number}
              initial={{ opacity: 0, y: 55, rotateY: index % 2 ? 8 : -8 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.12 * index, duration: 0.75 }}
            >
              <TiltCard className="h-full">
                <article
                  className="group h-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <p
                    className="text-6xl font-semibold text-[#17458f]/10"
                    style={{ transform: "translateZ(45px)" }}
                  >
                    {project.number}
                  </p>

                  <div style={{ transform: "translateZ(30px)" }}>
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-[#17458f]">
                      {project.category}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-5 leading-7 text-slate-600">
                      {project.description}
                    </p>
                    <button className="mt-8 inline-flex items-center gap-2 font-semibold text-[#17458f]">
                      Descoperă proiectul
                      <ArrowRight
                        size={18}
                        className="transition group-hover:translate-x-2"
                      />
                    </button>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="galerie"
        className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32"
      >
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#17458f]">
            Galerie
          </p>
          <h2
            className="mt-5 text-5xl font-medium md:text-6xl"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Momente care ne definesc
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              setSelectedImage({
                src: "/images/interact-board-walking.jpg",
                alt: "Membrii Interact Maris",
              })
            }
            className="text-left"
          >
            <TiltCard className="group relative overflow-hidden rounded-[2rem]">
              <img
                src="/images/interact-board-walking.jpg"
                alt="Membrii Interact Maris"
                className="h-[650px] w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <p className="absolute bottom-8 left-8 text-2xl font-semibold text-white">
                Împreună, în fiecare pas
              </p>
            </TiltCard>
          </button>

          <div className="grid gap-5">
            <button
              type="button"
              onClick={() =>
                setSelectedImage({
                  src: "/images/interact-board-indoor.jpg",
                  alt: "Portretul boardului",
                })
              }
              className="text-left"
            >
              <TiltCard className="group relative overflow-hidden rounded-[2rem] bg-[#e9e7e2]">
                <div className="flex h-[520px] w-full items-center justify-center p-4 sm:h-[600px]">
                  <img
                    src="/images/interact-board-indoor.jpg"
                    alt="Portretul boardului"
                    className="max-h-full max-w-full rounded-[1.5rem] object-contain object-center shadow-xl transition duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <p className="absolute bottom-6 left-6 text-xl font-semibold text-white">
                  Board 2026
                </p>
              </TiltCard>
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedImage({
                  src: "/images/interact-board-building.jpg",
                  alt: "Interact Maris",
                })
              }
              className="text-left"
            >
              <TiltCard className="group relative overflow-hidden rounded-[2rem]">
                <img
                  src="/images/interact-board-building.jpg"
                  alt="Interact Maris"
                  className="h-[390px] w-full object-cover object-[center_62%] transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <p className="absolute bottom-6 left-6 text-xl font-semibold text-white">
                  Prietenie și leadership
                </p>
              </TiltCard>
            </button>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-[#17458f] px-6 py-24 text-white lg:px-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/10"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#f7c948]/30"
        />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7c948]">
              Contact
            </p>

            <h2
              className="mt-5 max-w-3xl text-4xl font-medium md:text-6xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Fii parte din următoarea schimbare.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              Urmărește activitatea Interact Maris, descoperă proiectele noastre
              și intră în legătură cu echipa.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/interact_maris/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#17458f]"
              >
                Instagram
                <ArrowRight size={18} />
              </a>

              <a
                href="https://www.facebook.com/interacttirgumuresmaris"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#17458f]"
              >
                Facebook
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <Link
            to="/login"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#f7c948] px-8 py-4 font-bold text-[#081b3a] transition hover:-translate-y-1 hover:shadow-2xl"
          >
            Intră în platformă
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>


      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative inline-flex max-h-[90vh] max-w-[94vw] items-center justify-center overflow-hidden rounded-[1.4rem] bg-white p-1.5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-black"
              aria-label="Închide fotografia"
            >
              ×
            </button>

            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="block max-h-[86vh] max-w-[90vw] rounded-[1rem] object-contain"
            />
          </div>
        </div>
      )}

      <footer className="bg-[#07172f] px-6 py-12 text-white lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row">
          <div>
            <p className="text-xl font-bold">Interact Maris</p>
            <p className="mt-2 text-sm text-white/60">
              Prietenie. Leadership. Comunitate.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <a href="#despre">Despre noi</a>
            <a href="#proiecte">Proiecte</a>
            <a href="#galerie">Galerie</a>
            <Link to="/login">Platformă</Link>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-[1400px] flex-col justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 Interact Maris. Toate drepturile rezervate.</p>
          <p>A servi mai presus de sine.</p>
        </div>
      </footer>
    </main>
  );
}
