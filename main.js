document.addEventListener("DOMContentLoaded", () => {
  // ----- To-Do -----
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskTable = document.getElementById("taskTable");

  function addTaskRow(task, dueDate, checked=false) {
    const row = document.createElement("tr");

    const checkCell = document.createElement("td");
    checkCell.className = "checkbox-cell";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkCell.appendChild(checkbox);

    const taskCell = document.createElement("td");
    taskCell.textContent = task;

    const dateCell = document.createElement("td");
    dateCell.textContent = dueDate;

    const today = new Date().toISOString().split("T")[0];
    if (dueDate < today) dateCell.classList.add("overdue");

    if (checked) {
      taskCell.classList.add("done");
      dateCell.classList.add("done");
    }

    checkbox.addEventListener("change", () => {
      taskCell.classList.toggle("done", checkbox.checked);
      dateCell.classList.toggle("done", checkbox.checked);
      saveAll();
    });

    row.appendChild(checkCell);
    row.appendChild(taskCell);
    row.appendChild(dateCell);
    taskTable.appendChild(row);
  }

  addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    const dueDate = dateInput.value;
    if (!task || !dueDate) return;
    addTaskRow(task, dueDate);
    taskInput.value = "";
    dateInput.value = "";
    saveAll();
  });

  // ----- Schedule -----
  const slotTime = document.getElementById("slotTime");
  const slotTitle = document.getElementById("slotTitle");
  const addSlotBtn = document.getElementById("addSlotBtn");
  const clearScheduleBtn = document.getElementById("clearScheduleBtn");
  const scheduleTable = document.getElementById("scheduleTable");

  function addScheduleRow(time, title) {
    const row = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.textContent = time;

    const titleCell = document.createElement("td");
    titleCell.textContent = title;

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    editBtn.addEventListener("click", () => {
      const newTime = prompt("New time (HH:MM):", timeCell.textContent) || timeCell.textContent;
      const newTitle = prompt("New title:", titleCell.textContent) || titleCell.textContent;
      timeCell.textContent = newTime;
      titleCell.textContent = newTitle;
      saveAll();
    });

    deleteBtn.addEventListener("click", () => {
      scheduleTable.removeChild(row);
      saveAll();
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    row.appendChild(timeCell);
    row.appendChild(titleCell);
    row.appendChild(actionsCell);
    scheduleTable.appendChild(row);
  }

  addSlotBtn.addEventListener("click", () => {
    const time = slotTime.value;
    const title = slotTitle.value.trim();
    if (!time || !title) return;
    addScheduleRow(time, title);
    slotTime.value = "";
    slotTitle.value = "";
    saveAll();
  });

  clearScheduleBtn.addEventListener("click", () => {
    if (confirm("Clear entire schedule?")) {
      scheduleTable.innerHTML = "";
      saveAll();
    }
  });

  // ----- Local Storage -----
  function saveAll() {
    const todos = [];
    taskTable.querySelectorAll("tr").forEach(tr => {
      const checked = tr.querySelector('input[type="checkbox"]').checked;
      const task = tr.children[1].textContent;
      const due = tr.children[2].textContent;
      todos.push({ task, due, checked });
    });

    const schedule = [];
    scheduleTable.querySelectorAll("tr").forEach(tr => {
      const time = tr.children[0].textContent;
      const title = tr.children[1].textContent;
      schedule.push({ time, title });
    });

    localStorage.setItem("umar_todos", JSON.stringify(todos));
    localStorage.setItem("umar_schedule", JSON.stringify(schedule));
  }

  function loadAll() {
    const todos = JSON.parse(localStorage.getItem("umar_todos") || "[]");
    const schedule = JSON.parse(localStorage.getItem("umar_schedule") || "[]");

    todos.forEach(t => addTaskRow(t.task, t.due, t.checked));
    schedule.forEach(s => addScheduleRow(s.time, s.title));
  }

  loadAll();
});
