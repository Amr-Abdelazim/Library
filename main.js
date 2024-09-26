import { get_data } from "./book_data.js";

const data = get_data();
let CURRENT_PAGE_NUMBER = 1;

function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

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
  title.style.fontSize = Math.max(30 - 0.2 * _title.length, 10) + "px";
  const author = document.createElement("p");
  author.textContent = `Author: ${_author}`;

  const category = document.createElement("p");
  category.textContent = `Category: ${_category}`;

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(category);
  return bookCard;
}

function update_current_page(current_page, data) {
  const pages_count = Math.ceil(data.length / 25);
  const container = document.getElementById("book_container");
  container.innerHTML = " ";
  if (current_page > pages_count || current_page < 1) return;
  if (data.length === 0) return;
  for (
    let i = (current_page - 1) * 25 + 1;
    i <= Math.min(current_page * 25, data.length);
    i++
  ) {
    const book = data[i - 1];
    container.appendChild(create_book(book.title, book.author, book.category));
  }

  scrollToTop();
  update_pagentation(current_page, data);
}
function update_pagentation(current_page = 1, data) {
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
  for (let i = current_page - 1; i >= 0; i--) {
    if (selected_pages[i] || want_select == 0) continue;
    want_select--;
    selected_pages[i] = true;
  }
  for (let i = current_page + 4; i <= pages_count; i++) {
    if (selected_pages[i] || want_select == 0) continue;
    want_select--;
    selected_pages[i] = true;
  }
  const div = document.querySelector(".pages_number");
  div.innerHTML = "";
  if (data.length == 0) return;
  for (let i = 1; i <= pages_count; i++) {
    if (!selected_pages[i]) continue;
    const page_container = document.createElement("div");
    page_container.className = "page-container";
    const page = document.createElement("span");
    page.textContent = i;
    const img = document.createElement("img");
    img.className = "pagentation-icon";
    img.src = "images/book.png";
    img.addEventListener("click", () => {
      update_current_page(i, data);
      CURRENT_PAGE_NUMBER = i;
    });
    page_container.appendChild(img);
    if (i == current_page) {
      img.src = "images/open-book.png";
      page.style.color = "#e0c49c";
    }
    page.addEventListener("click", () => {
      update_current_page(i, data);
      CURRENT_PAGE_NUMBER = i;
    });
    page_container.appendChild(page);
    div.appendChild(page_container);
  }
}

update_current_page(CURRENT_PAGE_NUMBER, data);

const prv_container = document.querySelector(".prev-container");
prv_container.addEventListener("click", () => {
  update_current_page(CURRENT_PAGE_NUMBER - 1, data);
  CURRENT_PAGE_NUMBER--;
});

const nxt_container = document.querySelector(".next-container");
nxt_container.addEventListener("click", () => {
  update_current_page(CURRENT_PAGE_NUMBER + 1, data);
  CURRENT_PAGE_NUMBER++;
});

const nxt_icon = document.querySelector("#next-icon");
nxt_icon.addEventListener("mouseenter", () => {
  nxt_icon.src = "images/next-hover.png";
});

nxt_icon.addEventListener("mouseleave", () => {
  nxt_icon.src = "images/next.png";
});

const prev_icon = document.querySelector("#prev-icon");
prev_icon.addEventListener("mouseenter", () => {
  prev_icon.src = "images/previous-hover.png";
});

prev_icon.addEventListener("mouseleave", () => {
  prev_icon.src = "images/previous.png";
});

// Search

function sub_in_word(substr, word) {
  substr = substr.toLowerCase();
  word = word.toLowerCase();
  function z_function(s) {
    let n = s.length;
    let z = new Array(n);
    for (let i = 0; i < n; i++) z[i] = 0;
    let l = 0,
      r = 0;
    for (let i = 1; i < n; i++) {
      if (i < r) {
        z[i] = Math.min(r - i, z[i - l]);
      }
      while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
        z[i]++;
      }
      if (i + z[i] > r) {
        l = i;
        r = i + z[i];
      }
    }
    return z;
  }
  let z = z_function(substr + word);
  for (let i = substr.length; i < z.length; i++) {
    if (z[i] >= substr.length) {
      return true;
    }
  }
  return false;
}

const search_bar = document.querySelector("#search-input");

search_bar.addEventListener("input", () => {
  let new_data = [];
  for (let i = 0; i < data.length; i++) {
    if (
      sub_in_word(search_bar.value, data[i].title) ||
      sub_in_word(search_bar.value, data[i].author) ||
      sub_in_word(search_bar.value, data[i].category)
    ) {
      new_data.push(data[i]);
    }
  }
  update_current_page(1, new_data);
});
