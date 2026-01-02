const API_URL = "http://localhost:8080/api/tasks";

document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    fetch(API_URL)
        .then(res => res.json())
        .then(tasks => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";

            tasks.forEach(task => {
                const card = document.createElement("div");
                card.className = "task-card";

                card.innerHTML = `
                    <div class="task-info">
                        <div class="task-title">${task.title}</div>
                        <div class="task-desc">${task.description}</div>
                        <span class="status ${task.status === "COMPLETED" ? "completed" : "pending"}">
                            ${task.status}
                        </span>
                    </div>
                    <div class="actions">
                        <button class="complete" onclick="completeTask(${task.id})">Done</button>
                        <button class="edit" onclick="editTask(${task.id}, '${escapeText(task.title)}', '${escapeText(task.description)}')">Edit</button>
                        <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;

                list.appendChild(card);
            });
        });
}

function addTask() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    }).then(() => {
        resetForm();
        loadTasks();
    });
}

function editTask(id, title, description) {
    document.getElementById("taskId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;

    document.getElementById("addBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
    document.getElementById("cancelBtn").style.display = "inline-block";
}

function updateTask() {
    const id = document.getElementById("taskId").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(task => {
            task.title = title;
            task.description = description;

            fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            }).then(() => {
                resetForm();
                loadTasks();
            });
        });
}

function completeTask(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(task => {
            task.status = "COMPLETED";
            fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task)
            }).then(loadTasks);
        });
}

function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(loadTasks);
}

function resetForm() {
    document.getElementById("taskId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    document.getElementById("addBtn").style.display = "inline-block";
    document.getElementById("updateBtn").style.display = "none";
    document.getElementById("cancelBtn").style.display = "none";
}

function escapeText(text) {
    return text.replace(/'/g, "\\'");
}
