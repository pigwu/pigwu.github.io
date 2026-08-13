(function () {
  var root = document.getElementById("guestbook-comments");
  if (!root) return;

  var issueUrl = "https://github.com/" + root.dataset.owner + "/" + root.dataset.repo + "/issues/" + root.dataset.issue;
  var apiUrl = "https://api.github.com/repos/" + encodeURIComponent(root.dataset.owner) + "/" + encodeURIComponent(root.dataset.repo) + "/issues/" + encodeURIComponent(root.dataset.issue) + "/comments?per_page=100";
  var cachedComments = null;

  function language() {
    return document.documentElement.getAttribute("lang") === "zh" ? "zh" : "en";
  }

  function localized(key) {
    return root.dataset[key + (language() === "zh" ? "Zh" : "En")] || "";
  }

  function text(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function date(value) {
    return new Intl.DateTimeFormat(language() === "zh" ? "zh-CN" : "en", {
      year: "numeric", month: "short", day: "numeric"
    }).format(new Date(value));
  }

  function state(message, failed) {
    root.innerHTML = '<div class="guestbook-status' + (failed ? " is-error" : "") + '"><p>' + text(message) + '</p><a href="' + text(issueUrl) + '" target="_blank" rel="noopener">GitHub &nearr;</a></div>';
  }

  function render(comments) {
    var visible = comments.filter(function (comment) { return comment.user && comment.user.type !== "Bot"; });
    if (root.dataset.sort !== "oldest") visible.reverse();
    visible = visible.slice(0, Math.max(1, Number(root.dataset.limit) || 6));
    if (!visible.length) {
      state(localized("empty"), false);
      return;
    }
    root.innerHTML = visible.map(function (comment, index) {
      var body = text(comment.body).replace(/\r?\n/g, "<br>");
      return '<article class="guestbook-message" style="--message-order:' + index + '">' +
        '<header><a href="' + text(comment.user.html_url) + '" target="_blank" rel="noopener"><img src="' + text(comment.user.avatar_url) + '&s=72" alt=""><strong>@' + text(comment.user.login) + '</strong></a><time datetime="' + text(comment.created_at) + '">' + text(date(comment.created_at)) + '</time></header>' +
        '<p>' + body + '</p></article>';
    }).join("");
  }

  fetch(apiUrl, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (response) { if (!response.ok) throw new Error("GitHub API"); return response.json(); })
    .then(function (comments) { cachedComments = comments; render(comments); })
    .catch(function () { state(localized("error"), true); });

  window.addEventListener("site-language-change", function () {
    if (cachedComments) { render(cachedComments); return; }
    var status = root.querySelector(".guestbook-status p");
    if (status) status.textContent = localized(status.closest(".is-error") ? "error" : "empty");
  });
})();
