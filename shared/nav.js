// Shared navigation component for QF Tools
// Only visible tools are listed here — hidden tools are accessible by direct URL
(function () {
  const pages = [
    { name: "Explorer", path: "/explorer/" },
    { name: "Tokens", path: "/tokens/" },
    { name: "Gas", path: "/gas/" },
    // Hidden until ready:
    // { name: "Verify", path: "/verify/" },
    // { name: "Scout", path: "/scout/" },
    // { name: "Portfolio", path: "/portfolio/" },
    // { name: "Pools", path: "/pools/" },
    // { name: "Revoke", path: "/revoke/" },
    // { name: "Stats", path: "/stats/" },
    // { name: "Validators", path: "/validators/" },
  ];

  const current = window.location.pathname;

  const nav = document.createElement("nav");
  nav.className = "topnav";
  nav.innerHTML = `
    <a href="/" class="topnav-brand"><span>QF</span> Tools</a>
    <div class="topnav-links">
      ${pages.map((p) =>
        `<a href="${p.path}"${current.startsWith(p.path) ? ' class="active"' : ''}>${p.name}</a>`
      ).join("")}
    </div>
  `;

  document.body.prepend(nav);
})();
