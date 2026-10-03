import React from "react";
import { useInView } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    number: string;
    title: string;
    content: string[];
  };
  index: number;
}

export const ArticleCard = ({ article, index }: ArticleCardProps) => {
  const [ref, inView] = useInView();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`,
      }}
      className="article-card"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="article-header">
        <span className="article-number">{article.number}</span>
        <h2 className="article-title">{article.title}</h2>
        <span className={`article-chevron ${expanded ? "open" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 6.5L9 11.5L14 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className={`article-body ${expanded ? "expanded" : ""}`}>
        <div className="article-body-inner">
          {article.content.map((para, i) => (
            <p key={i} className="article-para">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
