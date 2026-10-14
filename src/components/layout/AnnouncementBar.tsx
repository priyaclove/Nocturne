/** Slim top strip. Restrained, single line. */
export function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-2 text-center">
        <p className="eyebrow text-muted">
          Complimentary shipping over{" "}
          <span className="text-gold">₹5,000</span> · A house of considered living
        </p>
      </div>
    </div>
  );
}
