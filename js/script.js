let students = JSON.parse(localStorage.getItem("students")) || [];

function addStudent() {
    let nameInput = document.getElementById("studentName");
    let groupInput = document.getElementById("groupName");
    
    let name = nameInput.value.trim();
    let group = groupInput.value.trim();

    if (name === "" || group === "") {
        Swal.fire('Oops!', 'Please enter both name and group', 'warning');
        return;
    }

    let studentData = { name: name, group: group };
    students.push(studentData);
    localStorage.setItem("students", JSON.stringify(students));
    nameInput.value = "";
    groupInput.value = "";
    
    displayStudents();
    Swal.fire('Success', 'Student added!', 'success');
}

function displayStudents() {
    let list = document.getElementById("studentList");
    if (!list) return;
    list.innerHTML = "";
    students.forEach((student, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn";
        li.innerHTML = `
            <div class="text-start">
                <span class="fw-bold">${student.name}</span>
                <br>
                <small class="text-muted"><i class="bi bi-collection"></i> Group: ${student.group}</small>
            </div>
            <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteStudent(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteStudent(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will delete this student and their record!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#004d56',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            students.splice(index, 1);
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            Swal.fire('Deleted!', 'Student has been removed.', 'success');
        }
    });
}

///////////////// Grades (المعدل) /////////////////

let grades = JSON.parse(localStorage.getItem("grades")) || [];

function fillGroupDropdown() {
    let groupSelect = document.getElementById("groupFilter");
    if (!groupSelect) return;
    let groups = [...new Set(students.map(s => s.group))];
    groupSelect.innerHTML = '<option selected disabled>Choose Group</option>';
    groups.forEach(group => {
        let option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });
}

function updateStudentsByGroup() {
    let selectedGroup = document.getElementById("groupFilter").value;
    let studentSelect = document.getElementById("studentSelect");
    if (!studentSelect) return;

    let filtered = students.filter(s => s.group === selectedGroup);
    
    studentSelect.innerHTML = '<option selected disabled>Select Student</option>';
    filtered.forEach(s => {
        let option = document.createElement("option");
        option.value = s.name;
        option.textContent = s.name;
        studentSelect.appendChild(option);
    });
}

function addGrade() {
    let selectedGroup = document.getElementById("groupFilter").value;
    let studentName = document.getElementById("studentSelect").value;
    
    let examName = document.getElementById("exam").value; 
    let examScore = document.getElementById("examGradeValue")?.value || 0; 
    
    let homeworkGrade = document.getElementById("homework").value;
    let participation = document.getElementById("participationCount").value;
    let performanceNote = document.getElementById("performance").value;
    let manualNote = document.getElementById("manualNote").value;

    if (!studentName || studentName === "Select Student" || examName === "" || homeworkGrade === "" || participation === "" || !performanceNote) {
        Swal.fire({
            title: 'Missing Data!',
            text: 'Please fill all fields.',
            icon: 'warning',
            confirmButtonColor: '#004d56'
        });
        return;
    }

    let total = Number(examScore) + Number(homeworkGrade);

    let gradeData = {
        name: studentName,
        exam: examName,
        examScore: examScore,
        homework: homeworkGrade,
        total: total,
        participation: participation,
        performance: performanceNote,
        group: selectedGroup,
        extraNote: manualNote
    };

    grades.push(gradeData);
    localStorage.setItem("grades", JSON.stringify(grades));
    
    displayGrades();
    resetForm();     
    
    Swal.fire({
        title: 'Saved!',
        text: `Grade recorded for ${studentName}`,
        icon: 'success',
        confirmButtonColor: '#004d56'
    });
}

function displayGrades() {
    let tableBody = document.getElementById("gradesTable");
    let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    if (!tableBody) return;

    tableBody.innerHTML = "";
    grades.forEach((grade, index) => {
        let absenceCount = attendanceRecords.filter(r => r.name === grade.name && r.status === 'Absent').length;
        tableBody.innerHTML += `
            <tr>
                <td class="fw-bold">
                    <a href="profile.html?name=${encodeURIComponent(grade.name)}" class="text-info text-decoration-none">
                        <i class="bi bi-person-circle me-1"></i> ${grade.name}
                    </a>
                </td>
                <td class="text-muted">${grade.exam || 'N/A'}</td> 
                <td>${grade.examScore || 0}</td>
                <td>${grade.homework}</td>
                <td class="fw-bold text-primary">${grade.total}</td>
                <td>${grade.participation}</td>
                <td><span class="badge bg-light text-dark shadow-sm">${grade.performance}</span></td>
                <td><span class="badge bg-secondary">${grade.group}</span></td>
                <td class="text-muted small">${grade.extraNote || '-'}</td>
                <td class="text-danger fw-bold">${absenceCount}</td>
                <td>
                    <button class="btn btn-sm text-danger" onclick="deleteGrade(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
    });
}

function deleteGrade(index) {
    grades.splice(index, 1);
    localStorage.setItem("grades", JSON.stringify(grades));
    displayGrades();
}

