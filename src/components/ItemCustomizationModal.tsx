import React, { useState } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { MenuItem, Restaurant, SelectedOption } from '../types';
import { useCart } from '../context/CartContext';

interface ItemCustomizationModalProps {
  item: MenuItem | null;
  restaurant: Restaurant | null;
  onClose: () => void;
}

export const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({
  item,
  restaurant,
  onClose,
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  if (!item || !restaurant) return null;

  // Handle single selection for required groups
  const handleSelectOption = (group: { id: string; name: string; required: boolean }, option: { id: string; name: string; price: number }) => {
    if (group.required) {
      // Replace existing in group
      setSelectedOptions((prev) => [
        ...prev.filter((o) => o.groupId !== group.id),
        {
          groupId: group.id,
          groupName: group.name,
          optionId: option.id,
          optionName: option.name,
          price: option.price,
        },
      ]);
    } else {
      // Toggle optional selection
      setSelectedOptions((prev) => {
        const exists = prev.some((o) => o.groupId === group.id && o.optionId === option.id);
        if (exists) {
          return prev.filter((o) => !(o.groupId === group.id && o.optionId === option.id));
        } else {
          return [
            ...prev,
            {
              groupId: group.id,
              groupName: group.name,
              optionId: option.id,
              optionName: option.name,
              price: option.price,
            },
          ];
        }
      });
    }
  };

  const extraTotal = selectedOptions.reduce((sum, o) => sum + o.price, 0);
  const totalItemPrice = (item.price + extraTotal) * quantity;

  const handleAddToCart = () => {
    addItem(item, quantity, selectedOptions, restaurant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}
            />
            <h3 className="text-base font-bold text-gray-900 truncate">{item.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div>
              <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              <p className="text-base font-bold text-gray-900 mt-1">₹{item.price}</p>
            </div>
          </div>

          {/* Option Groups */}
          {item.optionGroups?.map((group) => (
            <div key={group.id} className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  {group.name}
                </h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {group.required ? 'Required' : 'Optional'}
                </span>
              </div>

              <div className="space-y-1.5">
                {group.options.map((opt) => {
                  const isChecked = selectedOptions.some(
                    (o) => o.groupId === group.id && o.optionId === opt.id
                  );

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(group, opt)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isChecked
                          ? 'border-orange-500 bg-orange-50/60'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-${
                            group.required ? 'full' : 'md'
                          } border flex items-center justify-center ${
                            isChecked
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-medium text-gray-800">{opt.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {opt.price === 0 ? 'Free' : `+₹${opt.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity Controls */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Quantity</span>
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-gray-600 hover:text-orange-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-gray-900 w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="text-gray-600 hover:text-orange-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500">Total Payable</p>
            <p className="text-lg font-bold text-gray-900">₹{totalItemPrice}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-colors"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
};
