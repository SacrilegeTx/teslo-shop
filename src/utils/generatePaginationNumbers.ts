// Generar la paginacion de la pagina de productos
export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number,
): (string | number)[] => {
  // si el total de paginas es menor o igual a 5, se muestran todas
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // caso contrario mostrar los 3 puntos suspensivos (...) y las ultimas 2 paginas
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 1, totalPages];
  }
  // Si la página actual está entre las 3 últimas páginas
  // mostrar las primeras 2, puntos supensivos, las últimas 3 páginas
  if (currentPage >= totalPages - 4) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  // Si la página actual está en otro lugar medio
  // mostrar la primera página, puntos supensivos, la página actual, puntos supensivos, la última página

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
