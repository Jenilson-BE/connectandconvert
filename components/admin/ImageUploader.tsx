"use client";

import * as React from "react";
import Image from "next/image";
import { AlertCircle, Check, ImageIcon, Loader2, Upload, X } from "lucide-react";

type MediaKind = "logo" | "og";

interface ImageUploaderProps {
  kind: MediaKind;
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
  /** Rendered inside a square, as a logo does. */
  square?: boolean;
  localPlaceholder?: string;
}

interface UploadResponse {
  success: boolean;
  message?: string;
  image?: { secureUrl: string; width: number; height: number; format: string };
}

const FIELD_CLASS =
  "w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]";

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

export function ImageUploader({
  kind,
  value,
  onChange,
  label,
  hint,
  square = false,
  localPlaceholder = "/logo.png",
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [configured, setConfigured] = React.useState<boolean | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const [justUploaded, setJustUploaded] = React.useState(false);

  // Uploads are optional: when Cloudinary is not configured the field stays a
  // plain URL input so the form keeps working.
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/upload")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setConfigured(Boolean(data?.configured));
      })
      .catch(() => {
        if (!cancelled) setConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("kind", kind);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data: UploadResponse = await res.json().catch(() => ({ success: false }));

      if (!res.ok || !data.success || !data.image) {
        setError(data.message || "Upload failed. Please try again.");
        return;
      }

      onChange(data.image.secureUrl);
      setJustUploaded(true);
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const previewSrc = value || localPlaceholder;

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
        {label}
      </label>

      {configured && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mb-3 rounded-2xl border-2 border-dashed p-4 transition-colors ${
            dragging
              ? "border-[#6D28D9] bg-[#F5EFFF]"
              : "border-[#E8E2EF] bg-[#FAF9FC]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`relative shrink-0 overflow-hidden rounded-xl border border-[#E8E2EF] bg-white ${
                square ? "h-16 w-16" : "h-16 w-24"
              }`}
            >
              <Image
                src={previewSrc}
                alt=""
                fill
                sizes="96px"
                unoptimized={previewSrc.startsWith("http")}
                className="object-contain p-1"
              />
            </div>

            <div className="min-w-0 flex-1">
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                }}
                className="hidden"
                id={`upload-${kind}`}
              />
              <label
                htmlFor={`upload-${kind}`}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                  uploading
                    ? "bg-[#E8E2EF] text-[#625A6D]"
                    : "bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
                }`}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>{uploading ? "Uploading..." : "Upload image"}</span>
              </label>
              <p className="mt-2 text-[11px] text-[#625A6D]">
                {hint ?? `JPG, PNG, WebP or GIF. ${kind === "logo" ? "Max 2 MB." : "Max 5 MB."}`}{" "}
                Drag and drop works too.
              </p>
            </div>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                title="Clear image"
                className="shrink-0 rounded-lg p-2 text-[#625A6D] transition-colors hover:bg-[#FEF2F2] hover:text-[#991B1B]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3 text-xs text-[#991B1B]">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {justUploaded && !error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span>Upload complete. Save the page to apply it.</span>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="/logo.png or https://..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setJustUploaded(false);
          }}
          className={FIELD_CLASS}
        />
        {value && (
          <ImageIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A79FBD]" />
        )}
      </div>

      {configured === false && (
        <p className="mt-2 text-[11px] text-[#625A6D]">
          Direct upload is unavailable because Cloudinary is not configured on this server, so
          enter an image URL instead.
        </p>
      )}
    </div>
  );
}
