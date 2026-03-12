import fatherChildImg from "@/assets/sa-father-child.jpg";
import parentSchoolchildImg from "@/assets/sa-parent-schoolchild.jpg";
import communityGroupImg from "@/assets/sa-community-group.jpg";

const CommunityImageStrip = () => {
  return (
    <section style={{ background: '#FFFFFF', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: 32,
          letterSpacing: '0.04em',
          fontWeight: 600,
        }}>
          PROTECTING FAMILIES · BUILDING SAFER COMMUNITIES
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { src: fatherChildImg, alt: "South African father walking with his young daughter in a suburban neighbourhood" },
            { src: parentSchoolchildImg, alt: "South African mother holding her son's hand at a busy transport hub" },
            { src: communityGroupImg, alt: "Diverse group of South African adults having a friendly conversation in their neighbourhood" },
          ].map((img) => (
            <div key={img.alt} style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityImageStrip;
