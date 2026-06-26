import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BookOpen, CheckCircle2, Gem, Mail, PackageCheck, ShieldCheck } from "lucide-react";
import "./styles.css";

const productNotes = [
  "A fake display book made for rings and small keepsakes.",
  "Designed to blend into a shelf, nightstand, office, or closet.",
  "A playful way to keep small treasures out of plain view.",
  "Made for gift giving, personal storage, and secret little hiding spots.",
];

const futureTitles = ["Ring of Fire", "Curious Ring", "More titles in the works"];
const homeSectionIds = new Set(["home", "product", "buy"]);

function getPageFromHash() {
  return window.location.hash === "#contact" ? "contact" : "home";
}

function App() {
  const [page, setPage] = React.useState(getPageFromHash());
  const [sent, setSent] = React.useState(false);
  const internalNavigation = React.useRef(false);
  useScrollMotion(page);

  const markInternalNavigation = React.useCallback(() => {
    internalNavigation.current = true;
  }, []);

  React.useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash !== "#contact") {
      const id = window.location.hash.replace("#", "");
      if (window.location.hash && !homeSectionIds.has(id)) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
      }
      if (!id || id === "home" || !homeSectionIds.has(id)) {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  React.useEffect(() => {
    const onHashChange = () => {
      const nextPage = getPageFromHash();
      const id = window.location.hash.replace("#", "");
      const cameFromSiteClick = internalNavigation.current;
      internalNavigation.current = false;

      if (nextPage === "home" && id && !homeSectionIds.has(id) && !cameFromSiteClick) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
        window.scrollTo({ top: 0, behavior: "auto" });
        setPage("home");
        return;
      }

      setPage(nextPage);

      window.requestAnimationFrame(() => {
        if (nextPage === "home" && id && id !== "home") {
          document.getElementById(id)?.scrollIntoView({
            behavior: cameFromSiteClick ? "smooth" : "auto",
            block: "start",
          });
        } else {
          window.scrollTo({ top: 0, behavior: cameFromSiteClick ? "smooth" : "auto" });
        }
      });
    };

    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <Header page={page} onNavigate={markInternalNavigation} />
      <main>
        {page === "contact" ? (
          <ContactPage sent={sent} setSent={setSent} />
        ) : (
          <HomePage onNavigate={markInternalNavigation} />
        )}
      </main>
    </>
  );
}

function Header({ page, onNavigate }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Jewelry Book home" onClick={onNavigate}>
        <span className="brand-mark">JB</span>
        <span>
          Jewelry Book
          <small>Hoard of the Rings</small>
        </span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#product" onClick={onNavigate}>
          Product
        </a>
        <a href="#buy" onClick={onNavigate}>
          Buy
        </a>
        <a href="#contact" className={page === "contact" ? "active" : ""} onClick={onNavigate}>
          Contact
        </a>
      </nav>
    </header>
  );
}