function resetForm() {
    if(document.getElementById("exam")) document.getElementById("exam").value = "";
    if(document.getElementById("examGradeValue")) document.getElementById("examGradeValue").value = "";
    if(document.getElementById("homework")) document.getElementById("homework").value = "";
    if(document.getElementById("participationCount")) document.getElementById("participationCount").value = "";
    if(document.getElementById("performance")) document.getElementById("performance").selectedIndex = 0;
    if(document.getElementById("manualNote")) document.getElementById("manualNote").value = "";
}

///////////////// Attendance /////////////////

function fillAttendanceGroups() {
    const groupSelect = document.getElementById("groupFilterAttendance");
    if (!groupSelect) return; 
    const groups = [...new Set(students.map(s => s.group.trim()))];
    groupSelect.innerHTML = '<option selected disabled>Choose Group...</option>';
    groups.forEach(g => {
        let option = document.createElement("option");
        option.value = g;
        option.textContent = g;
        groupSelect.appendChild(option);
    });
}

window.updateStudentsForAttendance = function() {
    const groupSelect = document.getElementById("groupFilterAttendance");
    const studentSelect = document.getElementById("attendanceStudentSelect");
    if (!groupSelect || !studentSelect) return;
    const selectedGroup = groupSelect.value.trim();
    const filtered = students.filter(s => s.group.trim() === selectedGroup);
    studentSelect.innerHTML = '<option selected disabled>Choose Student...</option>';
    filtered.forEach(s => {
        let option = document.createElement("option");
        option.value = s.name;
        option.textContent = s.name;
        studentSelect.appendChild(option);
    });
}

window.markAttendance = function(status) {
    const studentSelect = document.getElementById("attendanceStudentSelect");
    if (!studentSelect || studentSelect.value.includes("Choose")) {
        return Swal.fire('Error', 'Please select a student!', 'error');
    }
    const records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    records.push({
        name: studentSelect.value,
        status: status,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem("attendanceRecords", JSON.stringify(records));
    displayAttendanceTable(); 
    Swal.fire('Saved', `Student marked as ${status}`, 'success');
};

function displayAttendanceTable() {
    const tableBody = document.getElementById("attendanceTableBody");
    if (!tableBody) return;
    const records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    tableBody.innerHTML = records.map((r, index) => `
        <tr>
            <td>${r.name}</td>
            <td><span class="badge ${r.status === 'Present' ? 'bg-success' : 'bg-danger'}">${r.status}</span></td>
            <td>${r.date}</td>
            <td>${r.time}</td>
            <td class="text-end">
                <button class="btn btn-sm text-danger" onclick="deleteAttendance(${index})">
                    <i class="bi bi-trash"></i> الحذف
                </button>
            </td>
        </tr>
    `).reverse().join(''); 
}

window.deleteAttendance = function(index) {
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
        records.splice(index, 1);
        localStorage.setItem("attendanceRecords", JSON.stringify(records));
        displayAttendanceTable();
    }
};

///////////////// Profile /////////////////

function loadStudentProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentName = urlParams.get('name');
    if (!studentName) return;

    const grades = JSON.parse(localStorage.getItem("grades")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

    const studentData = students.find(s => s.name === studentName);
    const studentGrades = grades.filter(g => g.name === studentName);
    const studentAbsence = attendance.filter(r => r.name === studentName && r.status === 'Absent').length;

    if(document.getElementById("profileHeader")) {
        document.getElementById("profileHeader").innerHTML = `
            <h1 class="fw-bold" style="color: #004d56;">${studentName}</h1>
            <span class="badge bg-secondary">${studentData?.group || 'No Group'}</span>
        `;
    }
    if(document.getElementById("totalAbsence")) document.getElementById("totalAbsence").innerText = studentAbsence;

    const chartEl = document.getElementById('performanceChart');
    if (chartEl) {
        const ctx = chartEl.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: studentGrades.map(g => g.exam || "Exam"),
                datasets: [{
                    label: 'Performance Trend',
                    data: studentGrades.map(g => g.total),
                    borderColor: '#004d56',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(0, 77, 86, 0.1)'
                }]
            }
        });
    }

    const tableBody = document.getElementById("studentGradesTable");
    if(tableBody) {
        tableBody.innerHTML = studentGrades.map(g => `
            <tr>
                <td>${g.exam}</td>
                <td>${g.total}</td>
                <td>${g.performance || 'No notes available'}</td>
            </tr>
        `).join('');
    }
}

///////////////// وظيفة التشغيل التلقائي /////////////////
document.addEventListener("DOMContentLoaded", function() {
    // تشغيل دوال صفحة إدارة الطلاب
    displayStudents();

    // تشغيل دوال صفحة الدرجات
    if (document.getElementById("groupFilter")) {
        fillGroupDropdown(); 
        displayGrades();
    }

    // تشغيل دوال صفحة الحضور
    if (document.getElementById("groupFilterAttendance")) {
        fillAttendanceGroups();
        displayAttendanceTable();
    }

    // تشغيل دوال صفحة البروفايل
    if (window.location.pathname.includes("profile.html")) {
        loadStudentProfile();
    }
});