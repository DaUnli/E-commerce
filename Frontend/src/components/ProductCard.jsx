import React from "react";
import { ShoppingCart, Edit, Trash2 } from "lucide-react";

const ProductCard = ({ product, isAdmin, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border hover:shadow-lg transition-all p-4 group cursor-pointer">
      <div className="h-48 flex items-center justify-center bg-slate-50 rounded-lg mb-4 overflow-hidden">
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="object-contain h-32 group-hover:scale-110 transition-transform"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${product.price}
          </span>
        </div>

        <h3 className="text-sm font-medium text-slate-700 leading-snug h-10 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-400/20 px-1.5 py-0.5 rounded">
              <span className="text-yellow-600 text-[10px] font-bold">
                ★ {product.ratings || 0}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Sold {product.numOfReviews || 0}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="text-orange-500 hover:bg-orange-50 p-1.5 rounded-full border border-orange-500">
              <ShoppingCart size={14} />
            </button>

            {isAdmin && (
              <>
                <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full border border-blue-500">
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
