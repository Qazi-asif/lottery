/** Stylized product frame — abstract UI, not stock photography */
export function ProductShowcase() {
  return (
    <div className="rounded-lg border border-white/10 bg-[#141416] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-small uppercase tracking-[0.18em] text-gold">Scan</p>
          <p className="mt-1 font-serif text-h3 text-bg">Main St Store</p>
        </div>
        <span className="rounded-lg border border-gold/40 px-3 py-1 text-small text-gold-soft">
          Live
        </span>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-6">
        <p className="text-small text-white/50">Last scan</p>
        <p className="mt-2 font-serif text-h2 text-bg">Morning Cash</p>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-body text-white/70">Ticket 047 · $1.00</p>
          <p className="text-small uppercase tracking-wide text-success">Sold</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ["In stock", "128"],
          ["Sold today", "34"],
          ["Commission", "$17"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 px-3 py-4"
          >
            <p className="text-small text-white/45">{label}</p>
            <p className="mt-2 font-serif text-h3 text-bg">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
