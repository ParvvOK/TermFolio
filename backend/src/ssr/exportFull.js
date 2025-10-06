const express = require("express");
const router = express.Router();

router.post("/full", async (req, res) => {
  try {
    const { portfolio } = req.body;
    if (!portfolio)
      return res.status(400).json({ error: "Portfolio data missing" });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${portfolio.name || "Termfolio"}</title>
<style>
  html, body { margin:0; padding:0; font-family: monospace; background:#0f172a; color:#f8fafc; min-height:100%; }
  body { display:flex; justify-content:center; align-items:center; }

  /* Desktop TermWindow */
  .term-window { display:flex; justify-content:center; align-items:center; width:100%; min-height:100vh; }
  .term-container { background:#1e293b; width:90%; max-width:1280px; border-radius:0.5rem; box-shadow:0 10px 25px rgba(0,0,0,0.3); display:flex; flex-direction:column; overflow:hidden; }
  .term-header { display:flex; gap:0.5rem; padding:0.5rem 0.75rem; background:#334155; border-top-left-radius:0.5rem; border-top-right-radius:0.5rem; }
  .dot { width:0.75rem; height:0.75rem; border-radius:50%; }
  .dot.red { background:#ef4444; }
  .dot.yellow { background:#facc15; }
  .dot.green { background:#22c55e; }

  .term-body { 
    padding:1rem;
    display:grid;
    grid-template-columns:repeat(10,1fr);
    gap:1rem;
    grid-auto-rows: min-content;
  }

  #tabBody p,
  #tabBodyMobile p {
    margin: 0.2rem 0;
    line-height: 1.1rem;
  }
  #tabBody ul,
  #tabBodyMobile ul {
    margin: 0.3rem 0 0 1rem;
    padding: 0;
  }

  .about-description {
    font-size: 1.15rem;
    padding: 1rem 0;
    line-height: 1.6rem;
    white-space: pre-wrap; /* preserve spaces and newlines */
  }

  .col-span-6 { grid-column: span 6; display:flex; flex-direction:column; gap:0.5rem; background:#334155; border-radius:0.375rem; padding:1rem; }

  .col-span-4 { 
    grid-column: span 4; 
    display:flex; 
    gap:1rem; 
    align-items:flex-start; 
    background:#334155; 
    border-radius:0.375rem; 
    padding:1rem; 
  }

  .profile-img-container { 
    width:90px; 
    height:130px; 
    margin:0; 
    flex-shrink:0; 
  }

  .profile-info { 
    display:flex; 
    flex-direction:column; 
    justify-content:space-evenly; 
    gap:0.25rem; 
  }

  .profile-info p {
    margin:0.2rem 0;
    line-height:1.1rem;
  }
  .profile-info ul {
    margin:0.3rem 0 0 1rem;
    padding:0;
  }

  .col-span-7 { grid-column: span 7; display:flex; flex-direction:column; gap:0.5rem; background:#334155; border-radius:0.375rem; padding:1rem; }
  .col-span-3 { grid-column: span 3; display:flex; flex-direction:column; gap:0.5rem; background:#334155; border-radius:0.375rem; padding:1rem; }

  .text-lime-500 { color:#84cc16; }
  .text-slate-50 { color:#f8fafc; }
  .font-bold { font-weight:bold; }
  .cursor { display:inline-block; width:0.9ch; height:1.25rem; background:#84cc16; vertical-align:bottom; }
  .list-disc { list-style: disc; padding-left:1.5rem; }
  img { object-fit:cover; width:100%; height:100%; border-radius:0.375rem; }
  input { background: transparent; border: none; color: #f8fafc; flex:1; font-size:1.25rem; outline:none; caret-color: transparent; /* hide cursor */ }
  .flex { display:flex; }
  .items-center { align-items:center; }
  .gap-2 { gap:0.5rem; }
  .flex-col { flex-direction:column; }
  .text-xl { font-size:1.25rem; }
  .text-2xl { font-size:1.5rem; }
  .text-3xl { font-size:1.875rem; }
  .font-use { font-family: monospace; }
  .justify-center { justify-content:center; }

  .terminal-history {
    height:8rem;               
    overflow:auto;
    padding:0.5rem;
    background:#1e293b;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    color:#84cc16;             
    border-radius:0.375rem;    
  }

  .quickies > div.font-use.text-3xl { color: #84cc16; } 
  .quickies p { margin:0; padding:0; line-height:1.25rem; cursor:pointer; }

  .mobile-layout { display:none; }
  @media(max-width:767px){
    .term-window { display:none; }
    .mobile-layout { display:block; }
    body { display:block; background:#0f172a; padding:1rem; }
    .mobile-section { margin-bottom:1rem; background:#334155; padding:1rem; border-radius:0.375rem; }
    .mobile-flex { display:flex; gap:0.5rem; }
    .mobile-profile-img { width:90px; height:130px; margin:0; }
    .mobile-section .profile-info { display:flex; flex-direction:column; justify-content:space-evenly; gap:0.25rem; margin:0; }
    .about-description { white-space: pre-wrap; } /* preserve spaces/newlines in mobile */
  }
</style>
</head>
<body>
<!-- Desktop Layout -->
<div class="term-window">
  <div class="term-container">
    <div class="term-header">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="term-body">
      <div class="col-span-6">
        <div class="text-lime-500" id="prompt">${
          portfolio.name || "guest"
        }@termfolio:~$</div>
        <div class="flex items-center mb-2">
          <span class="cursor" id="cursor"></span>
          <input type="text" id="terminalInput" placeholder="Enter command">
        </div>
        <div class="terminal-history" id="history">
          <div class="border-b border-slate-700 pb-1 mb-2 font-bold">Command History</div>
        </div>
      </div>

      <div class="col-span-4">
        <div class="profile-img-container rounded-md shadow-lg overflow-hidden">
          <img src="${portfolio.imageUrl || ""}" alt="Profile"/>
        </div>
        <div class="profile-info">
          <div class="font-use text-3xl text-lime-500 font-bold">${
            portfolio.name || ""
          }</div>
          <p>${portfolio.role || ""}</p>
          <p>${portfolio.availability || ""}</p>
          <p>${portfolio.locationPreference || ""}</p>
          <ul>${
            portfolio.socialLinks
              ? portfolio.socialLinks.map((l) => `<li>${l}</li>`).join("")
              : ""
          }</ul>
        </div>
      </div>

      <div class="col-span-7" id="tabContent">
        <div class="font-use text-3xl text-lime-500 font-bold mb-2" id="tabTitle">About</div>
        <div id="tabBody">
          <p>Name: ${portfolio.name || ""}</p>
          <p>Role: ${portfolio.role || ""}</p>
          <p>Location: ${portfolio.locationPreference || ""}</p>
          <p>Availability: ${portfolio.availability || ""}</p>
          <p class="about-description">${portfolio.description || ""}</p>
          ${
            portfolio.socialLinks
              ? `<ul>${portfolio.socialLinks
                  .map((l) => `<li>${l}</li>`)
                  .join("")}</ul>`
              : ""
          }
        </div>
      </div>

      <div class="col-span-3 quickies">
        <div class="font-use text-3xl text-slate-50 font-bold mb-2">Quickies</div>
        <div>
          ${["about", "projects", "contact", "misc"]
            .map(
              (tab) =>
                `<p onclick="runCommand('${tab}')">❯ run command '${tab}'</p>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Mobile Layout -->
<div class="mobile-layout">
  <div class="mobile-section mobile-flex">
    <div class="mobile-profile-img rounded-md shadow-lg overflow-hidden">
      <img src="${portfolio.imageUrl || ""}" alt="Profile"/>
    </div>
    <div class="profile-info">
      <div class="font-use text-3xl text-lime-500 font-bold">${
        portfolio.name || ""
      }</div>
      <p>${portfolio.role || ""}</p>
      <p>${portfolio.availability || ""}</p>
      <p>${portfolio.locationPreference || ""}</p>
      <ul>${
        portfolio.socialLinks
          ? portfolio.socialLinks.map((l) => `<li>${l}</li>`).join("")
          : ""
      }</ul>
    </div>
  </div>

  <div class="mobile-section" id="tabContentMobile">
    <div class="font-use text-3xl text-lime-500 font-bold mb-2" id="tabTitleMobile">About</div>
    <div id="tabBodyMobile">
      <p>Name: ${portfolio.name || ""}</p>
      <p>Role: ${portfolio.role || ""}</p>
      <p>Location: ${portfolio.locationPreference || ""}</p>
      <p>Availability: ${portfolio.availability || ""}</p>
      <p class="about-description">${portfolio.description || ""}</p>
      ${
        portfolio.socialLinks
          ? `<ul>${portfolio.socialLinks
              .map((l) => `<li>${l}</li>`)
              .join("")}</ul>`
          : ""
      }
    </div>
  </div>

  <div class="mobile-section quickies">
    <div class="font-use text-3xl text-slate-50 font-bold mb-2">Quickies</div>
    <div>
      ${["about", "projects", "contact", "misc"]
        .map(
          (tab) =>
            `<p onclick="runCommandMobile('${tab}')">❯ run command '${tab}'</p>`
        )
        .join("")}
    </div>
  </div>
</div>

<script>
const cursor = document.getElementById('cursor');
if(cursor) setInterval(()=> cursor.style.opacity = cursor.style.opacity==='0'?'1':'0',500);

const input = document.getElementById('terminalInput');
const historyEl = document.getElementById('history');
const tabTitle = document.getElementById('tabTitle');
const tabBody = document.getElementById('tabBody');
let commandHistory = [];
const portfolioData = ${JSON.stringify(portfolio)};

function renderList(arr){
  if(!arr || arr.length===0) return '';
  return '<ul style="list-style:disc;padding-left:1.5rem;">'+arr.map(i=>'<li>'+i+'</li>').join('')+'</ul>';
}

function updateTab(tab){
  tabTitle.textContent = tab.charAt(0).toUpperCase()+tab.slice(1);
  if(tab==='about'){
    tabBody.innerHTML = \`
      <p>Name: \${portfolioData.name}</p>
      <p>Role: \${portfolioData.role}</p>
      <p>Location: \${portfolioData.locationPreference}</p>
      <p>Availability: \${portfolioData.availability}</p>
      <p class="about-description">\${portfolioData.description}</p>
      \${renderList(portfolioData.socialLinks)}
    \`;
  } else if(tab==='projects'){
    tabBody.innerHTML = portfolioData.projects ? portfolioData.projects.map(p=>\`<div><p>\${p.name}</p><p>\${p.github}</p><p>\${p.applink}</p></div>\`).join('') : '';
  } else if(tab==='contact'){
    tabBody.innerHTML = \`<p>Email: \${portfolioData.email}</p><p>Number: \${portfolioData.phone}</p>\${renderList(portfolioData.socialLinks)}\`;
  } else if(tab==='misc'){
    let html='';
    if(portfolioData.hobbies?.length>0) html+='<div><b>Hobbies</b>'+renderList(portfolioData.hobbies)+'</div>';
    if(portfolioData.qualifications?.length>0) html+='<div><b>Qualifications</b>'+renderList(portfolioData.qualifications)+'</div>';
    tabBody.innerHTML = html;
  }
}

function runCommand(cmd){
  if(!cmd) return;
  if(cmd==='clear'){ commandHistory=[]; renderHistory(); return; }
  commandHistory.push(cmd);
  renderHistory();
  updateTab(cmd);
  if(input) input.value='';
}

function renderHistory(){
  if(!historyEl) return;
  historyEl.innerHTML='<div class="border-b border-slate-700 pb-1 mb-2 font-bold">Command History</div>';
  const last5 = commandHistory.slice(-5).reverse();
  last5.forEach(c=>{
    const div=document.createElement('div');
    div.textContent='❯ '+c;
    historyEl.appendChild(div);
  });
}

const tabTitleMobile = document.getElementById('tabTitleMobile');
const tabBodyMobile = document.getElementById('tabBodyMobile');
function runCommandMobile(cmd){
  if(!cmd) return;
  if(cmd==='clear'){ commandHistory=[]; renderHistoryMobile(); return; }
  commandHistory.push(cmd);
  renderHistoryMobile();
  updateTabMobile(cmd);
}

function renderHistoryMobile(){}

function updateTabMobile(tab){
  tabTitleMobile.textContent = tab.charAt(0).toUpperCase()+tab.slice(1);
  if(tab==='about'){
    tabBodyMobile.innerHTML = \`
      <p>Name: \${portfolioData.name}</p>
      <p>Role: \${portfolioData.role}</p>
      <p>Location: \${portfolioData.locationPreference}</p>
      <p>Availability: \${portfolioData.availability}</p>
      <p class="about-description">\${portfolioData.description}</p>
      \${renderList(portfolioData.socialLinks)}
    \`;
  } else if(tab==='projects'){
    tabBodyMobile.innerHTML = portfolioData.projects ? portfolioData.projects.map(p=>\`<div><p>\${p.name}</p><p>\${p.github}</p><p>\${p.applink}</p></div>\`).join('') : '';
  } else if(tab==='contact'){
    tabBodyMobile.innerHTML = \`<p>Email: \${portfolioData.email}</p><p>Number: \${portfolioData.phone}</p>\${renderList(portfolioData.socialLinks)}\`;
  } else if(tab==='misc'){
    let html='';
    if(portfolioData.hobbies?.length>0) html+='<div><b>Hobbies</b>'+renderList(portfolioData.hobbies)+'</div>';
    if(portfolioData.qualifications?.length>0) html+='<div><b>Qualifications</b>'+renderList(portfolioData.qualifications)+'</div>';
    tabBodyMobile.innerHTML = html;
  }
}

if(input){
  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'){
      runCommand(input.value.trim().toLowerCase());
    }
  });
}
</script>
</body>
</html>
`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${portfolio.name || "termfolio"}.html"`
    );
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error("Export route error:", err);
    res.status(500).json({ error: "Failed to export portfolio" });
  }
});

module.exports = router;
