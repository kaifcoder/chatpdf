"use client";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <Toaster />;
};

export default ToasterProvider;
