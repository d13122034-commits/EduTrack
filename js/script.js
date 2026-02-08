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
document.addEventListener("DOMContentLoaded", displayStudents);
/////////////////////////////////////////
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
    let examGrade = document.getElementById("exam").value;
    let homeworkGrade = document.getElementById("homework").value;
    let participation = document.getElementById("participationCount").value;
    let performanceNote = document.getElementById("performance").value;
    let manualNote = document.getElementById("manualNote").value;

    
    if (!studentName || studentName === "Select Student" || examGrade === "" || homeworkGrade === "" || participation === "" || !performanceNote) {
        Swal.fire({
            title: 'Missing Data!',
            text: 'Please make sure to select a group, then a student, and fill all grades.',
            icon: 'warning',
            confirmButtonColor: '#004d56'
        });
        return;
    }

    let total = Number(examGrade) + Number(homeworkGrade);
    
    let gradeData = {
        name: studentName,
        exam: examGrade,
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
        text: 'Grade recorded successfully.',
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
                <td class="fw-bold">${grade.name}</td>
                <td>${grade.exam}</td>
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
    document.getElementById("exam").value = "";
    document.getElementById("homework").value = "";
    document.getElementById("participationCount").value = "";
    document.getElementById("performance").selectedIndex = 0;
}


document.addEventListener("DOMContentLoaded", function() {
    fillGroupDropdown(); 
    displayGrades();
});
//////////////////////////////



function fillAttendanceGroups() {
    const groupSelect = document.getElementById("groupFilterAttendance");
    if (!groupSelect) return; 

    const students = JSON.parse(localStorage.getItem("students")) || [];

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
    const allStudents = JSON.parse(localStorage.getItem("students")) || [];
    
    const filtered = allStudents.filter(s => s.group.trim() === selectedGroup);

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
        return alert("Please select a student!");
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
    alert("Saved: " + status);
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
                    <i class="bi bi-trash"></i> حذف
                </button>
            </td>
        </tr>
    `).reverse().join(''); 
}


document.addEventListener("DOMContentLoaded", () => {
    fillAttendanceGroups();
    displayAttendanceTable(); 
});

window.deleteAttendance = function(index) {
   
    let records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

   
    if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
        
       
        records.splice(index, 1);

    
        localStorage.setItem("attendanceRecords", JSON.stringify(records));

       
        displayAttendanceTable();
    }
};