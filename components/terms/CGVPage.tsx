"use client";
import React from "react";
import { TermsStyles } from "./TermsStyles";
import { articles } from "./articles";
import { ArticleCard } from "./ArticleCard";

export default function CGVPage() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(progress, 1));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <React.Fragment>
      <TermsStyles />

      {/* Reading progress */}
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Header */}
      <header className="page-header">
        <div className="header-bg-text" aria-hidden="true">
          CGV
        </div>
        <div className="header-content">
          <div className="header-eyebrow">Reborn SARL — Document légal</div>
          <h1 className="header-title">
            Conditions
            <br />
            <em>Générales</em> de Vente
          </h1>

          <div className="header-meta">
            <div className="header-meta-item">
              <span className="meta-label">Application</span>
              <span className="meta-value">Reborn</span>
            </div>
            <div className="meta-divider" />
            <div className="header-meta-item">
              <span className="meta-label">Articles</span>
              <span className="meta-value">12 sections</span>
            </div>
          </div>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="toc-wrapper">
        <p className="toc-label">Table des matières</p>
        <div className="toc-grid">
          {articles.map((a) => (
            <a
              key={a.number}
              className="toc-item"
              href={`#article-${a.number}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(`article-${a.number}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              <span className="toc-num">{a.number}</span>
              {a.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Articles */}
      <main className="articles-wrapper">
        {articles.map((article, i) => (
          <div id={`article-${article.number}`} key={article.number}>
            <ArticleCard article={article} index={i} />
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <span className="footer-brand">Reborn</span>
        <span className="footer-note">
          © Reborn SARL — Tous droits réservés
        </span>
      </footer>
    </React.Fragment>
  );
}
