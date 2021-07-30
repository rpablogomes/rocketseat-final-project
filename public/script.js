// for (let card of document.getElementsByClassName("card")) {
//     card.addEventListener("click", function () {
//         const foodIndex = card.getAttribute("id")
//         window.location.href = `/receipts/${foodIndex}`
//     })
// }

// INGREDIENTS FUNCTION
if (document.querySelector("#visibilityLinksINGREDIENTS")) {
  document
    .querySelector("#visibilityLinksINGREDIENTS")
    .addEventListener("click", function () {
      document.querySelector("#showINGREDIENTS").toggleAttribute("hidden");
      document.querySelector("#hideINGREDIENTS").toggleAttribute("hidden");
      document.querySelector("#contentINGREDIENTS").toggleAttribute("hidden");
    });
}

// STEPS FUNCTION
if (document.querySelector("#visibilityLinksSTEPS")) {
  document
    .querySelector("#visibilityLinksSTEPS")
    .addEventListener("click", function () {
      document.querySelector("#showSTEPS").toggleAttribute("hidden");
      document.querySelector("#hideSTEPS").toggleAttribute("hidden");
      document.querySelector("#contentSTEPS").toggleAttribute("hidden");
    });
}

// INFORMATION FUNCTION
if (document.getElementById("visibilityLinksINFORMATION")) {
  document
    .getElementById("visibilityLinksINFORMATION")
    .addEventListener("click", function () {
      document.querySelector("#showINFORMATION").toggleAttribute("hidden");
      document.querySelector("#hideINFORMATION").toggleAttribute("hidden");
      document.querySelector("#contentINFORMATION").toggleAttribute("hidden");
    });
}

//PAGINATION

function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }
  return pages;
}

const pagination = document.getElementById("pagination");

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const selectedPage = +Number(pagination.dataset.page);
  const totalPages = +Number(pagination.dataset.total);
  const pages = paginate(selectedPage, totalPages);

  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }

  pagination.innerHTML = elements;
}

if (pagination) {
  createPagination(pagination);
}