import "../estilos/Paginator.css";

interface PaginatorProps {
  totalPages: number;
  currentPage: number; // 1-index
  onPageChange: (page: number) => void;
}

function Paginator({ totalPages, currentPage, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  // Siempre mostrar la página 1
  pages.push(1);

  // Caso especial: páginas 1 y 2 → mostrar 1 2 3
  if (currentPage <= 2) {
    if (totalPages >= 2) pages.push(2);
    if (totalPages >= 3) pages.push(3);

    if (totalPages > 3) pages.push("...");
    if (totalPages > 3) pages.push(totalPages);

    return renderPaginator();
  }

  // Caso especial: página 3 → transición al modo dinámico
  if (currentPage === 3) {
    pages.push(2);
    pages.push(3);
    pages.push(4);

    if (totalPages > 4) pages.push("...");
    if (totalPages > 4) pages.push(totalPages);

    return renderPaginator();
  }

  // ⭐ NUEVO: últimas 4 páginas
  if (currentPage >= totalPages - 3) {
    pages.push("...");

    for (let p = totalPages - 3; p <= totalPages; p++) {
      if (p > 1) pages.push(p);
    }

    return renderPaginator();
  }

  // Si estamos lejos del inicio, mostrar "..."
  if (currentPage > 3) {
    pages.push("...");
  }

  // Bloque dinámico: 3 páginas centradas en la actual
  const start = currentPage - 1;
  const end = currentPage + 1;

  for (let p = start; p <= end; p++) {
    if (p > 1 && p < totalPages) {
      pages.push(p);
    }
  }

  // Si estamos lejos del final, mostrar "..."
  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  // Siempre mostrar la última página
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  function renderPaginator() {
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
            <span key={i} className="dots">…</span>
          ) : (
            <button
              key={i}
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

  return renderPaginator();
}

export default Paginator;
