import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ImageLightboxProps {
  images: { src: string; alt: string }[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImageLightbox({ images, initialIndex, open, onOpenChange }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, prev, next, onOpenChange]);

  const current = images[index];
  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none sm:rounded-2xl overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-50 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative flex items-center justify-center min-h-[60vh] max-h-[90vh]">
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full p-2 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}

          <img
            src={current.src}
            alt={current.alt}
            className="max-w-full max-h-[85vh] object-contain select-none"
            draggable={false}
          />

          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-2 z-40 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full p-2 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/30"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
