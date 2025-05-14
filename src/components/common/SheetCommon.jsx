"use client";

import { useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/Component/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Component/ui/tabs";
import { Label } from "@/Component/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Component/ui/radio-group";
import { Input } from "@/Component/ui/input";
import { Button } from "@/Component/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Component/ui/select";
import { X, Copy, AlertCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function SheetCommon({ triggerButton }) {
  const [documentOwner, setDocumentOwner] = useState("Muhammad Rizwan");
  const [uploadType, setUploadType] = useState("file");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([
    {
      name: "R.png",
      size: "23 KB",
      status: "rejected",
      message:
        "This item was rejected as this file already exists within this account.",
      progress: 100,
    },
    {
      name: "OIP.jpeg",
      size: "22 KB",
      status: "rejected",
      message:
        "This item was rejected as this file already exists within this account.",
      progress: 100,
    },
    {
      name: "OIP (1).jpeg",
      size: "18 KB",
      status: "rejected",
      message:
        "This item was rejected as this file already exists within this account.",
      progress: 100,
    },
    {
      name: "free-invoice-templates-pdf-world-of-printables-for-invoice-template-free-printable.png",
      size: "67 KB",
      status: "rejected",
      message:
        "This item was rejected as this file already exists within this account.",
      progress: 100,
    },
    {
      name: "Commercial_Invoice-1-.png",
      size: "420 KB",
      status: "rejected",
      message:
        "This item was rejected as this file already exists within this account.",
      progress: 100,
    },
    {
      name: "catering-invoice-jpg.jpg",
      size: "126 KB",
      status: "rejected",
      message:
        "This item was rejected as this file already exists within this account.",
      progress: 100,
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Click handler that triggers the hidden file input
  const handleSelectFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file(s) once selected
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    // Process each file
    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      status: "uploading",
      progress: 0,
      message: "",
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload process for each file
    newFiles.forEach((fileData, index) => {
      simulateFileUpload(fileData, index);
    });
  };

  // Format file size to KB/MB
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return Math.round(bytes / 1024) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Simulate file upload with progress
  const simulateFileUpload = (fileData, index) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Randomly determine if file should be rejected or accepted
        const isRejected = Math.random() > 0.5;
        setFiles((prev) => {
          const updated = [...prev];
          const fileIndex = updated.findIndex((f) => f.name === fileData.name);
          if (fileIndex !== -1) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: isRejected ? "rejected" : "complete",
              progress: 100,
              message: isRejected
                ? "This item was rejected as this file already exists within this account."
                : "",
            };
          }
          return updated;
        });

        // Add to upload history after a delay
        setTimeout(() => {
          setUploadHistory((prev) => [
            {
              name: fileData.name,
              size: fileData.size,
              status: isRejected ? "rejected" : "complete",
              message: isRejected
                ? "This item was rejected as this file already exists within this account."
                : "",
              progress: 100,
            },
            ...prev,
          ]);

          // Remove from current files list
          setFiles((prev) => prev.filter((f) => f.name !== fileData.name));
        }, 1000);
      } else {
        setFiles((prev) => {
          const updated = [...prev];
          const fileIndex = updated.findIndex((f) => f.name === fileData.name);
          if (fileIndex !== -1) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              progress: Math.round(progress),
            };
          }
          return updated;
        });
      }
    }, 200);
  };

  // Conditionally set input props based on the radio selection
  const isOneDocPerFile = uploadType === "file";
  const accept = isOneDocPerFile
    ? "application/pdf,image/*,.zip" // e.g. PDF, Image, ZIP for "One doc per file"
    : "application/pdf"; // e.g. PDF only for "One doc per page"

  const multiple = isOneDocPerFile; // If "One doc per file," allow multi

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // Process each file
      const newFiles = droppedFiles.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
        status: "uploading",
        progress: 0,
        message: "",
        file,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload process for each file
      newFiles.forEach((fileData, index) => {
        simulateFileUpload(fileData, index);
      });
    }
  };

  // File status indicator component
  const FileStatusIndicator = ({ status, progress }) => {
    if (status === "uploading") {
      return (
        <div className="flex items-center">
          <div className="relative w-5 h-5 mr-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            </div>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="62.83"
                strokeDashoffset={62.83 - (progress / 100) * 62.83}
                transform="rotate(-90 12 12)"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs text-gray-500">{progress}%</span>
        </div>
      );
    } else if (status === "rejected") {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <div className="w-5 h-5 rounded-full bg-green-500"></div>;
    }
  };

  return (
    <Sheet>
      {/* 
        1) We pass `triggerButton` to <SheetTrigger asChild>. 
           This ensures NO default shadcn button is rendered.
      */}
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      {/* 2) The Sheet content on the right side */}
      <SheetContent className="w-full sm:max-w-md md:max-w-lg" side="right">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-xl font-bold text-orange-500">
            Add documents
          </SheetTitle>

          {/* 3) If you don't want the close 'X' button, remove <SheetClose> */}
          {/* <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-5 w-5 text-orange-500" />
            <span className="sr-only">Close</span>
          </SheetClose> */}
        </SheetHeader>
        <ScrollArea className="h-screen px-4">
          <div className="mt-4">
            <Tabs defaultValue="costs">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger
                  value="costs"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:shadow-none rounded-none"
                >
                  Costs
                </TabsTrigger>
                <TabsTrigger
                  value="sales"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:shadow-none rounded-none"
                >
                  Sales
                </TabsTrigger>
                <TabsTrigger
                  value="bank"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:shadow-none rounded-none"
                >
                  Bank
                </TabsTrigger>
                <TabsTrigger
                  value="supplier"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:shadow-none rounded-none"
                >
                  Supplier Statements
                </TabsTrigger>
              </TabsList>

              {/* COSTS TAB */}
              <TabsContent value="costs" className="mt-0">
                <p className="text-sm text-gray-600 mb-6">
                  Use this panel to add your bills, receipts and purchase
                  invoices
                </p>

                <div className="space-y-6">
                  {/* Upload from computer */}
                  <div>
                    <h3 className="font-medium mb-2">Upload from computer</h3>
                    <div className="mb-2">
                      <Label htmlFor="document-owner">Document owner</Label>
                      <Select
                        defaultValue={documentOwner}
                        onValueChange={setDocumentOwner}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Muhammad Rizwan">
                            Muhammad Rizwan
                          </SelectItem>
                          <SelectItem value="Other User">Other User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      {/* Radio Group */}
                      <RadioGroup
                        defaultValue={uploadType}
                        onValueChange={setUploadType}
                        className="mt-4"
                      >
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem
                            value="file"
                            id="file"
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor="file" className="font-medium">
                              One document per file
                            </Label>
                            <p className="text-sm text-gray-500">
                              PDF, JPG, PNG, ZIP
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 mt-2">
                          <RadioGroupItem
                            value="page"
                            id="page"
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor="page" className="font-medium">
                              One document per page
                            </Label>
                            <p className="text-sm text-gray-500">
                              PDF files only
                            </p>
                          </div>
                        </div>
                      </RadioGroup>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={accept}
                        multiple={multiple}
                        style={{ display: "none" }} // hide the file input
                      />

                      {/* Upload Button with Drag and Drop */}
                      <div
                        className={`mt-4 border-2 border-dashed ${
                          isDragging
                            ? "border-orange-500 bg-orange-50"
                            : "border-teal-500"
                        } rounded-md p-6 text-center`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <p className="font-medium">
                          Drag & drop files to upload
                        </p>
                        <p className="text-sm text-gray-500 mt-1">or</p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={handleSelectFiles}
                        >
                          Select files
                        </Button>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">File limits</span> | 6MB for
                      Image and PDFs, 100MB for ZIPs and 40MB for auto-splitting
                      PDFs
                    </div>
                  </div>

                  {/* Currently Uploading Files */}
                  {files.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Uploading</h3>
                      <div className="space-y-3">
                        {files.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <FileStatusIndicator
                                status={file.status}
                                progress={file.progress}
                              />
                              <div className="ml-2">
                                <div className="text-sm font-medium truncate max-w-[200px]">
                                  {file.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {file.size}
                                </div>
                                {file.message && (
                                  <div className="text-xs text-red-500">
                                    {file.message}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {file.size}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload History */}
                  {uploadHistory.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Upload history</h3>
                      <div className="space-y-3">
                        {uploadHistory.map((file, index) => (
                          <div
                            key={`history-${file.name}-${index}`}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <div className="text-sm font-medium">
                                {file.name}
                              </div>
                              <div className="text-xs text-red-500">
                                {file.message}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">
                                {file.size}
                              </span>
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connect to supplier */}
                  <div>
                    <h3 className="font-medium mb-2">Connect to supplier</h3>
                    <p className="text-sm text-gray-600">
                      Collect documents from supplier websites with{" "}
                      <span className="text-blue-500 font-medium">
                        Invoice Fetch
                      </span>
                      .
                    </p>
                  </div>

                  {/* Extract by Email */}
                  <div>
                    <h3 className="font-medium mb-2">Extract by Email</h3>
                    <p className="text-sm text-gray-600">
                      Send digital documents to your dedicated Dext extraction
                      email address
                    </p>

                    <div className="mt-2">
                      <div className="flex items-center">
                        <span className="text-sm">One document per file:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          muhammad.rizwan.alpha.inc@dext.cc
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-6 w-6 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm">One document per page:</span>
                        <span className="ml-2 text-sm text-gray-600">
                          muhammad.rizwan.alpha.inc@multiple.dext.cc
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-6 w-6 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Snap on mobile */}
                  <div>
                    <h3 className="font-medium mb-2">Snap on mobile</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Download the app and take pictures of your documents with
                      your phone
                    </p>

                    <div className="flex space-x-2">
                      <Select value={phoneCode} onValueChange={setPhoneCode}>
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="+1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+91">+91</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1"
                      />
                      <Button>Send link</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SALES TAB */}
              <TabsContent value="sales" className="mt-0">
                <p className="text-sm text-gray-600">
                  Sales document upload options will appear here.
                </p>
              </TabsContent>

              {/* BANK TAB */}
              <TabsContent value="bank" className="mt-0">
                <p className="text-sm text-gray-600">
                  Bank document upload options will appear here.
                </p>
              </TabsContent>

              {/* SUPPLIER TAB */}
              <TabsContent value="supplier" className="mt-0">
                <p className="text-sm text-gray-600">
                  Supplier statements upload options will appear here.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
