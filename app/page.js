import { supabase } from "@/lib/supabase";
import Hero from "./components/Hero";
import ResourceSection from "./components/ResourceSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export const dynamic = "force-dynamic";

async function getResources() {
  const { data } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: true });
  return data || [];
}

async function getSettings() {
  const { data } = await supabase.from("site_config").select("*");
  const settings = {};
  if (data) {
    data.forEach((item) => {
      settings[item.key] = item.value;
    });
  }
  return settings;
}

export default async function Home() {
  const resources = await getResources();
  const settings = await getSettings();

  const freeResources = resources
    .filter((r) => r.type === "free")
    .map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      description: r.description,
      link: r.link,
      buttonLabel: r.button_label,
    }));

  const paidResources = resources
    .filter((r) => r.type === "paid")
    .map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      description: r.description,
      link: r.link,
      buttonLabel: r.button_label,
    }));

  return (
    <main>
      <Hero settings={settings} />

      {freeResources.length > 0 && (
        <ResourceSection
          id="free-resources"
          title={settings.section_free_title || "Resource Gratis"}
          subtitle={settings.section_free_subtitle || "Coba dulu. Nilai nanti."}
          resources={freeResources}
          altBackground={true}
        />
      )}

      {paidResources.length > 0 && (
        <ResourceSection
          id="paid-resources"
          title={settings.section_paid_title || "Resource Berbayar"}
          subtitle={settings.section_paid_subtitle || "Buat eksekusi yang lebih cepat."}
          resources={paidResources}
          altBackground={false}
        />
      )}

      <ContactSection settings={settings} />

      <Footer settings={settings} />
    </main>
  );
}
