const SCRAPS = [
  { left: "6%", top: "12%", width: 130, height: 100, rotate: -12 },
  { left: "18%", bottom: "10%", width: 110, height: 150, rotate: 8 },
  { right: "10%", top: "8%", width: 150, height: 110, rotate: 6 },
  { right: "16%", bottom: "14%", width: 120, height: 90, rotate: -16 },
  { left: "38%", top: "4%", width: 90, height: 120, rotate: -4 },
  { left: "44%", bottom: "6%", width: 140, height: 100, rotate: 14 },
  { left: "2%", top: "55%", width: 100, height: 80, rotate: 20 },
  { right: "4%", top: "48%", width: 110, height: 130, rotate: -9 },
];

export function PaperScraps({ className }: { className: string }) {
  return (
    <>
      {SCRAPS.map((scrap, i) => (
        <div
          key={i}
          className={className}
          style={{
            left: scrap.left,
            right: scrap.right,
            top: scrap.top,
            bottom: scrap.bottom,
            width: scrap.width,
            height: scrap.height,
            transform: `rotate(${scrap.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
}
