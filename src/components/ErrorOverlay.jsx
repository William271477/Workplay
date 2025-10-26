import React, { useEffect, useState } from "react";

export default function ErrorOverlay() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    function onErr(message, source, lineno, colno, error) {
      setErrors((e) => [
        ...e,
        {
          type: "error",
          message: message?.toString(),
          source,
          lineno,
          colno,
          stack: error?.stack,
        },
      ]);
      return false;
    }
    function onRejection(ev) {
      setErrors((e) => [
        ...e,
        {
          type: "rejection",
          reason: ev?.reason?.toString?.() || String(ev?.reason),
        },
      ]);
    }
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (errors.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 9999,
      }}
    >
      {errors.map((err, i) => (
        <div
          key={i}
          className="mb-2 p-3 bg-red-900/90 text-white rounded-lg shadow-lg text-sm"
        >
          <div className="font-semibold">
            {err.type === "error" ? "Runtime Error" : "Unhandled Rejection"}
          </div>
          <div className="mt-1 break-words">{err.message || err.reason}</div>
          {err.stack && (
            <pre className="mt-2 text-xs max-h-40 overflow-auto">
              {err.stack}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
