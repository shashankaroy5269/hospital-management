"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/store/provider";
import { fetchDoctors, deleteDoctor } from "../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios";
import Link from "next/link";
import Swal from "sweetalert2";
import "./DoctorList.css";

const DoctorList = () => {
  const dispatch = useAppDispatch();
  const { doctors = [], loading } = useAppSelector((state) => state.doctor);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchDoctors({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  // 🔥 DELETE (SweetAlert)
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDoctor(id));

        Swal.fire("Deleted!", "Doctor removed successfully.", "success");
      }
    });
  };

  const openViewModal = async (id: string) => {
    const res = await AxiosInstance.get(`/admin/doctor/details/${id}`);
    setSelectedDoc(res.data.data);
    setViewModal(true);
  };

  const openEditModal = async (id: string) => {
    const res = await AxiosInstance.get(`/admin/doctor/details/${id}`);
    setSelectedDoc(res.data.data);
    setEditModal(true);
  };

  // 🔥 UPDATE (SweetAlert)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/admin/doctor/update", {
        id: selectedDoc._id,
        name: selectedDoc.name,
        fees: selectedDoc.fees,
      });

      Swal.fire("Updated!", "Doctor updated successfully", "success");

      setEditModal(false);
      dispatch(fetchDoctors({ page, limit, search }));
    } catch {
      Swal.fire("Error!", "Update failed", "error");
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2> Doctor Management</h2>
        <Link href="/doctors/create" className="add-btn">
          + Add Doctor
        </Link>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search doctor..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="doctor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Fees</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>Loading...</td>
            </tr>
          ) : (
            doctors.map((doc: any) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>₹{doc.fees}</td>
                <td>{doc.department?.name || "N/A"}</td>
                <td className="actions">
                  <button onClick={() => openViewModal(doc._id)} className="view-btn">
                    View
                  </button>
                  <button onClick={() => openEditModal(doc._id)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(doc._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* VIEW MODAL */}

      {viewModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setViewModal(false)}>
          <div className="modal-content view-card" onClick={(e) => e.stopPropagation()}>
            <div className="view-card-header">
              <div className="profile-avatar">
                {selectedDoc.name.charAt(0).toUpperCase()}
              </div>
              <div className="header-info">
                <h3>{selectedDoc.name}</h3>
                <span className="status-badge">Active Doctor</span>
              </div>
            </div>

            <div className="view-card-body">
              <div className="info-grid">
                <div className="info-item">
                  <label>Consultation Fees</label>
                  <p className="fee-amount">₹{selectedDoc.fees}</p>
                </div>
                <div className="info-item">
                  <label>Department</label>
                  <p>{selectedDoc.department?.name || "General"}</p>
                </div>
              </div>

              <div className="slots-container">
                <h4> Available Schedule</h4>
                <div className="slots-grid">
                  {selectedDoc?.availableSlots?.length > 0 ? (
                    selectedDoc.availableSlots.map((s: any, i: number) => (
                      <div key={i} className="slot-badge">
                        <span className="slot-date">{s.date}</span>
                        <span className="slot-time">{s.time}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#64748b" }}>No slots available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="view-card-footer">
              <button className="close-btn" onClick={() => setViewModal(false)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && selectedDoc && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Edit Doctor</h3>

            <form onSubmit={handleUpdateSubmit} className="modal-form">

              <div className="form-group">
                <label>Name</label>
                <input
                  value={selectedDoc.name}
                  onChange={(e) =>
                    setSelectedDoc({ ...selectedDoc, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Fees</label>
                <input
                  value={selectedDoc.fees}
                  onChange={(e) =>
                    setSelectedDoc({ ...selectedDoc, fees: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button disabled={doctors.length < limit} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorList;