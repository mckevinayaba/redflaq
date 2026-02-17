import { useScrollReveal } from "@/hooks/useScrollReveal";

const photos = [
  { src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80", caption: "Johannesburg · Making informed decisions", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80", caption: "Cape Town · Verified before trusting" },
  { src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&q=80", caption: "Durban · Protected by information" },
  { src: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80", caption: "Pretoria · Clarity before commitment" },
  { src: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=500&q=80", caption: "Soweto · Safety is her right" },
];

const PhotoGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '0 60px 100px', maxWidth: 1200, margin: '0 auto' }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#9CA3AF', textAlign: 'center', marginBottom: 20,
      }}>
        Real women. Real South Africa. Real stakes.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gridTemplateRows: '280px 280px',
        gap: 8,
      }}>
        {photos.map((photo, i) => (
          <div
            key={i}
            className="group"
            style={{
              overflow: 'hidden', position: 'relative',
              ...(i === 0 ? { gridRow: '1 / 3' } : {}),
            }}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              className="transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
            />
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '24px 16px 14px',
              }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase',
              }}>
                {photo.caption}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;
