(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var path = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
    var key = a.getAttribute("data-nav");
    var map = {
      home: ["/SCF", "/SCF/index.html", "/SCF/", "/"],
      divisions: ["/SCF/divisions", "/SCF/divisions.html"],
      stock: ["/SCF/stock-book", "/SCF/stock-book.html"],
      about: ["/SCF/about", "/SCF/about.html"],
      news: ["/SCF/news", "/SCF/news.html", "/SCF/news-article", "/SCF/news-article.html"],
      careers: ["/SCF/careers", "/SCF/careers.html"],
      contact: ["/SCF/contact", "/SCF/contact.html"]
    };
    var hits = map[key] || [];
    if (hits.some(function (h) { return path === h || path.endsWith(h.replace("/SCF", "")); })) {
      a.classList.add("active");
    }
  });
})();
