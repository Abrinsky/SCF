(function () {
  var DATA_URL = "/SCF/data/news.json";
  var NEWS_URL = "/SCF/news.html";
  var mount = document.getElementById("news-article");
  if (!mount) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length < 3) return iso;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    if (month < 0 || month > 11 || !day) return iso;
    return months[month] + " " + day + ", " + parts[0];
  }

  function list(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value == null || value === "") return [];
    return [String(value)];
  }

  function paragraphs(items) {
    return list(items).map(function (item) {
      return "<p>" + escapeHtml(item) + "</p>";
    }).join("");
  }

  function highlights(items) {
    var values = list(items);
    if (!values.length) return "";
    return (
      '<section class="job-section">' +
        "<h3>Key points</h3>" +
        '<ul class="feature-list">' +
          values.map(function (item) {
            return "<li>" + escapeHtml(item) + "</li>";
          }).join("") +
        "</ul>" +
      "</section>"
    );
  }

  function asideLinks(links) {
    var values = list(links);
    if (!values.length) return "";
    return values.map(function (link) {
      if (!link || !link.href) return "";
      var external = /^https?:\/\//i.test(link.href);
      var target = external ? ' target="_blank" rel="noopener"' : "";
      return '<a class="btn btn-ghost" href="' + escapeHtml(link.href) + '"' + target + ">" + escapeHtml(link.label || link.href) + "</a>";
    }).join("");
  }

  function renderError(message) {
    mount.innerHTML =
      '<section class="page-hero"><div class="container">' +
        '<div class="eyebrow">Sample news article</div>' +
        "<h1>Article not found</h1>" +
        "<p>" + escapeHtml(message) + "</p>" +
      "</div></section>" +
      '<section class="section"><div class="container"><a class="btn btn-ghost" href="' + NEWS_URL + '">Back to news</a></div></section>';
  }

  function renderArticle(item) {
    var detail = item.detail || {};
    var dated = formatDate(item.date);
    var media = item.image
      ? '<div class="news-article-media"><img src="' + escapeHtml(item.image) + '" alt="" /></div>'
      : "";

    document.title = (item.title || "Sample News Article") + " | Sample News | Sioux City Foundry Co.";

    mount.innerHTML =
      '<section class="page-hero job-detail-hero"><div class="container">' +
        '<div class="eyebrow">' + escapeHtml(detail.eyebrow || "Sample news article") + "</div>" +
        "<h1>" + escapeHtml(item.title || "News") + "</h1>" +
        '<p class="job-detail-lead">' + escapeHtml(detail.lead || item.summary || "Sample article.") + "</p>" +
        (dated ? '<p class="job-posted"><time datetime="' + escapeHtml(item.date) + '">' + escapeHtml(dated) + "</time></p>" : "") +
      "</div></section>" +
      '<section class="section"><div class="container job-detail-layout">' +
        '<article class="job-detail-card">' +
          media +
          '<div class="eyebrow">Article</div>' +
          "<h2>" + escapeHtml(item.title || "News") + "</h2>" +
          paragraphs(detail.body && detail.body.length ? detail.body : [item.summary]) +
          highlights(detail.highlights) +
          (detail.notes
            ? '<p class="sample-note"><strong>Sample notice:</strong> ' + escapeHtml(detail.notes) + "</p>"
            : '<p class="sample-note"><strong>Sample notice:</strong> Demonstration content for the Abrinsky/SCF sample site.</p>') +
        "</article>" +
        '<aside class="job-side-column">' +
          '<section class="side-panel job-facts">' +
            "<h2>At a glance</h2>" +
            "<dl>" +
              (dated ? "<dt>Date</dt><dd>" + escapeHtml(dated) + "</dd>" : "") +
              "<dt>Type</dt><dd>Sample news article</dd>" +
              "<dt>Source file</dt><dd>data/news.json</dd>" +
            "</dl>" +
          "</section>" +
          '<section class="side-panel job-detail-actions">' +
            "<h2>" + escapeHtml(detail.asideTitle || "More") + "</h2>" +
            "<p>Continue browsing sample news and company pages.</p>" +
            asideLinks(detail.asideLinks) +
            '<a class="text-link" href="' + NEWS_URL + '">Back to all news</a>' +
          "</section>" +
        "</aside>" +
      "</div></section>";
  }

  var id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    renderError("Choose an article from the sample news page.");
    return;
  }

  fetch(DATA_URL, { credentials: "same-origin" })
    .then(function (res) {
      if (!res.ok) throw new Error("news fetch " + res.status);
      return res.json();
    })
    .then(function (items) {
      if (!Array.isArray(items)) throw new Error("news json not array");
      var item = items.find(function (entry) {
        return entry && entry.id === id;
      });
      if (!item) {
        renderError("That sample article is not in data/news.json.");
        return;
      }
      // Wine (and any external) items should open their href, not a local article shell.
      if (item.external || /^https?:\/\//i.test(item.href || "")) {
        window.location.replace(item.href);
        return;
      }
      renderArticle(item);
    })
    .catch(function () {
      renderError("Unable to load this sample article. Check data/news.json after deploy.");
    });
})();
