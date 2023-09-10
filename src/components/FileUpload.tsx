"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { InboxIcon } from "lucide-react";
import { UploadToS3 } from "@/lib/s3";

interface Props {}

const FileUpload = (props: Props) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      try {
        const data = await UploadToS3(file);
        console.log(data, "data from client side");
      } catch (error) {
        console.log(error, "error in client side");
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed cursor-pointer border-2 rounded-xl bg-gray-60 py-8 flex justify-center items-center",
        })}
      >
        <input {...getInputProps()} type="file" />
        <div className="flex items-center justify-center flex-wrap">
          <InboxIcon className="w-10 h-10 text-blue-500" />
          <p className="ml-2 text-sm text-slate-400">
            Drag &apos;n&apos; drop PDF here, or click to select PDF to upload.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
