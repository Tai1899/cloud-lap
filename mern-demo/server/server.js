const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const normalizeStudentPayload = (body = {}) => ({
  studentId: body.studentId ?? body.mssv ?? '',
  name: body.name ?? body.hoTen ?? '',
  email: body.email ?? ''
});

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});
const Student = mongoose.model('Student', studentSchema);


// Câu 36: Xây dựng API GET

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Câu 37: Xây dựng API POST 

app.post('/api/students', async (req, res) => {
  try {
    const payload = normalizeStudentPayload(req.body);
    const newStudent = await Student.create(payload);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Câu 38: Xây dựng API PUT 

app.put('/api/students/:id', async (req, res) => {
  try {
    const payload = normalizeStudentPayload(req.body);
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Câu 39: Xây dựng API DELETE 

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa sinh viên thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Kết nối DB và chạy Server 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err.message));