import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SignalCard from "@/components/signals/SignalCard";
import type { SignalCategory } from "./SignalsCategories";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
}

interface SignalsGridProps {
  activeCategory: SignalCategory;
}

const SignalsGrid = ({ activeCategory }: SignalsGridProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase
        .from("academy_articles")
        .select("id, title, slug, excerpt, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(24);

      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory);
      }

      const { data } = await query;
      setArticles((data || []) as Article[]);
      setLoading(false);
    };

    fetchArticles();
  }, [activeCategory]);

  if (loading) {
    return (
      <div style={{ background: "var(--rf-paper)", padding: "4rem 2rem", display: "flex", justifyContent: "center" }}>
        <div style={{ width: 28, height: 28, border: "3px solid #E6E0DA", borderTopColor: "#7C3AED", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div style={{ background: "var(--rf-paper)", padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--rf-sans)", fontSize: 15, color: "#888", margin: 0 }}>
          No signals in this category yet.
        </p>
      </div>
    );
  }

  return (
    <section style={{ background: "var(--rf-paper)", padding: "2.5rem 2rem 4rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <SignalCard
              key={a.id}
              title={a.title}
              slug={a.slug}
              excerpt={a.excerpt}
              category={a.category}
              created_at={a.created_at}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignalsGrid;
