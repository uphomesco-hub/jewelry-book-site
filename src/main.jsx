import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BookOpen, CheckCircle2, Gem, Mail, PackageCheck, ShieldCheck } from "lucide-react";
import "./styles.css";

const footerRings = [
  "ring-1-blue-sapphire.png",
  "ring-3-amber.png",
  "ring-7-gold-band.png",
];
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
        <span>Jewelry Book</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#product" onClick={onNavigate}>
          Products
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
          <p className="eyebrow">Rings, Things, and Keepsakes</p>
          <h1>Jewelry Storage</h1>
          <p>
            Keep your precious rings and things safe, organized, and hidden in plain sight.
            A fantasy-inspired Jewelry Book with a soft ring tray inside.
          </p>
          <div className="actions">
            <a className="button primary" href="#buy" onClick={onNavigate}>
              Buy the book <ArrowRight size={18} />
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
          <h2>Safe, Secure, and Organized.</h2>
        </div>
        <div className="feature-grid">
          <article>
            <BookOpen size={26} />
            <h3>No loose rattling</h3>
            <p>Other fake books let jewelry slide around loose. Our Jewelry Book holds rings in place.</p>
          </article>
          <article>
            <Gem size={26} />
            <h3>Protects what matters</h3>
            <p>Your jewelry is an investment, but it can also hold real sentimental value. Our Jewelry Book helps prevent damage.</p>
          </article>
          <article>
            <ShieldCheck size={26} />
            <h3>Hidden in plain sight</h3>
            <p>Keep rings and small treasures tucked away inside our Jewelry Book that blends in any room.</p>
          </article>
        </div>
      </section>

      <section className="panel section buy-section" id="buy">
        <div className="buy-copy">
          <p className="eyebrow">Featured Product</p>
          <h2>Start with Hoard of the Rings.</h2>
          <p className="buy-coming-soon">Additional titles for your other treasures coming soon.</p>
          <p>
            Hoard of the Rings is the introductory Jewelry Book release, made for useful storage with a little personality.
          </p>
          <p className="gift-note">
            <CheckCircle2 size={20} />
            Great gift idea for anyone who wants clever storage with personality.
          </p>
          <div className="price-row">
            <span>$38.99</span>
            <small>limited introductory release</small>
          </div>
          <a className="button primary" href="#contact" onClick={onNavigate}>
            Request purchase details <ArrowRight size={18} />
          </a>
        </div>
        <div className="buy-product-art" aria-hidden="true">
          <picture className="buy-tray-image">
            <source
              type="image/webp"
              srcSet={`${import.meta.env.BASE_URL || "/"}assets/hoard-ring-tray-sm.webp 620w, ${import.meta.env.BASE_URL || "/"}assets/hoard-ring-tray.webp 960w`}
              sizes="(max-width: 980px) 84vw, 34vw"
            />
            <img src={`${import.meta.env.BASE_URL || "/"}assets/hoard-ring-tray-sm.webp`} alt="" loading="lazy" />
          </picture>
          <picture className="buy-cover-image">
            <source
              type="image/webp"
              srcSet={`${import.meta.env.BASE_URL || "/"}assets/hoard-front-cover-sm.webp 620w, ${import.meta.env.BASE_URL || "/"}assets/hoard-front-cover.webp 1280w`}
              sizes="(max-width: 980px) 42vw, 16vw"
            />
            <img src={`${import.meta.env.BASE_URL || "/"}assets/hoard-front-cover-sm.webp`} alt="" loading="lazy" />
          </picture>
        </div>
      </section>

      <footer className="panel site-footer">
        <div className="footer-stage">
          <div className="footer-card">
            <p className="eyebrow">Jewelry Book</p>
            <h2>Keep your rings and things safe.</h2>
            <p>
              Hoard of the Rings is the introductory Jewelry Book product: organized ring storage
              hidden inside a fake book that belongs on the shelf.
            </p>
            <a className="button primary" href="#contact" onClick={onNavigate}>
              Contact for purchase details <ArrowRight size={18} />
            </a>
          </div>
          <div className="footer-rings" aria-hidden="true">
            {footerRings.map((ring, index) => (
              <img
                key={ring}
                src={`${import.meta.env.BASE_URL || "/"}assets/rings/${ring}`}
                alt=""
                style={{ "--ring-index": index }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

function ProductBook() {
  const [isOpen, setIsOpen] = React.useState(false);
  const assetBase = import.meta.env.BASE_URL || "/";

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 550);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`book-stage ${isOpen ? "is-open" : ""}`} aria-label="Hoard of the Rings fake book product">
      <div className="book-shell">
        <div className="book-tray" aria-hidden={!isOpen}>
          <picture>
            <source
              type="image/webp"
              srcSet={`${assetBase}assets/hoard-ring-tray-sm.webp 620w, ${assetBase}assets/hoard-ring-tray.webp 960w`}
              sizes="(max-width: 700px) 78vw, 36vw"
            />
            <img src={`${assetBase}assets/hoard-ring-tray-sm.webp`} alt="" loading="eager" fetchPriority="high" />
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
              type="image/webp"
              srcSet={`${assetBase}assets/hoard-front-cover-sm.webp 620w, ${assetBase}assets/hoard-front-cover.webp 1280w`}
              sizes="(max-width: 700px) 68vw, 28vw"
            />
            <img
              src={`${assetBase}assets/hoard-front-cover-sm.webp`}
              alt="Hoard of the Rings book cover"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </button>
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
            Purchase, wholesale, and product launch questions
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
