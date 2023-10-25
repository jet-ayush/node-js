const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 5001;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

let teachers = [];
const dataFilePath = path.join(__dirname, "data.json");
try {
  teachers = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
} catch (err) {
  console.error("Error reading data file:", err);
}

app.get("/api/teachers", (req, res) => {
  res.json(teachers);
});

app.post("/api/addteachers", (req, res) => {
  const { time, course, name } = req.body;

  const newTeacher = {
    id: teachers.length + 1,
    time,
    course,
    name,
  };

  // Add the new teacher to the teachers array
  teachers.push(newTeacher);
  console.log(newTeacher);
  console.log(teachers);
  // Update the data.json file with the new data
  fs.writeFileSync(dataFilePath, JSON.stringify(teachers, null, 2), "utf-8");

  res.status(201).json(teachers); // Respond with the newly created teacher
});

app.put("/api/teachers/:id", (req, res) => {
  const teacherId = parseInt(req.params.id);

  // Find the teacher to update by ID
  const updatedTeachers = teachers.map((teacher) => {
    if (teacher.id === teacherId) {
      return { ...teacher, ...req.body };
    } else {
      return teacher;
    }
  });

  if (JSON.stringify(updatedTeachers) === JSON.stringify(teachers)) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  teachers = updatedTeachers;

  // Update the data.json file with the new data
  fs.writeFileSync(dataFilePath, JSON.stringify(teachers, null, 2), "utf-8");

  res.status(200).json(teachers); // Respond with the updated teachers
});

app.delete("/api/teachers/:id", (req, res) => {
  const teacherId = parseInt(req.params.id);

  const updatedTeachers = teachers.filter(
    (teacher) => teacher.id !== teacherId
  );

  if (updatedTeachers.length === teachers.length) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  teachers = updatedTeachers;

  // Update the data.json file with the new data
  fs.writeFileSync(dataFilePath, JSON.stringify(teachers, null, 2), "utf-8");

  // Send the updated teachers table to the client
  res.json(updatedTeachers);
});

app.put("/api/teachers/:id", (req, res) => {
  const teacherId = parseInt(req.params.id);

  // Find the teacher to update by ID
  const teacherIndex = teachers.findIndex(
    (teacher) => teacher.id === teacherId
  );

  if (teacherIndex === -1) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const updatedTeacher = { ...teachers[teacherIndex], ...req.body };
  teachers[teacherIndex] = updatedTeacher;

  // Update the data.json file with the new data
  fs.writeFileSync(dataFilePath, JSON.stringify(teachers, null, 2), "utf-8");

  res.status(200).json(teachers); // Respond with the updated teachers
});
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
