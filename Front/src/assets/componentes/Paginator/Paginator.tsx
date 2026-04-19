import "./Paginator.css";
import { Paginator as PaginatorProps } from "../../modelos/Pageable";

function Paginator({ totalPages, currentPage, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);
  return (
    <div className="paginator-container">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="dots">…</span>
        ) : (
          <button
            key={`page-${p}`}
            className={p === currentPage ? "active" : ""}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ▶
      </button>
    </div>
  );
}

export default Paginator;


function buildPages(current: number, total: number) {
  const pages: (number | "...")[] = [];

  const add = (p: number | "...") => pages.push(p);

  add(1);

  if (current <= 3) {
    for (let p = 2; p <= Math.min(4, total); p++) add(p);
    if (total > 4) add("...");
    if (total > 4) add(total);
    return pages;
  }

  if (current >= total - 2) {
    add("...");
    for (let p = total - 3; p <= total; p++) {
      if (p > 1) add(p);
    }
    return pages;
  }

  add("...");
  add(current - 1);
  add(current);
  add(current + 1);
  add("...");
  add(total);

  return pages;
}
