// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import styles from "./editModal.module.css";

// export default function EditModal({
//   isOpen,
//   onClose,
//   onSave,
//   form,
//   setForm,
//   departments,
// }: any) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className={styles.overlay}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <motion.div
//             className={styles.modal}
//             initial={{ scale: 0.7, opacity: 0, y: 50 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.7, opacity: 0, y: 50 }}
//             transition={{ duration: 0.3 }}
//           >
//             {/* TITLE */}
//             <h2 className={styles.title}>Edit Doctor</h2>

//             {/* NAME */}
//             <input
//               className={styles.input}
//               value={form.name}
//               onChange={(e) =>
//                 setForm({ ...form, name: e.target.value })
//               }
//               placeholder="Doctor Name"
//             />

//             {/* FEES */}
//             <input
//               className={styles.input}
//               value={form.fees}
//               onChange={(e) =>
//                 setForm({ ...form, fees: e.target.value })
//               }
//               placeholder="Fees"
//               type="number"
//             />

//             {/* DEPARTMENT */}
//             <select
//               className={styles.input}
//               value={form.departmentId}
//               onChange={(e) =>
//                 setForm({ ...form, departmentId: e.target.value })
//               }
//             >
//               <option value="">Select Department</option>
//               {departments?.map((d: any) => (
//                 <option key={d._id} value={d._id}>
//                   {d.name}
//                 </option>
//               ))}
//             </select>

//             {/* SCHEDULE */}
//             <input
//               className={styles.input}
//               value={form.schedule?.startTime}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   schedule: {
//                     ...form.schedule,
//                     startTime: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Start Time (09:00)"
//             />

//             <input
//               className={styles.input}
//               value={form.schedule?.endTime}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   schedule: {
//                     ...form.schedule,
//                     endTime: e.target.value,
//                   },
//                 })
//               }
//               placeholder="End Time (17:00)"
//             />

//             <input
//               className={styles.input}
//               value={form.schedule?.slotDuration}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   schedule: {
//                     ...form.schedule,
//                     slotDuration: e.target.value,
//                   },
//                 })
//               }
//               placeholder="Slot Duration (30)"
//               type="number"
//             />

//             {/* BUTTONS */}
//             <div className={styles.actions}>
//               <button
//                 onClick={onSave}
//                 className={`${styles.button} ${styles.save}`}
//               >
//                 Update Doctor
//               </button>

//               <button
//                 onClick={onClose}
//                 className={`${styles.button} ${styles.cancel}`}
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }