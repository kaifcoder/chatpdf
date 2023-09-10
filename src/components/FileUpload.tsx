"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { InboxIcon, Loader2 } from "lucide-react";
import { UploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {}

const FileUpload = (props: Props) => {
  const [uploading, setIsLoading] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      try {
        setIsLoading(true);
        const data = await UploadToS3(file);

        if (!data?.file_key || !data?.file_name) {
          toast.error("Error uploading file");
          return;
        }
        mutate(data, {
          onSuccess: (data) => {
            toast.success("File uploaded successfully");
            console.log(data, "data from client side");
          },
          onError: (error) => {
            toast.error("Error Creating Chat");
            console.log(error, "error in client side");
          },
        });
        console.log(data, "data from client side");
      } catch (error) {
        console.log(error, "error in client side");
      } finally {
        setIsLoading(false);
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
        {isLoading || uploading ? (
          <div className="flex flex-wrap items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="m-2 text-sm text-slate-400">
              Spilling tea to the AI...
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center">
            <InboxIcon className="w-10 h-10 text-blue-500" />
            <p className="ml-2 text-sm text-slate-400">
              Drag &apos;n&apos; drop PDF here, or click to select PDF to
              upload.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
