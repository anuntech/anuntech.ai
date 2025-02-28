"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadIcon, FileTextIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Por favor, selecione um arquivo de texto (.txt)");
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setUploadStatus(null);
    setError(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        setUploadStatus({
          success: true,
          message: "Documento enviado com sucesso!",
          details: data.message || "O documento foi processado e está pronto para uso."
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao enviar o documento.");
        setUploadStatus({
          success: false,
          message: "Falha ao enviar o documento."
        });
      }
    } catch (err) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
      setUploadStatus({
        success: false,
        message: "Falha ao enviar o documento."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-3xl px-4">
          <form onSubmit={handleSubmit} className="space-y-6 py-8">
            <div className="space-y-4">
              <div 
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl ${
                  isDragging 
                    ? "border-[#041E40] bg-[#041E40]/5" 
                    : "border-gray-200 bg-gray-50 hover:border-[#041E40]/30"
                } transition-all cursor-pointer`}
                onClick={handleSelectFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!file ? (
                  <>
                    <FileTextIcon className={`h-16 w-16 ${isDragging ? "text-[#041E40]" : "text-gray-400"} mb-6`} />
                    <p className={`mb-2 text-base ${isDragging ? "text-[#041E40]" : "text-gray-600"}`}>
                      <span className="font-semibold">Clique para selecionar</span> ou arraste um arquivo
                    </p>
                    <p className={`text-sm ${isDragging ? "text-[#041E40]/70" : "text-gray-500"} mb-4`}>
                      Apenas arquivos TXT (máximo 10MB)
                    </p>
                  </>
                ) : (
                  <>
                    <FileTextIcon className="h-16 w-16 text-[#041E40] mb-6" />
                    <p className="mb-2 text-base font-medium text-[#041E40]">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                )}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 rounded-xl border-[#041E40]/30 hover:bg-[#041E40]/5 hover:text-[#041E40]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectFile();
                  }}
                >
                  {file ? "Trocar Arquivo" : "Selecionar Arquivo"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <XCircleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2 rounded-full" />
                <p className="text-sm text-center text-gray-500">
                  Enviando e processando documento... {progress}%
                </p>
              </div>
            )}

            {uploadStatus && (
              <Alert
                className={
                  uploadStatus.success
                    ? "bg-green-50 text-green-800 rounded-xl border-green-100"
                    : "bg-red-50 text-red-800 rounded-xl border-red-100"
                }
              >
                {uploadStatus.success ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <XCircleIcon className="h-4 w-4" />
                )}
                <AlertDescription>{uploadStatus.message}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-[#041E40] text-white hover:bg-[#0a2d5c] rounded-xl h-12"
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">
                    <UploadIcon className="h-5 w-5" />
                  </span>
                  <span>Enviando...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  <span>Enviar Documento</span>
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 