const linkInput = document.querySelector(".js-shortening-link-input");
const btnShorten = document.querySelector(".js-shortening-link-btn");
const errorMsg = document.querySelector(".js-shortening-link-error-msg");
const itemsContainer = document.querySelector(".js-shortening-link-items");

const api = "https://api.shrtco.de/v2/shorten?url=";
const mobile = innerWidth < 768;

let items = JSON.parse(localStorage.getItem("items")) || [];

if (items.length > 0) {
  itemsContainer.innerHTML = items
    .map((item) => {
      return `
    <div class="shortening-link__item" data-id="${item.id}">
      <p class="shortening-link__link">${item.originalLink}</p>
      <div class="shortening-link__short-link-box">
        <button class="btn-purple shortening-link__btn-delete js-shortening-link-btn-delete" type="button">Delete</button>
        <p class="shortening-link__short-link">${item.shortLink}</p>
        <button class="btn-cyan shortening-link__btn-copy js-shortening-link-btn-copy" type="button">Copy</button>
      </div>
    </div>`;
    })
    .join("");

  selectItems();
}

function selectItems() {
  const btnsCopy = document.querySelectorAll(".js-shortening-link-btn-copy");
  const btnsDelete = document.querySelectorAll(
    ".js-shortening-link-btn-delete"
  );

  function copyLink() {
    const content = this.closest(
      ".shortening-link__short-link-box"
    ).querySelector(".shortening-link__short-link").textContent;

    btnsCopy.forEach((btn) => {
      btn.classList.remove("active");
      btn.textContent = "Copy";
    });

    navigator.clipboard.writeText(content);
    this.classList.add("active");
    this.textContent = "Copied!";
  }

  function deleteItem() {
    const itemEl = this.closest(".shortening-link__item");
    const id = items.findIndex((item) => item.id === +itemEl.dataset.id);

    items = items.filter((item, i) => items[i] !== items[id]);
    itemEl.remove();

    localStorage.setItem("items", JSON.stringify(items));
  }

  btnsCopy.forEach((btn) => btn.addEventListener("click", copyLink));
  btnsDelete.forEach((btn) => btn.addEventListener("click", deleteItem));
}

function addItem(data) {
  let originalLink;

  if (mobile) {
    originalLink =
      data.result.original_link.length > 25
        ? data.result.original_link.slice(0, 22) + "..."
        : data.result.original_link;
  } else {
    originalLink =
      data.result.original_link.length > 50
        ? data.result.original_link.slice(0, 47) + "..."
        : data.result.original_link;
  }

  const id = Math.random() * 1000 + 1;

  const html = `
      <div class="shortening-link__item" data-id="${id}">
        <p class="shortening-link__link">${originalLink}</p>
        <div class="shortening-link__short-link-box">
          <button class="btn-purple shortening-link__btn-delete js-shortening-link-btn-delete" type="button">Delete</button>
          <p class="shortening-link__short-link">${data.result.short_link}</p>
          <button class="btn-cyan shortening-link__btn-copy js-shortening-link-btn-copy" type="button">Copy</button>
        </div>
      </div>`;

  itemsContainer.insertAdjacentHTML("beforeend", html);
  selectItems();

  items.push({ id, originalLink, shortLink: data.result.short_link });
  localStorage.setItem("items", JSON.stringify(items));
}

async function shortenLink() {
  const res = await fetch(api + linkInput.value);
  const data = await res.json();

  if (!data.ok) {
    if (data.error_code === 1) {
      errorMsg.textContent = "Please add a link";
    } else {
      errorMsg.textContent = "Please enter a valid link";
    }

    errorMsg.classList.remove("hidden");
    linkInput.style.borderColor = "red";
    return;
  }

  addItem(data);
  errorMsg.classList.add("hidden");
  linkInput.style.borderColor = "transparent";
  linkInput.value = "";
}

btnShorten.addEventListener("click", shortenLink);
