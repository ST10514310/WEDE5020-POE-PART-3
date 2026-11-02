document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Product category filters and live search
  var filterButtons = document.querySelectorAll(".filter-btn");
  var productCards = document.querySelectorAll(".card[data-category]");
  var searchBox = document.getElementById("product-search");
  var count = document.getElementById("product-count");
  var activeCategory = "all";
  function updateProducts() {
    var term = searchBox ? searchBox.value.toLowerCase().trim() : "";
    var shown = 0;
    productCards.forEach(function (card) {
      var categoryMatch = activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
      var textMatch = card.textContent.toLowerCase().indexOf(term) !== -1;
      var visible = categoryMatch && textMatch;
      card.style.display = visible ? "flex" : "none";
      if (visible) shown++;
    });
    if (count) count.textContent = "Showing " + shown + " of " + productCards.length + " products";
  }
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) { item.classList.remove("is-active"); });
      button.classList.add("is-active");
      activeCategory = button.getAttribute("data-filter");
      updateProducts();
    });
  });
  if (searchBox) searchBox.addEventListener("input", updateProducts);

  // Responsive image lightbox for product photographs
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Enlarged product photograph");
  lightbox.innerHTML = '<button type="button" aria-label="Close image">&times;</button><img alt="">';
  document.body.appendChild(lightbox);
  var largeImage = lightbox.querySelector("img");
  function closeLightbox() { lightbox.classList.remove("is-open"); largeImage.src = ""; }
  document.querySelectorAll(".card-media img").forEach(function (img) {
    img.addEventListener("click", function () {
      largeImage.src = img.currentSrc || img.src;
      largeImage.alt = img.alt;
      lightbox.classList.add("is-open");
      lightbox.querySelector("button").focus();
    });
  });
  lightbox.querySelector("button").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (event) { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeLightbox(); });

  // Validate forms and open an email with the submitted details
  document.querySelectorAll(".enquiry-form, .contact-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var subject = form.classList.contains("enquiry-form") ? "Bakery product enquiry" : "Website contact message";
      var body = [];
      data.forEach(function (value, key) { body.push(key + ": " + value); });
      var confirmation = form.querySelector(".form-confirmation");
      if (confirmation) confirmation.style.display = "block";
      window.location.href = "mailto:hello@sweetharvestbakery.co.za?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body.join("\n"));
    });
  });
});
