"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0].src : "");

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-md aspect-square bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Imagen Principal */}
      <div className="w-full aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative group">
        <img 
          src={mainImage} 
          alt={productName} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img.src)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-md overflow-hidden bg-white snap-center transition-colors ${
                mainImage === img.src ? "border-[#e52e04]" : "border-gray-200 hover:border-[#fb7701]"
              }`}
            >
              <img src={img.src} alt={`${productName} - thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
