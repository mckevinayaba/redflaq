import { useState, useRef, useEffect } from "react";
import { Menu, X, LayoutDashboard, Settings, LogOut, Share2, Flag, BookOpen, FileText, ChevronDown, Search, Shield, Sparkles, Scale, Heart, Phone, Users, Home, Briefcase, HelpCircle, MessageSquare, ExternalLink } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ShareInviteModal from "@/components/ShareInviteModal";
import { WHATSAPP_CHAT_URL } from "@/constants/whatsapp";

type DropdownItem = {
  label: string;
  desc: string;
  href: string;
  isRoute?: boolean;
  isAnchor?: boolean;
  comingSoon?: boolean;
  icon: React.ReactNode;
};

type NavDropdown = {
  label: string;
  items: DropdownItem[];
};

const ICON_SIZE = 16;
const ICON_COLOR = '#9B8FA3';

const navDropdowns: NavDropdown[] = [
  {
    label: "Products",
    items: [
      { label: "RedFlaq Safety Check", desc: "Verify criminal records in 60 seconds", href: "#how-it-works", isAnchor: true, icon: <Search size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "My Safety Journal", desc: "Private, timestamped evidence documentation", href: "/dashboard/journal", isRoute: true, icon: <BookOpen size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Affidavit Builder", desc: "Generate court-ready legal statements", href: "/dashboard/affidavit", isRoute: true, icon: <FileText size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Protection Order Guide", desc: "Step-by-step legal process to get protection", href: "#protection-orders", isAnchor: true, icon: <Scale size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Safety Resources", desc: "GBV hotlines, care centres, legal aid", href: "/safety-tips#get-help", isRoute: true, icon: <Shield size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Habit", desc: "Daily safety practice — build the habit of checking first", href: "/habit-coming-soon", isRoute: true, comingSoon: true, icon: <Sparkles size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Behavioral Signal", desc: "See patterns and early warning signs over time", href: "/behavioral-signal-coming-soon", isRoute: true, comingSoon: true, icon: <Heart size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "RedFlaq API", desc: "Integrate safety checks into your platform", href: "/api-coming-soon", isRoute: true, comingSoon: true, icon: <ExternalLink size={ICON_SIZE} color={ICON_COLOR} /> },
    ],
  },
  {
    label: "Industries",
    items: [
      { label: "Women Navigating GBVF Risks", desc: "Before the first date. When something feels wrong.", href: "#who-redflaq-helps", isAnchor: true, icon: <Heart size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Parents Protecting Children", desc: "Before the babysitter. Before the tutor.", href: "#who-redflaq-helps", isAnchor: true, icon: <Users size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Protective Family Members", desc: "Sister's new boyfriend. Daughter's roommate.", href: "#who-redflaq-helps", isAnchor: true, icon: <Shield size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Tenants & Landlords", desc: "Who's moving in? Who owns this property?", href: "#who-redflaq-helps", isAnchor: true, icon: <Home size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Employers & Households", desc: "Domestic workers. Contractors. Caregivers.", href: "#who-redflaq-helps", isAnchor: true, icon: <Briefcase size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Support for All", desc: "Friends. Family. Community. Anyone making trust decisions.", href: "#who-redflaq-helps", isAnchor: true, icon: <Users size={ICON_SIZE} color={ICON_COLOR} /> },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Safety Tips", desc: "Practical safety guides and tools", href: "/safety-tips", isRoute: true, icon: <Shield size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Blog", desc: "Stories, insights, and safety education", href: "/blog", isRoute: true, icon: <BookOpen size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Get Help Near You", desc: "Find GBV support in your area", href: "/safety-tips#get-help", isRoute: true, icon: <Phone size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Protection Order Guide", desc: "Legal steps to get protection", href: "#protection-orders", isAnchor: true, icon: <Scale size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "FAQ", desc: "Common questions answered", href: "#faq", isAnchor: true, icon: <HelpCircle size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "RedFlaq.org", desc: "Safety hub for communities & partners", href: "/redflaq-org-coming-soon", isRoute: true, comingSoon: true, icon: <ExternalLink size={ICON_SIZE} color={ICON_COLOR} /> },
    ],
  },
  {
    label: "About",
    items: [
      { label: "About RedFlaq", desc: "Our story and mission", href: "/about", isRoute: true, icon: <Heart size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Why We Exist", desc: "The problem we're solving", href: "/about#why-we-exist", isRoute: true, icon: <Shield size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Our Team", desc: "Meet the people behind RedFlaq", href: "/about#team", isRoute: true, icon: <Users size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Partners", desc: "Organizations we work with", href: "/partners", isRoute: true, icon: <Briefcase size={ICON_SIZE} color={ICON_COLOR} /> },
      { label: "Contact", desc: "Get in touch with us", href: "#footer-contact", isAnchor: true, icon: <MessageSquare size={ICON_SIZE} color={ICON_COLOR} /> },
    ],
  },
];

const NavbarPlinq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const avatarRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    setAvatarOpen(false);
    navigate("/");
  };

  const initial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  const handleNavItem = (item: DropdownItem) => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
    setMobileExpanded(null);

    if (item.isRoute) {
      navigate(item.href);
    } else if (item.isAnchor) {
      // If we're on homepage, scroll; otherwise navigate to / then scroll
      const anchor = item.href.replace('#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + item.href);
      }
    }
  };

  const { guardedAction } = useAuthGuard();
  const handleRunCheck = () => {
    guardedAction();
    setIsMenuOpen(false);
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  const handleGetHelp = () => {
    navigate('/safety-tips#get-help');
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('get-help');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const fontBase: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };

  return (
    <nav
      id="redflaq-navbar"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%',
        height: 72, zIndex: 2147483647, visibility: 'visible', opacity: 1, display: 'block',
        background: isScrolled ? 'rgba(245, 240, 235, 0.92)' : '#F5F0EB',
        backdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(214, 211, 205, 0.6)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 1px 24px rgba(124, 58, 237, 0.06)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease, box-shadow 0.4s ease',
        transform: 'translate3d(0,0,0)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={redflaqLogo}
              alt="RedFlaq - Instant Criminal Record Verification"
              loading="eager"
              fetchPriority="high"
              style={{ height: isMobile ? 40 : 44, width: 'auto', display: 'block' }}
            />
          </a>

          {/* Desktop: Left nav dropdowns */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 32 }}>
              {navDropdowns.map((dd) => (
                <div
                  key={dd.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => handleDropdownEnter(dd.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    style={{
                      ...fontBase, fontSize: 13, fontWeight: 500, color: openDropdown === dd.label ? '#7C3AED' : '#4B4453',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
                      display: 'flex', alignItems: 'center', gap: 4, borderRadius: 8,
                      transition: 'color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    {dd.label}
                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: openDropdown === dd.label ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  {/* Dropdown panel */}
                  {openDropdown === dd.label && (
                    <div
                      style={{
                        position: 'absolute', left: 0, top: '100%', paddingTop: 8,
                        width: dd.label === 'Products' ? 380 : 340, zIndex: 100,
                      }}
                      onMouseEnter={() => handleDropdownEnter(dd.label)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div style={{
                        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(214,211,205,0.5)', borderRadius: 14,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: '8px 0',
                      }}>
                        {dd.items.map((item, i) => {
                          // Separator before coming soon items
                          const prevItem = i > 0 ? dd.items[i - 1] : null;
                          const showSeparator = item.comingSoon && prevItem && !prevItem.comingSoon;
                          return (
                            <div key={item.label}>
                              {showSeparator && (
                                <div style={{ borderTop: '1px solid rgba(214,211,205,0.4)', margin: '6px 16px', position: 'relative' }}>
                                  <span style={{ ...fontBase, position: 'absolute', top: -8, left: 0, background: 'white', padding: '0 8px', fontSize: 10, color: '#9B8FA3', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Coming Soon</span>
                                </div>
                              )}
                              <button
                                onClick={() => handleNavItem(item)}
                                style={{
                                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 18px',
                                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                                  borderRadius: 8, transition: 'background 0.15s', textAlign: 'left',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                              >
                                <div style={{ marginTop: 2, flexShrink: 0 }}>{item.icon}</div>
                                <div>
                                  <div style={{ ...fontBase, fontSize: 13, fontWeight: 600, color: '#2D2235', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {item.label}
                                    {item.comingSoon && (
                                      <span style={{ ...fontBase, fontSize: 9, fontWeight: 700, color: '#7C3AED', background: 'rgba(124,58,237,0.08)', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.05em' }}>🔜</span>
                                    )}
                                  </div>
                                  <div style={{ ...fontBase, fontSize: 12, color: '#888888', marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Shop link (no dropdown) */}
              <a
                href="/shop"
                onClick={(e) => { e.preventDefault(); navigate('/shop'); }}
                style={{
                  ...fontBase, fontSize: 13, fontWeight: 500, color: '#4B4453',
                  padding: '8px 12px', borderRadius: 8, textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#7C3AED'; e.currentTarget.style.background = 'rgba(124,58,237,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#4B4453'; e.currentTarget.style.background = 'none'; }}
              >
                Shop
              </a>
            </div>
          )}

          {/* Desktop: Right side */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* WhatsApp */}
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with us on WhatsApp"
                style={{
                  ...fontBase, fontSize: 12, fontWeight: 500, color: '#25D366',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 10px', borderRadius: 8, transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>

              {isAuthenticated ? (
                <>
                  {/* Avatar dropdown */}
                  <div style={{ position: 'relative' }} ref={avatarRef}>
                    <button
                      onClick={() => setAvatarOpen(!avatarOpen)}
                      style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'rgba(124,58,237,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...fontBase, fontWeight: 700, fontSize: 13,
                        color: '#7C3AED', border: '1.5px solid rgba(124,58,237,0.2)',
                        cursor: 'pointer', transition: 'border-color 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                    >
                      {initial}
                    </button>
                    {avatarOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 44, width: 210,
                        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(214,211,205,0.5)', borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, padding: '6px 0',
                      }}>
                        <button onClick={() => { navigate('/dashboard'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...fontBase, fontSize: 13, color: '#2D2235', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <LayoutDashboard size={15} color="#9B8FA3" /> Dashboard
                        </button>
                        <button onClick={() => { navigate('/dashboard/journal'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...fontBase, fontSize: 13, color: '#2D2235', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <BookOpen size={15} color="#9B8FA3" /> My Safety Journal
                        </button>
                        <button onClick={() => { navigate('/dashboard/reports'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...fontBase, fontSize: 13, color: '#2D2235', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <FileText size={15} color="#9B8FA3" /> My Saved Checks
                        </button>
                        <button onClick={() => { navigate('/dashboard/account'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...fontBase, fontSize: 13, color: '#2D2235', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <Settings size={15} color="#9B8FA3" /> Account Settings
                        </button>
                        <div style={{ borderTop: '1px solid rgba(214,211,205,0.5)', margin: '4px 12px' }} />
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...fontBase, fontSize: 13, color: '#DC2626', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <LogOut size={15} /> Log Out
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Run a Check */}
                  <button
                    onClick={handleRunCheck}
                    style={{
                      background: '#7C3AED', color: 'white', padding: '9px 20px',
                      ...fontBase, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                      borderRadius: 50, transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Run a Check
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/signup?mode=signin')}
                    style={{
                      ...fontBase, fontWeight: 500, fontSize: 13, color: '#4B4453',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
                    }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    style={{
                      ...fontBase, fontWeight: 700, fontSize: 13, color: '#7C3AED',
                      background: 'transparent', border: '1.5px solid #7C3AED',
                      padding: '9px 18px', cursor: 'pointer', borderRadius: 50,
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Create Free Safety Base
                  </button>
                  <button
                    onClick={handleRunCheck}
                    style={{
                      ...fontBase, fontWeight: 700, fontSize: 13, color: 'white',
                      background: '#7C3AED', border: 'none', padding: '9px 20px',
                      cursor: 'pointer', borderRadius: 50,
                      boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
                      transition: 'background 0.2s, transform 0.2s',
                      display: 'flex', flexDirection: 'column' as const, alignItems: 'center', lineHeight: 1.2,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span>Run a Check</span>
                    <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.8 }}>From R99</span>
                  </button>
                </>
              )}

              {/* Share icon */}
              <button
                onClick={() => setShareOpen(true)}
                title="Share RedFlaq"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', borderRadius: 8, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Share2 size={16} color="#4B4453" />
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isAuthenticated && (
                <button
                  onClick={handleRunCheck}
                  style={{
                    ...fontBase, fontWeight: 700, fontSize: 11, color: 'white',
                    background: '#7C3AED', border: 'none', padding: '7px 14px',
                    cursor: 'pointer', borderRadius: 50,
                  }}
                >
                  Run a Check
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isMenuOpen ? <X size={22} color="#2D2235" /> : <Menu size={22} color="#2D2235" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Mobile Menu ═══ */}
      {isMobile && isMenuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(214,211,205,0.5)',
            background: 'rgba(247, 244, 240, 0.98)', backdropFilter: 'blur(16px)',
            position: 'relative', zIndex: 2147483647,
            maxHeight: 'calc(100vh - 72px)', overflowY: 'auto',
          }}
        >
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Dropdown sections */}
            {navDropdowns.map((dd) => (
              <div key={dd.label}>
                <button
                  onClick={() => setMobileExpanded(mobileExpanded === dd.label ? null : dd.label)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '14px 0', ...fontBase, fontWeight: 600, fontSize: 15,
                    color: '#2D2235', background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid rgba(214,211,205,0.3)',
                  }}
                >
                  {dd.label}
                  <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: mobileExpanded === dd.label ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {mobileExpanded === dd.label && (
                  <div style={{ padding: '8px 0 12px 8px' }}>
                    {dd.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavItem(item)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 8px',
                          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left', borderRadius: 8,
                        }}
                      >
                        <div style={{ marginTop: 2, flexShrink: 0 }}>{item.icon}</div>
                        <div>
                          <div style={{ ...fontBase, fontSize: 13, fontWeight: 600, color: '#2D2235', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {item.label}
                            {item.comingSoon && <span style={{ fontSize: 9, color: '#7C3AED', background: 'rgba(124,58,237,0.08)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>🔜</span>}
                          </div>
                          <div style={{ ...fontBase, fontSize: 11, color: '#888888', marginTop: 1 }}>{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Shop link */}
            <button
              onClick={() => { navigate('/shop'); setIsMenuOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '14px 0',
                ...fontBase, fontWeight: 600, fontSize: 15, color: '#2D2235',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: '1px solid rgba(214,211,205,0.3)',
              }}
            >
              Shop
            </button>

            {/* Action buttons */}
            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* WhatsApp */}
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%', background: '#25D366', color: 'white',
                  padding: '13px 20px', ...fontBase, fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer', borderRadius: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  textDecoration: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>

              {/* Get Help */}
              <button
                onClick={handleGetHelp}
                style={{
                  width: '100%', background: '#DC2626', color: 'white',
                  padding: '13px 20px', ...fontBase, fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer', borderRadius: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Flag size={14} /> Get Help
              </button>

              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0', color: '#7C3AED', ...fontBase, fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Dashboard
                  </button>
                  <button onClick={handleRunCheck}
                    style={{ width: '100%', background: '#7C3AED', color: 'white', padding: '13px 20px', ...fontBase, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 50, boxShadow: '0 2px 12px rgba(124,58,237,0.25)' }}>
                    Run a Check
                  </button>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0', color: '#DC2626', ...fontBase, fontWeight: 500, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Log Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { navigate('/signup?mode=signin'); setIsMenuOpen(false); }}
                    style={{ flex: 1, background: 'transparent', color: '#4B4453', padding: '13px 16px', ...fontBase, fontWeight: 600, fontSize: 13, border: '1.5px solid rgba(214,211,205,0.7)', cursor: 'pointer', borderRadius: 50 }}>
                    Log In
                  </button>
                  <button onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                    style={{ flex: 1, background: '#7C3AED', color: 'white', padding: '13px 16px', ...fontBase, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', borderRadius: 50 }}>
                    Create Free Safety Base
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </nav>
  );
};

export default NavbarPlinq;
