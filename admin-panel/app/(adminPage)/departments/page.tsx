"use client";

import { useEffect, useState } from "react";
import styles from "./department.module.css";
import { AxiosInstance } from "@/api/axios/axios";

// ✅ ADD THESE
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [departments, setDepartments] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const perPage = 6;

  const loadData = async () => {
    try {
      const res = await AxiosInstance.get("/admin/departments/list");
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = departments.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleAdd = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleEdit = (d: any) => {
    setEditId(d._id);
    setForm({
      name: d.name,
      description: d.description,
    });
    setModalOpen(true);
  };

  // ✅ SAVE WITH TOASTIFY
  const handleSave = async () => {
    try {
      if (editId) {
        await AxiosInstance.post("/admin/department/delete", {
          id: editId,
        });
        toast.success("✅ Department Updated");
      }

      await AxiosInstance.post("/admin/doctor/department", form);

      toast.success("🎉 Department Saved");

      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error("❌ Error!");
      console.log(err);
    }
  };

  // ✅ DELETE WITH SWEET ALERT
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes Delete",
    });

    if (result.isConfirmed) {
      try {
        await AxiosInstance.post("/admin/department/delete", { id });

        Swal.fire("Deleted!", "Department removed", "success");

        loadData();
      } catch (err) {
        Swal.fire("Error!", "Something went wrong", "error");
      }
    }
  };

  return (
    <div className={styles.container}>
      
      {/* ✅ TOAST */}
      <ToastContainer position="top-right" autoClose={2000} />

      <h1 className={styles.title}>Department</h1>

      <div className={styles.topBar}>
        <input
          className={styles.search}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className={`${styles.button} ${styles.primary}`}
        >
          + Add
        </button>
      </div>

      <div className={styles.grid}>
        {paginated.length === 0 ? (
          <p className={styles.noResult}>No Result Found ❌</p>
        ) : (
          paginated.map((d: any) => (
            <div key={d._id} className={styles.card}>
              <span className={styles.activeBadge}>Active</span>

              <h3>{d.name}</h3>
              <p>{d.description}</p>
              <small>{d._id}</small>

              <div className={styles.actions}>
                
                {/* ✅ BUTTON FIX (SAME STYLE) */}
                <button
                  onClick={() => handleEdit(d)}
                  className={styles.button}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(d._id)}
                  className={styles.button} >
                  Delete
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={styles.pageBtn}
        >
          Prev
        </button>

        <span>
          {page} / {totalPages || 1}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={styles.pageBtn}
        >
          Next
        </button>
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {editId ? "Edit Department" : "Add Department"}
            </h2>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

            <div className={styles.modalActions}>
              <button onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>

              <button onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}