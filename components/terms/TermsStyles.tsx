export const TermsStyles = () => {
  return (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');


        :root {
          --cream: #F7F4EF;
          --ink: #1A1714;
          --ink-muted: #6B6560;
          --ink-faint: #C8C3BC;
          --accent: #C85C38;
          --accent-light: #F0E8E3;
          --rule: #E2DDD8;
          --card-bg: #FFFFFF;
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--cream);
          color: var(--ink);
          font-family: var(--sans);
          -webkit-font-smoothing: antialiased;
        }

        /* Progress bar */
        .progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: var(--accent);
          z-index: 100;
          transition: width 0.1s linear;
          transform-origin: left;
        }

        /* Header */
        .page-header {
          position: relative;
          padding: 80px 0 64px;
          overflow: hidden;
        }

        .header-bg-text {
          position: absolute;
          top: -20px; right: -10px;
          font-family: var(--serif);
          font-size: clamp(120px, 20vw, 220px);
          color: transparent;
          -webkit-text-stroke: 1px var(--rule);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
        }

        .header-content {
          position: relative;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 24px;
        }

        .header-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--accent);
        }

        .header-title {
          font-family: var(--serif);
          font-size: clamp(38px, 6vw, 64px);
          line-height: 1.1;
          color: var(--ink);
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .header-title em {
          font-style: italic;
          color: var(--accent);
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
        }

        .header-meta-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .meta-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
          font-weight: 500;
        }

        .meta-value {
          font-size: 13px;
          color: var(--ink);
          font-weight: 400;
        }

        .meta-divider {
          width: 1px;
          height: 32px;
          background: var(--rule);
        }

        /* TOC */
        .toc-wrapper {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 32px 48px;
        }

        .toc-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
          font-weight: 500;
          margin-bottom: 14px;
        }

        .toc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 6px;
        }

        .toc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
          color: var(--ink-muted);
          font-size: 13px;
        }

        .toc-item:hover {
          background: var(--accent-light);
          color: var(--accent);
        }

        .toc-num {
          font-family: var(--serif);
          font-size: 11px;
          color: var(--ink-faint);
          min-width: 20px;
        }

        /* Articles */
        .articles-wrapper {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 32px 120px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .article-card {
          background: var(--card-bg);
          border: 1px solid var(--rule);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .article-card:hover {
          border-color: var(--ink-faint);
          box-shadow: 0 4px 24px rgba(26,23,20,0.06);
        }

        .article-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
        }

        .article-number {
          font-family: var(--serif);
          font-size: 13px;
          color: var(--accent);
          min-width: 28px;
          font-style: italic;
        }

        .article-title {
          flex: 1;
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 500;
          color: var(--ink);
          letter-spacing: -0.01em;
        }

        .article-chevron {
          color: var(--ink-faint);
          transition: transform 0.3s ease, color 0.2s;
          flex-shrink: 0;
        }

        .article-chevron.open {
          transform: rotate(180deg);
          color: var(--accent);
        }

        .article-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .article-body.expanded {
          max-height: 600px;
        }

        .article-body-inner {
          padding: 0 24px 24px;
          border-top: 1px solid var(--rule);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .article-para {
          font-size: 14px;
          line-height: 1.75;
          color: var(--ink-muted);
        }

        /* Footer */
        .page-footer {
          max-width: 780px;
          margin: 0 auto;
          padding: 32px 32px 64px;
          border-top: 1px solid var(--rule);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: gap;
        }

        .footer-brand {
          font-family: var(--serif);
          font-size: 18px;
          color: var(--ink);
          font-style: italic;
        }

        .footer-note {
          font-size: 12px;
          color: var(--ink-faint);
        }

        @media (max-width: 600px) {
          .header-meta { flex-wrap: wrap; gap: 16px; }
          .toc-grid { grid-template-columns: 1fr 1fr; }
          .page-footer { flex-direction: column; gap: 12px; }
        }
      `}</style>
  );
};
