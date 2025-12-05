// Load from localStorage or initialize
let workspaces = JSON.parse(localStorage.getItem("workspaces")) || [];

const form = document.getElementById("workspaceForm");
const workspaceList = document.getElementById("workspaceList");

// Save to localStorage
function save() {
  localStorage.setItem("workspaces", JSON.stringify(workspaces));
}

// Render workspaces
function render() {
  workspaceList.innerHTML = "";
  workspaces.forEach((ws, i) => {
    const div = document.createElement("div");
    div.className = "workspace";
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h2>${ws.name}</h2>
        <button class="delete-btn" onclick="deleteWorkspace(${i})">Delete Workspace</button>
      </div>
      <input type="file" id="fileInput${i}" style="margin-top:10px;" />
      <button onclick="uploadProject(${i})" style="margin-top:10px;">Upload Project</button>
      <div class="project-list" id="projectList${i}"></div>
    `;
    workspaceList.appendChild(div);
    renderProjects(i);
  });
}

// Render projects
function renderProjects(wsIndex) {
  const list = document.getElementById(`projectList${wsIndex}`);
  list.innerHTML = "";
  workspaces[wsIndex].projects.forEach((proj, j) => {
    const item = document.createElement("div");
    item.className = "project-item";
    item.innerHTML = `
      <span>${proj.name}</span>
      <div>
        <a href="${proj.url}" download>Download</a>
        <button class="delete-btn" onclick="deleteProject(${wsIndex}, ${j})">Delete</button>
      </div>
    `;
    list.appendChild(item);
  });
}

// Add new workspace
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("workspaceName").value.trim();
  if (name) {
    workspaces.push({ name, projects: [] });
    save();
    render();
    form.reset();
  }
});

// Delete workspace
function deleteWorkspace(i) {
  if (confirm("Delete this workspace?")) {
    workspaces.splice(i, 1);
    save();
    render();
  }
}

// Upload project (stores file as base64 string)
function uploadProject(i) {
  const input = document.getElementById(`fileInput${i}`);
  const file = input.files[0];
  if (!file) return alert("Please select a file");

  const reader = new FileReader();
  reader.onload = function (e) {
    workspaces[i].projects.push({ name: file.name, url: e.target.result });
    save();
    renderProjects(i);
    input.value = "";
  };
  reader.readAsDataURL(file);
}

// Delete project
function deleteProject(wsIndex, projIndex) {
  workspaces[wsIndex].projects.splice(projIndex, 1);
  save();
  renderProjects(wsIndex);
}

// Initial render
render();
