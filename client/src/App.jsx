import React, { useState, useEffect } from 'react';
import './App.css';

// URL Backend cố định tới Render
const API_URL = "https://mern-backend-1-0-obbm.onrender.com";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    mssv: '',
    hoTen: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);

  // 1. Tải danh sách sinh viên
  const loadStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // 2. Xử lý thay đổi ô nhập liệu
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 3. Xử lý Thêm / Sửa sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      studentId: form.mssv,
      name: form.hoTen,
      email: form.email
    };

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setForm({ mssv: '', hoTen: '', email: '' });
        setEditingId(null);
        loadStudents();
        alert("Thao tác thành công!");
      } else {
        const result = await response.json().catch(() => ({}));
        alert(result.error || "Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server Backend!");
    }
  };

  // 4. Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      mssv: student.studentId || '',
      hoTen: student.name || '',
      email: student.email || ''
    });
  };

  // 5. Xóa sinh viên
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?")) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadStudents();
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Quản lý sinh viên</h1>

      <h3>{editingId ? 'Cập nhật thông tin sinh viên' : 'Nhập thông tin sinh viên'}</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="mssv"
          placeholder="MSSV"
          value={form.mssv}
          onChange={handleChange}
          required
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <input
          type="text"
          name="hoTen"
          placeholder="Họ tên"
          value={form.hoTen}
          onChange={handleChange}
          required
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ marginRight: '8px', padding: '6px' }}
        />
        <button type="submit" style={{ padding: '6px 12px' }}>
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setForm({ mssv: '', hoTen: '', email: '' }); }}
            style={{ marginLeft: '8px', padding: '6px 12px' }}
          >
            Hủy
          </button>
        )}
      </form>

      <h3>Danh sách sinh viên</h3>
      <table border="1" cellPadding="8" style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: '500px' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEdit(student)} style={{ marginRight: '6px' }}>Sửa</button>
                <button onClick={() => handleDelete(student._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;