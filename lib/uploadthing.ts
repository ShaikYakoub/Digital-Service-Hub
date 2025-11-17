"use client";
 
import {
  UploadButton,
  UploadDropzone,
} from "@uploadthing/react";
 
import { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const OurUploadButton = UploadButton<OurFileRouter>;
export const OurUploadDropzone = UploadDropzone<OurFileRouter>;