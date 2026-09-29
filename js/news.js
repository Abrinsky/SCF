(function () {
  var DATA_URL = "/SCF/data/news.json";
  var stripEl = document.getElementById("news-strip");
  var listEl = document.getElementById("news-list");
  if (!stripEl && !listEl) return;

  function formatDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length < 3) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    var y = parts[0];
    if (m < 0 || m > 11 || !d) return iso;
    return months[m] + " " + d + ", " + y;
  }

  function resolveHref(href) {
    if (!href) return "/SCF/news.html";
    if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
    if (href.charAt(0) === "/") return href;
    return "/SCF/" + href.replace(/^\.\//, "");
  }

  function isExternal(href) {
    return /^https?:\/\//i.test(href);
  }

  function cardHtml(item) {
    var href = resolveHref(item.href);
    var external = isExternal(href);
    var target = external ? ' target="_blank" rel="noopener"' : "";
    var dateLabel = formatDate(item.date);
    var img = item.image
      ? '<div class="news-card-media"><img src="' + item.image + '" alt="" loading="lazy" /></div>'
      : '<div class="news-card-media news-card-media--ember" aria-hidden="true"></div>';
    return (
      '<a class="news-card" href="' + href + '"' + target + ">" +
        img +
        '<div class="news-card-body">' +
          (dateLabel ? '<time class="news-date" datetime="' + item.date + '">' + dateLabel + "</time>" : "") +
          "<h3>" + escapeHtml(item.title || "Untitled") + "</h3>" +
          "<p>" + escapeHtml(item.summary || "") + "</p>" +
          '<span class="news-card-cta">' + (external ? "Open link" : "Read more") + "</span>" +
        "</div>" +
      "</a>"
    );
  }

  function listItemHtml(item) {
    var href = resolveHref(item.href);
    var external = isExternal(href);
    var target = external ? ' target="_blank" rel="noopener"' : "";
    var dateLabel = formatDate(item.date);
    return (
      '<article class="news-list-item">' +
        '<div class="news-list-meta">' +
          (dateLabel ? '<time datetime="' + item.date + '">' + dateLabel + "</time>" : "") +
        "</div>" +
        "<div>" +
          "<h3><a href=\"" + href + "\"" + target + ">" + escapeHtml(item.title || "Untitled") + "</a></h3>" +
          "<p>" + escapeHtml(item.summary || "") + "</p>" +
        "</div>" +
      "</article>"
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function sortByDateDesc(items) {
    return items.slice().sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
  }

  function setupAutoScroll(track) {
    if (!track || track.children.length < 2) return;
    var paused = false;
    var timer = null;
    var stepMs = 4500;

    function advance() {
      if (paused || document.hidden) return;
      var card = track.querySelector(".news-card");
      if (!card) return;
      var gap = 16;
      var amount = card.getBoundingClientRect().width + gap;
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;
      if (track.scrollLeft + amount >= maxScroll - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: amount, behavior: "smooth" });
      }
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(advance, stepMs);
    }

    track.addEventListener("mouseenter", function () { paused = true; });
    track.addEventListener("mouseleave", function () { paused = false; });
    track.addEventListener("focusin", function () { paused = true; });
    track.addEventListener("focusout", function () { paused = false; });
    track.addEventListener("pointerdown", function () { paused = true; });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) paused = false;
    });
    start();
  }

  fetch(DATA_URL, { credentials: "same-origin" })
    .then(function (res) {
      if (!res.ok) throw new Error("news fetch " + res.status);
      return res.json();
    })
    .then(function (items) {
      if (!Array.isArray(items)) throw new Error("news json not array");
      var sorted = sortByDateDesc(items);

      if (stripEl) {
        if (!sorted.length) {
          stripEl.innerHTML = '<p class="news-empty">No news items yet. Add entries in data/news.json.</p>';
        } else {
          stripEl.innerHTML = sorted.map(cardHtml).join("");
          setupAutoScroll(stripEl);
        }
      }

      if (listEl) {
        if (!sorted.length) {
          listEl.innerHTML = '<p class="news-empty">No news items yet. Add entries in data/news.json.</p>';
        } else {
          listEl.innerHTML = sorted.map(listItemHtml).join("");
        }
      }
    })
    .catch(function () {
      var msg = '<p class="news-empty">Unable to load news right now. Check data/news.json after deploy.</p>';
      if (stripEl) stripEl.innerHTML = msg;
      if (listEl) listEl.innerHTML = msg;
    });
})();
