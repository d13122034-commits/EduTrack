
let students = JSON.parse(localStorage.getItem("students")) || [];
function addStudent() {
    let nameInput = document.getElementById("studentName");
    let name = nameInput.value.trim();

    if (name === "") {
        Swal.fire('wrong', 'Please enter a student name', 'error');
        return;
    }

   
    students.push(name);
    localStorage.setItem("students", JSON.stringify(students));
    nameInput.value = "";
    displayStudents();
    
    Swal.fire('Added!', 'Student has been added successfully', 'success');
}


function displayStudents() {
    let list = document.getElementById("studentList");
    if(!list) return; 
    list.innerHTML = ""; 

    students.forEach((student, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn";
        li.innerHTML = `
            <span>${student}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        list.appendChild(li);
    });
}


function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}


document.addEventListener("DOMContentLoaded", displayStudents);
/////////////////////////////////////////
let grades = JSON.parse(localStorage.getItem("grades")) || [];
function addGrade() {
    let studentName = document.getElementById("studentSelect").value;
    let examGrade = document.getElementById("exam").value;
    let homeworkGrade = document.getElementById("homework").value;
    let participation = document.getElementById("participationCount").value;
    let performanceNote = document.getElementById("performance").value;
    if (studentName === "Choose Student..." || examGrade === "" || homeworkGrade === ""|| participation === ""|| performanceNote === "Teacher Note...") {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill all fields and select a student',
            icon: 'error',
            confirmButtonColor: '#004d56'
        });
        return;
    }
    let total = parseFloat(examGrade) + parseFloat(homeworkGrade);
    let newGrade = {
        name: studentName,
        exam: examGrade,
        homework: homeworkGrade,
        total: total,
        participation: participation,
        performance: performanceNote
    };
    grades.push(newGrade);
    localStorage.setItem("grades", JSON.stringify(grades));
    displayGrades();
    document.getElementById("exam").value = "";
    document.getElementById("homework").value = "";
    document.getElementById("participationCount").value = "";
    document.getElementById("performance").selectedIndex = 0;
    Swal.fire({
        title: 'Saved!',
        text: 'Grades have been recorded successfully',
        icon: 'success',
        confirmButtonColor: '#004d56'
    });
}
function displayGrades() {
    let tableBody = document.getElementById("gradesTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    grades.forEach((item, index) => {
        let row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.exam}</td>
                <td>${item.homework}</td>
                <td class="fw-bold text-primary">${item.total}</td>
                <td>${item.participation}</td> 
                <td class="fw-bold text-dark">${item.performance}</td> <td>
                    <button class="btn btn-sm text-danger" onclick="deleteGrade(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
function deleteGrade(index) {
    grades.splice(index, 1);
    localStorage.setItem("grades", JSON.stringify(grades));
    displayGrades();
}
////////////////////////////
document.addEventListener("DOMContentLoaded", function() {

    if (document.getElementById("studentList")) {
        displayStudents();
    }
    
  
    if (document.getElementById("studentSelect")) {
        fillStudentDropdown("studentSelect");
        displayGrades();
    }
    
    if (document.getElementById("attendanceSelect")) {
        fillStudentDropdown("attendanceSelect");
        displayAttendance();
    }
});


function fillStudentDropdown(selectId) {
    let selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    selectElement.innerHTML = '<option selected disabled>Select Student</option>';

    students.forEach(student => {
        let option = document.createElement("option");
        option.value = student;
        option.textContent = student;
        selectElement.appendChild(option);
    });
}
//////////////////////////////

let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function markAttendance() {
    let studentName = document.getElementById("attendanceSelect").value;
    let date = new Date().toLocaleDateString(); 

    if (studentName === "Choose Student...") {
        Swal.fire('Error!', 'Please select a student', 'error');
        return;
    }

  
    attendance.push({ name: studentName, date: date });
    localStorage.setItem("attendance", JSON.stringify(attendance));

    displayAttendance();

    Swal.fire({
        title: 'Marked!',
        text: studentName + ' is present today',
        icon: 'success',
        confirmButtonColor: '#004d56'
    });
}

function displayAttendance() {
    let list = document.getElementById("attendanceList");
    if (!list) return;

    list.innerHTML = "";

    attendance.forEach((record, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
                <span class="fw-bold">${record.name}</span>
                <small class="text-muted ms-3">${record.date}</small>
            </div>
            <button class="btn btn-sm text-danger" onclick="deleteAttendance(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteAttendance(index) {
    attendance.splice(index, 1);
    localStorage.setItem("attendance", JSON.stringify(attendance));
    displayAttendance();
}