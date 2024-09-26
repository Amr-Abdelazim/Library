import { get_data } from "./book_data";

const data = get_data();

function create_book(_title, _author, _category) {
  const bookCard = document.createElement("div");
  bookCard.className = "book_card";

  bookCard.addEventListener("click", () => {
    let url =
      "https://www.google.com/search?q=" +
      "Book:" +
      _title +
      " Category:" +
      _category +
      " Author:" +
      _author;
    window.open(url, "_blank");
  });

  const title = document.createElement("h2");
  title.textContent = _title;

  const author = document.createElement("p");
  author.textContent = `Author: ${_author}`;

  const category = document.createElement("p");
  category.textContent = `Category: ${_category}`;

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(category);
  return bookCard;
}

function update_current_page(current_page) {
  const pages_count = Math.ceil(data.length / 25);
  if (current_page > pages_count || current_page < 1) return;
  for (let i = (current_page - 1) * 25 + 1; i <= current_page * 25; i++) {
    const book = data[i - 1];
    const container = document.getElementById("book_container");
    container.innerHTML = "";
    container.appendChild(create_book(book.title, book.author, book.category));
  }
  update_pagentation(current_page);
}
function update_pagentation(current_page = 1) {
  const pages_count = Math.ceil(data.length / 25);
  const selected_pages = new Array(pages_count + 1);
  let want_select = 10;
  for (
    let i = current_page;
    i <= Math.min(pages_count, current_page + 3);
    i++
  ) {
    selected_pages[i] = true;
    want_select--;
  }
  for (let i = 1; i <= pages_count; i++) {
    if (selected_pages[i] || want_select == 0) continue;
    want_select--;
    selected_pages[i] = true;
  }
  for (let i = 1; i <= pages_count; i++) {
    if (!selected_pages[i]) continue;
    const div = document.querySelector(".pages_number");
    div.innerHTML = "";
    const page = document.createElement("span");
    page.textContent = i;
    page.addEventListener("click", () => {
      update_current_page(i);
    });
    div.appendChild(page);
  }
}
