import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GbvResource {
  id: string;
  name: string;
  type: string;
  province: string | null;
  phone: string;
  whatsapp: string | null;
  hours: string | null;
  icon: string;
  description: string | null;
  services: string[] | null;
}

interface GetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  riskLevel?: string;
  userProvince?: string;
}

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

function ResourceCard({ resource }: { resource: GbvResource }) {
  const phoneDigits = resource.phone.replace(/\s+/g, '');
  return (
    <div className="flex gap-4 p-5 border border-border rounded-lg mb-4">
      <span className="text-[32px] flex-shrink-0">{resource.icon}</span>
      <div className="flex-1">
        <h4 className="m-0 mb-1 font-heading text-base font-bold text-foreground">
          {resource.name}
        </h4>
        {resource.description && (
          <p className="m-0 mb-3 font-body text-sm text-muted-foreground">
            {resource.description}
          </p>
        )}
        <div className="flex gap-3 flex-wrap mb-2">
          <a
            href={`tel:${phoneDigits}`}
            className="px-4 py-2.5 rounded-md no-underline text-sm font-semibold bg-primary text-primary-foreground inline-block"
          >
            📞 Call {resource.phone}
          </a>
          {resource.whatsapp && (
            <a
              href={`https://wa.me/${resource.whatsapp.replace(/[^0-9+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-md no-underline text-sm font-semibold bg-[#25D366] text-white inline-block"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
        {resource.hours && (
          <span className="font-mono text-xs text-muted-foreground">
            {resource.hours}
          </span>
        )}
      </div>
    </div>
  );
}

export default function GetHelpModal({ isOpen, onClose, riskLevel, userProvince }: GetHelpModalProps) {
  const [selectedProvince, setSelectedProvince] = useState(userProvince || '');
  const [resources, setResources] = useState<GbvResource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProvince) setSelectedProvince(userProvince);
  }, [userProvince]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchResources = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('gbv_resources')
          .select('*')
          .order('priority', { ascending: false });

        if (selectedProvince) {
          query = query.or(`province.is.null,province.eq.${selectedProvince}`);
        } else {
          query = query.is('province', null);
        }

        const { data } = await query;
        setResources((data as GbvResource[]) || []);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [isOpen, selectedProvince]);

  if (!isOpen) return null;

  const isCritical = riskLevel === 'RED';
  const nationalResources = resources.filter(r => !r.province);
  const provincialNGOs = resources.filter(r => r.province && r.type === 'ngo');
  const provincialTCCs = resources.filter(r => r.province && r.type === 'tcc');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto p-8 relative border border-border"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-[28px] cursor-pointer text-muted-foreground leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="font-heading text-2xl text-foreground m-0 mb-6">
          Get Help Now
        </h2>

        {isCritical && (
          <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-4 mb-6 text-center">
            <p className="font-body text-base font-bold text-destructive m-0">
              ⚠️ If you're in immediate danger, call <a href="tel:10111" className="text-destructive">10111</a> now.
            </p>
          </div>
        )}

        {/* Province Selector */}
        <div className="mb-6">
          <label htmlFor="helpProvince" className="block text-sm font-semibold text-foreground mb-2">
            📍 Your Province <span className="text-muted-foreground font-normal">(shows nearby resources)</span>
          </label>
          <select
            id="helpProvince"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full px-4 py-3 border-2 border-border rounded-xl text-base focus:outline-none focus:border-primary bg-background"
          >
            <option value="">All provinces (national only)</option>
            {SA_PROVINCES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">Your location is private and not stored.</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground text-sm">Loading resources...</p>
          </div>
        ) : (
          <>
            {/* Emergency / National */}
            <div className="my-6">
              <h3 className="font-body text-lg font-bold text-foreground mb-4">
                🆘 Emergency Support (24/7 — All SA)
              </h3>
              {nationalResources.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>

            {/* Provincial Resources */}
            {selectedProvince && (
              <div className="my-8">
                <h3 className="font-body text-lg font-bold text-foreground mb-4">
                  📍 Resources in {selectedProvince}
                </h3>

                {provincialNGOs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Support Organizations
                    </h4>
                    {provincialNGOs.map(r => <ResourceCard key={r.id} resource={r} />)}
                  </div>
                )}

                {provincialTCCs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-body text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Thuthuzela Care Centres (Medical + Evidence)
                    </h4>
                    {provincialTCCs.map(r => <ResourceCard key={r.id} resource={r} />)}
                  </div>
                )}

                {provincialNGOs.length === 0 && provincialTCCs.length === 0 && (
                  <div className="bg-accent/50 border border-border rounded-lg p-4 text-center">
                    <p className="text-foreground font-semibold mb-1">⚠️ Limited local resources in {selectedProvince}.</p>
                    <p className="text-muted-foreground text-sm m-0">Contact the GBV Command Centre above — they can direct you to the nearest services.</p>
                  </div>
                )}
              </div>
            )}

            {!selectedProvince && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center my-6">
                <p className="text-muted-foreground text-sm m-0">
                  👆 Select your province above to see local NGOs and Thuthuzela Care Centres near you.
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-border text-center">
          <p className="font-body text-base font-bold text-muted-foreground m-0 mb-1">
            You're not alone. Help is available.
          </p>
          <p className="font-body text-[13px] text-muted-foreground m-0">
            All calls and messages are confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