function HomePage({ onNavigate }) {
  return (
    <>
      <section className="panel hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Fake-Book Jewelry Storage</p>
          <h1>Hoard of the Rings</h1>
          <p>
            A clever fake book for hiding rings, small keepsakes, and tiny treasures in plain sight.
          </p>
          <div className="actions">
            <a className="button primary" href="#buy" onClick={onNavigate}>
              Buy the first book <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#contact" onClick={onNavigate}>
              Ask a question
            </a>
          </div>
        </div>

        <ProductBook />
        <div className="hero-rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="panel section product-section" id="product">
        <div className="section-heading">
          <p className="eyebrow">Jewelry Book</p>
          <h2>A hiding spot that looks like it belongs on the shelf.</h2>
        </div>
        <div className="feature-grid">
          <article>
            <BookOpen size={26} />
            <h3>Looks like a book</h3>
            <p>Built around the look of a dramatic fantasy-style hardback, not a normal jewelry box.</p>
          </article>
          <article>
            <Gem size={26} />
            <h3>Made for rings</h3>
            <p>Designed for ring storage first, with room for small keepsakes and personal treasures.</p>
          </article>
          <article>
            <ShieldCheck size={26} />
            <h3>Hides in plain sight</h3>
            <p>Place it on a shelf, desk, nightstand, or closet and let it disappear into the room.</p>
          </article>
        </div>
      </section>

      <section className="panel section buy-section" id="buy">
        <div className="buy-copy">
          <p className="eyebrow">Featured Product</p>
          <h2>Start with Hoard of the Rings.</h2>
          <p>
            A fantasy-inspired fake book that turns ring storage into something clever, giftable,
            and easy to hide in plain sight.
          </p>
          <div className="price-row">
            <span>$36.99</span>
            <small>limited introductory release</small>
          </div>
          <a className="button primary" href="#contact" onClick={onNavigate}>
            Request purchase details <ArrowRight size={18} />
          </a>
        </div>
        <div className="buy-panel">
          <p className="eyebrow">What you get</p>
          {productNotes.map((note) => (
            <p key={note}>
              <CheckCircle2 size={20} />
              {note}
            </p>
          ))}
        </div>
      </section>

      <section className="panel final-cta">
        <div className="final-card">
          <div>
            <p className="eyebrow">More Covers</p>
            <h2>Collectible hiding spots with a wink.</h2>
            <p>
              Jewelry Book is built for clever cover concepts, useful storage, and little surprises
              that feel right at home on a shelf.
            </p>
          </div>
          <div className="title-stack">
            {futureTitles.map((title) => (
              <span key={title}>{title}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductBook() {
  const [isOpen, setIsOpen] = React.useState(false);
  const assetBase = import.meta.env.BASE_URL || "/";

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 850);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`book-stage ${isOpen ? "is-open" : ""}`} aria-label="Hoard of the Rings fake book product">
      <div className="book-shell">
        <div className="book-tray" aria-hidden={!isOpen}>
          <picture>
            <source
              srcSet={`${assetBase}assets/hoard-ring-tray-sm.png 720w, ${assetBase}assets/hoard-ring-tray.png 1024w`}
              sizes="(max-width: 700px) 78vw, 36vw"
            />
            <img src={`${assetBase}assets/hoard-ring-tray-sm.png`} alt="" />
          </picture>
        </div>
        <button
          className="book-cover"
          type="button"
          aria-pressed={isOpen}
          aria-label={isOpen ? "Close the jewelry book" : "Open the jewelry book"}
          onClick={() => setIsOpen((current) => !current)}
        >
          <picture>
            <source
              srcSet={`${assetBase}assets/hoard-front-cover-sm.png 620w, ${assetBase}assets/hoard-front-cover.png 1310w`}
              sizes="(max-width: 700px) 68vw, 28vw"
            />
            <img src={`${assetBase}assets/hoard-front-cover-sm.png`} alt="Hoard of the Rings book cover" />
          </picture>
        </button>
      </div>
      <button className="book-toggle" type="button" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Close the book" : "Open the book"}
      </button>
    </div>
  );
}

function ContactPage({ sent, setSent }) {
  return (
    <section className="panel contact-page">
      <div className="contact-copy">
        <p className="eyebrow">Contact Us</p>
        <h1>Contact via the form or email below:</h1>
        <div className="contact-points">
          <p>
            <Mail size={20} />
            hello@jewelry-book.com
          </p>
          <p>
            <PackageCheck size={20} />
            Purchase, wholesale, and launch questions
          </p>
        </div>
      </div>

      <form
        className="contact-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div className="form-brand">
          <span>JB</span>
          <strong>Jewelry Book</strong>
        </div>
        <label>
          Name
          <input name="name" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Message
          <textarea name="message" rows="5" placeholder="Tell us what you need help with." required />
        </label>
        <button type="submit">Send message</button>
        {sent && <p className="form-note">Thanks. The message UI is working; backend email can be connected next.</p>}
      </form>
    </section>
  );
}

function useScrollMotion(page) {
  React.useEffect(() => {
    const panels = Array.from(document.querySelectorAll(".panel"));
    let frame = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const update = () => {
      frame = 0;
      const height = window.innerHeight || 1;
      const navProbeY = Math.min(86, height * 0.14);
      const darkSection = document.querySelector(".buy-section");
      let navOnDark = false;

      if (darkSection) {
        const darkRect = darkSection.getBoundingClientRect();
        navOnDark = darkRect.top <= navProbeY && darkRect.bottom >= navProbeY;
      }

      document.documentElement.classList.toggle("nav-on-dark", navOnDark);

      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const visiblePixels = Math.min(rect.bottom, height) - Math.max(rect.top, 0);
        const visibleRatio = clamp(visiblePixels / Math.min(rect.height || height, height), 0, 1);
        const presence = visibleRatio > 0.08 ? 1 : clamp(1 - Math.abs(rect.top) / height, 0, 1);
        const revealY = (1 - presence) * 70;
        const opacity = 0.48 + presence * 0.52;
        const scale = 0.97 + presence * 0.03;

        panel.classList.toggle("is-visible", presence > 0.18);
        panel.style.setProperty("--reveal-y", `${revealY.toFixed(2)}px`);
        panel.style.setProperty("--reveal-opacity", opacity.toFixed(4));
        panel.style.setProperty("--reveal-scale", scale.toFixed(4));
      });
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("hashchange", requestUpdate);
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("nav-on-dark");
    };
  }, [page]);
}

createRoot(document.getElementById("root")).render(<App />);
