/* Creating a mentor */
let opt = [],
  i = 0,
  opt2 = [],
  j = 0,
  opt3 = [],
  k = 0,
  li = [],
  l = 0;

document.querySelector("#save-mentor-name").addEventListener("click", () => {
  if (
    document.querySelector("#mentor-name").value &&
    document.querySelector("#mentor-name").value != ""
  ) {
    let data = {
      isStudent: false,
      mentor: {
        name: document.querySelector("#mentor-name").value,
        students: [],
      },
    };
    createMentor(data);
    $("#create-mentor-modal").modal("hide");
  }
});

const createMentor = async (data) => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/mentors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

/* Creating a student */

document.querySelector("#save-student-name").addEventListener("click", () => {
  if (
    document.querySelector("#student-name").value &&
    document.querySelector("#student-name").value != ""
  ) {
    let data = {
      isStudent: true,
      student: {
        name: document.querySelector("#student-name").value,
        isMentorAssigned: false,
        mentorName: "",
      },
    };
    createStudent(data);
    $("#create-student-modal").modal("hide");
  }
});

const createStudent = async (data) => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

/* Assign student to a mentor */

document
  .querySelector("#assign-student-button")
  .addEventListener("click", () => {
    fetchStudents().then((students) => {
      for (; i < students.length; i++) {
        opt[i] = document.createElement("option");
        opt[i].value = students[i].student.name;
        opt[i].id = students[i].student.id;
        opt[i].innerText = students[i].student.name;
        document.querySelector("#assign-student-select").appendChild(opt[i]);
      }
    });
    document.querySelector("#save-assign-student").disabled = false;
    document
      .querySelector("#save-selected-student")
      .addEventListener("click", () => {
        const studentId = document.querySelector("#assign-student-select")[
          document.querySelector("#assign-student-select").selectedIndex
        ].id;

        if (
          document.querySelector("#assign-student-select")[
            document.querySelector("#assign-student-select").selectedIndex
          ].value == "none"
        ) {
          document.querySelector("#current-mentor-name").value =
            "Please select a student first.";
          document.querySelector("#save-assign-student").disabled = true;
        }

        fetchSingleStudent(studentId).then((currStudent) => {
          if (currStudent.student.isMentorAssigned != true) {
            document.querySelector(
              "#current-mentor-name"
            ).value = `Student ${currStudent.student.name} has not been assigned to any mentor yet.`;
          } else {
            document.querySelector(
              "#current-mentor-name"
            ).value = `Student ${currStudent.student.name} has been assigned to mentor ${currStudent.student.mentorName}.`;
          }

          fetchMentors().then((mentors) => {
            for (; j < mentors.length; j++) {
              opt2[j] = document.createElement("option");
              opt2[j].value = mentors[j].mentor.name;
              opt2[j].id = mentors[j].mentor.id;
              opt2[j].innerText = mentors[j].mentor.name;
              document
                .querySelector("#assign-mentor-select")
                .appendChild(opt2[j]);
            }
          });

          document.querySelector("#save-selected-mentor").disabled = false;

          document
            .querySelector("#save-assign-student")
            .addEventListener("click", () => {
              if (
                document.querySelector("#assign-mentor-select")[
                  document.querySelector("#assign-mentor-select").selectedIndex
                ].value == "none"
              ) {
                document.querySelector("#new-mentor-name").value =
                  "Please select a mentor first.";
                document.querySelector("#save-selected-mentor").disabled = true;
              }
              const mentorId = document.querySelector("#assign-mentor-select")[
                document.querySelector("#assign-mentor-select").selectedIndex
              ].id;
              fetchSingleMentor(mentorId).then((currMentor) => {
                document.querySelector(
                  "#new-mentor-name"
                ).value = `Do you want to assign the student to mentor ${currMentor.mentor.name}?`;

                console.log(currStudent);
                console.log(studentId);
                console.log(currMentor);
                console.log(mentorId);

                document
                  .querySelector("#save-selected-mentor")
                  .addEventListener("click", () => {
                    let studentData = {
                      isMentorAssigned: true,
                      mentorName: currMentor.mentor.name,
                    };
                    updateStudent(studentId, studentData);

                    let mentorData = {
                      student: currStudent.student.name,
                    };
                    updateMentor(mentorId, mentorData);
                  });
              });
            });
        });
      });
  });

const fetchStudents = async () => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/students");
  return response.json();
};

const fetchMentors = async () => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/mentors");
  return response.json();
};

const updateStudent = async (id, data) => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/students/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

const updateMentor = async (id, data) => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/mentors/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

const fetchSingleMentor = async (id) => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/mentors/" + id);
  return response.json();
};

const fetchSingleStudent = async (id) => {
  const response = await fetch("https://assign-mentor-kartik.herokuapp.com/students/" + id);
  return response.json();
};

document
  .querySelector("#show-mentor-info-button")
  .addEventListener("click", () => {
    fetchMentors().then((mentors) => {
      for (; k < mentors.length; k++) {
        opt3[k] = document.createElement("option");
        opt3[k].value = mentors[k].mentor.name;
        opt3[k].id = mentors[k].mentor.id;
        opt3[k].innerText = mentors[k].mentor.name;
        document.querySelector("#show-mentor-info-select").appendChild(opt3[k]);
      }
    });

    document
      .querySelector("#show-mentor-selected")
      .addEventListener("click", () => {
        const id = document.querySelector("#show-mentor-info-select")[
          document.querySelector("#show-mentor-info-select").selectedIndex
        ].id;
        var node = document.getElementById("list-students");

        console.log(id);
        fetchSingleMentor(id).then((currMentor) => {
          let l2 = 0;
          while (l2 != l) {
            node.removeChild(node.firstChild);
            l2++;
          }
          (l2 = 0), (l = 0);
          for (; l < currMentor.mentor.students.length; l++) {
            li[l] = document.createElement("li");
            li[l].classList.add("list-group-item");
            li[l].innerText = currMentor.mentor.students[l];
            document.querySelector("#list-students").appendChild(li[l]);
          }
        });
      });
  });
