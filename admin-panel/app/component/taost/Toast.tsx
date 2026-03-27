// "use client";
// import { useEffect } from "react";

// export default function Toast({ message, setShow }: any) {
//   useEffect(() => {
//     const timer = setTimeout(() => setShow(false), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div style={{
//       position: "fixed",
//       top: 20,
//       right: 20,
//       background: "#22c55e",
//       padding: "10px 20px",
//       borderRadius: "8px",
//       color: "#fff",
//       zIndex: 999
//     }}>
//       {message}
//     </div>
//   );
// }