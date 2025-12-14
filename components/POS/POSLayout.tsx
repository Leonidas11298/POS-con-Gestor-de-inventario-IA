import React from 'react';
import ProductCatalog from './ProductCatalog';
import CartSection from './CartSection';

export default function POSLayout() {
    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Left Panel: Catalog (65%) */}
            <div className="w-[65%] h-full border-r border-gray-200">
                <ProductCatalog />
            </div>

            {/* Right Panel: Cart (35%) */}
            <div className="w-[35%] h-full">
                <CartSection />
            </div>
        </div>
    );
}
