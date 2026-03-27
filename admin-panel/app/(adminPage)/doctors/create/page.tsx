 "use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/store/provider";
import { createDoctor } from "../../../Redux/slice/doctorSlice";
import { AxiosInstance } from "@/api/axios/axios";
import dynamic from "next/dynamic";

// 🔥 FIX: SSR issue solve
const TimePicker = dynamic(() => import("react-time-picker"), {
  ssr: false,
});

// CSS import order IMPORTANT
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "./CreateDoctor.css";

const CreateDoctor = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.doctor);

  const [departments, setDepartments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    fees: "",
    departmentId: "",
    startTime: "",
    endTime: "",
    slotDuration: "",
  });

  // 🔥 hydration safe mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 Load departments
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await AxiosInstance.get("/admin/departments/list");
        setDepartments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepts();
  }, []);

  // 🔥 Handle input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🚀 Submit
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      fees: formData.fees,
      departmentId: formData.departmentId,
      schedule: {
        startTime: formData.startTime,
        endTime: formData.endTime,
        slotDuration: Number(formData.slotDuration),
      },
    };

    console.log("FINAL PAYLOAD:", payload);

    dispatch(createDoctor(payload as any))
      .unwrap()
      .then(() => {
        alert("✅ Doctor Created Successfully");
        setFormData({
          name: "",
          fees: "",
          departmentId: "",
          startTime: "",
          endTime: "",
          slotDuration: "",
        });
      })
      .catch((err) => console.error(err));
  };

  // 🔥 prevent hydration crash
  if (!mounted) return null;

  return (
    <div className="form-container">
      <h2> Add Doctor</h2>

      <form onSubmit={handleSubmit} className="doctor-form">

        <div className="form-group">
          <label>Doctor Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. Name"
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Fees</label>
            <input
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              placeholder="₹"
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="form-row">

          <div className="form-group">
            <label>Start Time</label>
            <TimePicker
              value={formData.startTime}
              onChange={(value) =>
                setFormData({ ...formData, startTime: value as string })
              }
              disableClock={true}
              clearIcon={null}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <TimePicker
              value={formData.endTime}
 onChange={(value) =>
                setFormData({ ...formData, endTime: value as string })
              }
              disableClock={true}
              clearIcon={null}
            />
          </div>

        </div>

        <div className="form-group">
          <label>Slot Duration (minutes)</label>
          <input
            name="slotDuration"
            value={formData.slotDuration}
            onChange={handleChange}
            placeholder="30"
            required
          />
        </div>

        {error && <div className="error-msg"> {error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="loader-wrapper">
              <span className="loader"></span>
              Saving...
            </span>
          ) : (
            "Create Doctor"
          )}
        </button>

      </form>
    </div>
  );
};

export default CreateDoctor;