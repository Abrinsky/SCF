(function () {
  var DATA_URL = "/SCF/data/jobs.json";
  var mount = document.getElementById("job-detail");
  if (!mount) return;

  function escapeHtml(str) {
    return String(str == null ? "" : str)
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

  function applyLink(job) {
    if (job.applyHref) {
      return {
        href: job.applyHref,
        label: "Official careers page",
        external: /^https?:\/\//i.test(job.applyHref)
      };
    }
    if (job.applyEmail) {
      return {
        href: "mailto:" + job.applyEmail + "?subject=" + encodeURIComponent("Sample application: " + (job.title || "Open role")),
        label: "Email to ask about the role",
        external: false
      };
    }
    return {
      href: "https://www.siouxcityfoundry.com/employ.lasso",
      label: "Official careers page",
      external: true
    };
  }

  function renderError(message) {
    mount.innerHTML =
      '<section class="page-hero"><div class="container">' +
        '<div class="eyebrow">Sample job detail</div>' +
        "<h1>Role not found</h1>" +
        '<p>' + escapeHtml(message) + '</p>' +
      "</div></section>" +
      '<section class="section"><div class="container"><a class="btn btn-ghost" href="/SCF/careers.html">Back to careers</a></div></section>';
  }

  function renderJob(job) {
    var detail = job.detail || {};
    var focusAreas = Array.isArray(detail.focusAreas) ? detail.focusAreas : [];
    var apply = applyLink(job);
    var applyTarget = apply.external ? ' target="_blank" rel="noopener"' : "";
    var posted = formatDate(job.posted);
    var focusMarkup = focusAreas.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("");

    document.title = (job.title || "Sample Job Detail") + " | Sample Careers | Sioux City Foundry Co.";
    mount.innerHTML =
      '<section class="page-hero"><div class="container">' +
        '<div class="eyebrow">Sample job detail</div>' +
        "<h1>" + escapeHtml(job.title || "Open role") + "</h1>" +
        '<p class="job-detail-lead">' + escapeHtml(detail.overview || job.summary || "Sample role information.") + "</p>" +
        '<div class="badge-row">' +
          '<span class="badge">' + escapeHtml(job.department || "Sample role") + "</span>" +
          '<span class="badge">' + escapeHtml(job.type || "Role") + "</span>" +
          '<span class="badge">' + escapeHtml(job.location || "Location not listed") + "</span>" +
        "</div>" +
      "</div></section>" +
      '<section class="section"><div class="container job-detail-layout">' +
        '<article class="job-detail-card">' +
          '<div class="eyebrow">Role overview</div>' +
          '<h2>What this sample covers</h2>' +
          '<p>' + escapeHtml(detail.overview || job.summary || "Sample role information.") + "</p>" +
          (focusMarkup ? '<h3>Focus areas</h3><ul class="feature-list">' + focusMarkup + "</ul>" : "") +
          '<p class="sample-note"><strong>Sample notice:</strong> This is demonstration content for the Abrinsky/SCF sample site. It is not a live hiring notice, and no pay rate or hiring status is provided here.</p>' +
        "</article>" +
        '<aside class="side-panel job-detail-actions">' +
          '<h4>Interested in this sample role?</h4>' +
          '<p>Confirm whether a real opening exists through the official employment flow before applying.</p>' +
          '<a class="btn btn-primary" href="' + escapeHtml(apply.href) + '"' + applyTarget + ">" + escapeHtml(apply.label) + "</a>" +
          (posted ? '<p class="job-posted">Sample posted date: ' + escapeHtml(posted) + "</p>" : "") +
          '<a class="text-link" href="/SCF/careers.html">Back to all sample roles</a>' +
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
