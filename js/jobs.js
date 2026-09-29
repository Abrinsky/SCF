(function () {
  var DATA_URL = "/SCF/data/jobs.json";
  var mount = document.getElementById("jobs-list");
  if (!mount) return;

  function escapeHtml(str) {
    return String(str)
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
    var m = parseInt(parts[1], 10) - 1;
    var d = parseInt(parts[2], 10);
    var y = parts[0];
    if (m < 0 || m > 11 || !d) return iso;
    return months[m] + " " + d + ", " + y;
  }

  function applyLink(job) {
    if (job.applyHref) {
      return {
        href: job.applyHref,
        label: "Apply / learn more",
        external: /^https?:\/\//i.test(job.applyHref)
      };
    }
    if (job.applyEmail) {
      return {
        href: "mailto:" + job.applyEmail + "?subject=" + encodeURIComponent("Application: " + (job.title || "Open role")),
        label: "Email to apply",
        external: false
      };
    }
    return {
      href: "https://www.siouxcityfoundry.com/employ.lasso",
      label: "Official careers page",
      external: true
    };
  }

  function jobCard(job) {
    var link = applyLink(job);
    var target = link.external ? ' target="_blank" rel="noopener"' : "";
    var posted = formatDate(job.posted);
    return (
      '<article class="job-card">' +
        '<div class="job-card-top">' +
          "<h3>" + escapeHtml(job.title || "Open role") + "</h3>" +
          '<div class="job-tags">' +
            (job.department ? '<span class="job-tag">' + escapeHtml(job.department) + "</span>" : "") +
            (job.type ? '<span class="job-tag job-tag--type">' + escapeHtml(job.type) + "</span>" : "") +
          "</div>" +
        "</div>" +
        '<p class="job-location">' + escapeHtml(job.location || "") + "</p>" +
        "<p>" + escapeHtml(job.summary || "") + "</p>" +
        '<div class="job-card-footer">' +
          (posted ? '<span class="job-posted">Posted ' + posted + "</span>" : "<span></span>") +
          '<a class="btn btn-primary" href="' + link.href + '"' + target + ">" + escapeHtml(link.label) + "</a>" +
        "</div>" +
      "</article>"
    );
  }

  fetch(DATA_URL, { credentials: "same-origin" })
    .then(function (res) {
      if (!res.ok) throw new Error("jobs fetch " + res.status);
      return res.json();
    })
    .then(function (items) {
      if (!Array.isArray(items)) throw new Error("jobs json not array");
      var live = items.filter(function (j) { return j && j.published === true; });
      live.sort(function (a, b) {
        return String(b.posted || "").localeCompare(String(a.posted || ""));
      });
      if (!live.length) {
        mount.innerHTML =
          '<div class="jobs-empty">' +
            "<h3>No sample openings listed right now</h3>" +
            "<p>Published jobs appear here when <code>published</code> is true in <code>data/jobs.json</code>. " +
            'For live hiring, use the <a href="https://www.siouxcityfoundry.com/employ.lasso" target="_blank" rel="noopener">official employment page</a>.</p>' +
          "</div>";
        return;
      }
      mount.innerHTML = live.map(jobCard).join("");
    })
    .catch(function () {
      mount.innerHTML =
        '<div class="jobs-empty">' +
          "<h3>Unable to load job listings</h3>" +
          "<p>Check <code>data/jobs.json</code> after deploy, or visit the " +
          '<a href="https://www.siouxcityfoundry.com/employ.lasso" target="_blank" rel="noopener">official careers page</a>.</p>' +
        "</div>";
    });
})();
