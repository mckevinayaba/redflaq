import { useScrollReveal } from "@/hooks/useScrollReveal";

const photos = [
  { src: "https://images.unsplash.com/photo-1589156280159-27a852cc18c4?w=800&q=80", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&q=80" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" },
];

const PhotoGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '0 60px 100px', maxWidth: 1200, margin: '0 auto' }}>
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
              alt="South African woman"
              className="transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;
