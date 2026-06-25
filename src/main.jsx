import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BookOpen, CheckCircle2, Gem, Mail, PackageCheck, ShieldCheck } from "lucide-react";
import "./styles.css";

const productNotes = [
  "A fake display book made for rings and small keepsakes.",
  "Designed to blend into a shelf, nightstand, office, or closet.",
  "Introductory product run: 300 books planned.",
  "More fake-book titles can be added later under the same Jewelry Book store.",
];

const futureTitles = ["Ring of Fire", "Curious Ring", "More cover titles later"];

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
      if (window.location.hash && window.location.hash !== "#home") {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
      }
      window.scrollTo(0, 0);
    }
  }, []);

  React.useEffect(() => {
    const onHashChange = () => {
      const nextPage = getPageFromHash();
      const id = window.location.hash.replace("#", "");
      const cameFromSiteClick = internalNavigation.current;
      internalNavigation.current = false;

      if (nextPage === "home" && id && id !== "home" && !cameFromSiteClick) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#home`);
        window.scrollTo({ top: 0, behavior: "auto" });
        setPage("home");
        return;
      }

      setPage(nextPage);

      window.requestAnimationFrame(() => {
        if (nextPage === "home" && id && id !== "home") {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
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
          <small>Hoarder of the Rings</small>
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
          <p className="eyebrow">Introductory Fake-Book Jewelry Storage</p>
          <h1>Hoarder of the Rings</h1>
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
          <p className="eyebrow">First Product Run</p>
          <h2>Start with Hoarder of the Rings.</h2>
          <p>
            This is the introductory Jewelry Book product. More fake titles can come later without
            needing a separate website for every cover.
          </p>
          <div className="price-row">
            <span>$36.99</span>
            <small>introductory product</small>
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
            <p className="eyebrow">Future Covers</p>
            <h2>One store. More fake-book titles later.</h2>
            <p>
              Jewelry Book can grow into a small collection without splitting each title into its
              own site.
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
  return (
    <div className="book-stage" aria-label="Hoarder of the Rings fake book product">
      <div className="book-back">
        <span className="back-price">$36.99</span>
        <span className="barcode">0 35540 65020</span>
      </div>
      <div className="book-spine">
        <span>HOARDER OF THE RINGS</span>
      </div>
      <div className="book-cover">
        <div className="cover-rings" />
        <span className="cover-kicker">Thou shall not toucheth</span>
        <h2>HOARDER<br />OF THE<br />RINGS</h2>
        <div className="ring" />
        <p>T.F. Roberts</p>
      </div>
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
    };
  }, [page]);
}

createRoot(document.getElementById("root")).render(<App />);
