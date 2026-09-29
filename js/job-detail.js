(function () {
  var DATA_URL = "/SCF/data/jobs.json";
  var CAREERS_URL = "/SCF/careers.html";
  var OFFICIAL_URL = "https://www.siouxcityfoundry.com/employ.lasso";
  var mount = document.getElementById("job-detail");
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

  function listMarkup(items) {
    return list(items).map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("");
  }

  function detailSection(title, items, className) {
    var values = list(items);
    if (!values.length) return "";
    return (
      '<section class="job-section' + (className ? " " + className : "") + '">' +
        "<h3>" + escapeHtml(title) + "</h3>" +
        '<ul class="feature-list">' + listMarkup(values) + "</ul>" +
      "</section>"
    );
  }

  function applyLinks(job) {
    var email = job.applyEmail;
    var links = [];
    if (email) {
      links.push({
        href: "mailto:" + email + "?subject=" + encodeURIComponent("Question about " + (job.title || "this sample role")),
        label: "Email HR about this role",
        className: "btn btn-primary",
        external: false
      });
    }
    links.push({
      href: job.applyHref || OFFICIAL_URL,
      label: "Open official careers page",
      className: email ? "btn btn-ghost" : "btn btn-primary",
      external: /^https?:\/\//i.test(job.applyHref || OFFICIAL_URL)
    });
    return links;
  }

  function linkMarkup(link) {
    var target = link.external ? ' target="_blank" rel="noopener"' : "";
    return '<a class="' + link.className + '" href="' + escapeHtml(link.href) + '"' + target + ">" + escapeHtml(link.label) + "</a>";
  }

  function fact(label, value, href) {
    if (!value) return "";
    var content = href
      ? '<a href="' + escapeHtml(href) + '">' + escapeHtml(value) + "</a>"
      : escapeHtml(value);
    return "<dt>" + escapeHtml(label) + "</dt><dd>" + content + "</dd>";
  }

  function renderError(message) {
    mount.innerHTML =
      '<section class="page-hero"><div class="container">' +
        '<div class="eyebrow">Sample job detail</div>' +
        "<h1>Role not found</h1>" +
        "<p>" + escapeHtml(message) + "</p>" +
      "</div></section>" +
      '<section class="section"><div class="container"><a class="btn btn-ghost" href="' + CAREERS_URL + '">Back to careers</a></div></section>';
  }

  function renderJob(job) {
    var detail = job.detail || {};
    var posted = formatDate(job.posted);
    var links = applyLinks(job);
    var contactEmail = detail.hrEmail ? "mailto:" + detail.hrEmail : "";
    var contactPhone = detail.hrPhone ? "tel:" + String(detail.hrPhone).replace(/[^0-9+]/g, "") : "";
    var badges = [job.department, job.type, job.location].filter(Boolean).map(function (item) {
      return '<span class="badge">' + escapeHtml(item) + "</span>";
    }).join("");

    document.title = (job.title || "Sample Job Detail") + " | Sample Careers | Sioux City Foundry Co.";
    mount.innerHTML =
      '<section class="page-hero job-detail-hero"><div class="container">' +
        '<div class="eyebrow">Sample job detail</div>' +
        "<h1>" + escapeHtml(job.title || "Open role") + "</h1>" +
        '<p class="job-detail-lead">' + escapeHtml(detail.description || job.summary || "Sample role information.") + "</p>" +
        '<div class="badge-row">' + badges + "</div>" +
        (posted ? '<p class="job-posted">Sample posted date: ' + escapeHtml(posted) + "</p>" : "") +
      "</div></section>" +
      '<section class="section"><div class="container job-detail-layout">' +
        '<article class="job-detail-card">' +
          '<div class="eyebrow">Role overview</div>' +
          '<h2>What to expect</h2>' +
          '<p class="job-description">' + escapeHtml(detail.description || job.summary || "Sample role information.") + "</p>" +
          detailSection("Required experience", detail.requiredExperience) +
          detailSection("Other requirements", detail.otherRequirements) +
          detailSection("Notes", detail.notes, "job-notes") +
          '<p class="sample-note"><strong>Sample notice:</strong> This is demonstration content for the Abrinsky/SCF sample site. Confirm the current opening, compensation, schedule, and application steps through the official employment page before applying.</p>' +
        "</article>" +
        '<aside class="job-side-column">' +
          '<section class="side-panel job-facts">' +
            '<h2>Role facts</h2>' +
            '<dl>' +
              fact("Type", job.type) +
              fact("Shift", detail.shift) +
              fact("Location", job.location) +
              fact("Pay", detail.payRate) +
              fact("Education", detail.education) +
              fact("Experience", detail.yearsExperience) +
              fact("Documents", list(detail.requiredDocuments).join(", ")) +
              fact("Supervisor", detail.supervisor) +
            "</dl>" +
          "</section>" +
          '<section class="side-panel job-detail-actions">' +
            '<h2>Interested?</h2>' +
            '<p>Use the official employment page to confirm whether this sample role is currently open.</p>' +
            links.map(linkMarkup).join("") +
            '<a class="text-link" href="' + CAREERS_URL + '">Back to all sample roles</a>' +
          "</section>" +
          ((detail.hrName || detail.hrEmail || detail.hrPhone) ?
            '<section class="side-panel job-contact"><h2>HR contact</h2>' +
              (detail.hrName ? '<p><strong>' + escapeHtml(detail.hrName) + "</strong></p>" : "") +
              (detail.hrEmail ? '<p><a href="' + escapeHtml(contactEmail) + '">' + escapeHtml(detail.hrEmail) + "</a></p>" : "") +
              (detail.hrPhone ? '<p><a href="' + escapeHtml(contactPhone) + '">' + escapeHtml(detail.hrPhone) + "</a></p>" : "") +
            "</section>" : "") +
        "</aside>" +
      "</div></section>";
  }

  var id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    renderError("Choose a role from the sample careers page.");
    return;
  }

  fetch(DATA_URL, { credentials: "same-origin" })
    .then(function (res) {
      if (!res.ok) throw new Error("jobs fetch " + res.status);
      return res.json();
    })
    .then(function (items) {
      if (!Array.isArray(items)) throw new Error("jobs json not array");
      var job = items.find(function (item) {
        return item && item.id === id && item.published === true;
      });
      if (!job) {
        renderError("That sample role is not published in data/jobs.json.");
        return;
      }
      renderJob(job);
    })
    .catch(function () {
      renderError("Unable to load this sample role. Check data/jobs.json after deploy.");
    });
})();
