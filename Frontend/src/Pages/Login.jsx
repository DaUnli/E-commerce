import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xl">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white">
              O
            </div>
            Odaplace
          </div>

          <div className="flex-1 max-w-2xl flex items-center bg-gray-100 rounded-full px-4 py-2 border">
            <input
              type="text"
              placeholder="Asus"
              className="bg-transparent flex-1 outline-none px-2"
            />
            <button className="bg-orange-600 text-white px-6 py-1.5 rounded-full font-medium">
              Search
            </button>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            {/* Icons for User, Cart, Notification */}
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex py-6 px-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0">
          <h2 className="font-bold text-lg mb-4">Filter</h2>
          <FilterSection
            title="Suppliers Types"
            options={["Trade Assurance", "Verified Suppliers"]}
          />
          <FilterSection
            title="Product Types"
            options={["Ready to Ship", "Paid Samples"]}
          />

          <div className="mt-6">
            <label className="text-sm font-bold">Min Order</label>
            <input type="range" className="w-full accent-orange-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10</span>
              <span>1000</span>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <section className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-sm">
              1 - 16 over 7,000 results for{" "}
              <span className="text-orange-600 font-bold">"Asus"</span>
            </h1>
            <select className="border rounded-lg px-3 py-1 text-sm outline-none">
              <option>Best Match</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
