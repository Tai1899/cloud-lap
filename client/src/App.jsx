import { useEffect, useState } from "react";

function App() {
  const API_URL = "https://mern-backend-1-0-obbm.onrender.com";
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    mssv: "",
    hoTen: "",
    email: ""
  });

  const normalizeStudent = (student) => ({
    ...student,
    mssv: student.mssv ?? student.studentId ?? "",
    hoTen: student.hoTen ?? student.name ?? ""
  });

  const loadStudents = () => {
    fetch("/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(Array.isArray(data) ? data.map(normalizeStudent) : []))
      .catch((error) => console.error("Lỗi:", error));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: form.mssv,
      name: form.hoTen,
      email: form.email
    };

    try {
     const response = await fetch("https://mern-backend-1-0-obbm.onrender.com/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Thêm sinh viên thất bại");
      }

      alert("Thêm sinh viên thành công!");

      setForm({
        mssv: "",
        hoTen: "",
        email: ""
      });

      loadStudents();
    } catch (error) {
      console.error(error);
      alert(error.message || "Có lỗi khi thêm sinh viên");
    }
  };

  return (
    <div>
      <h1>Quản lý sinh viên</h1>

      <h2>Nhập thông tin sinh viên</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="mssv"
          placeholder="MSSV"
          value={form.mssv}
          onChange={handleChange}
        />

        <input
          type="text"
          name="hoTen"
          placeholder="Họ tên"
          value={form.hoTen}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <button type="submit">
          Thêm sinh viên
        </button>
      </form>

      <h2>Danh sách sinh viên</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.mssv}</td>
              <td>{student.hoTen}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;