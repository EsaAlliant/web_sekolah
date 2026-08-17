import { PageBanner } from "@/components/common/PageBanner";
import { Section } from "@/components/common/Section";
import { TestimonialGrid } from "@/components/directory/TestimonialGrid";
import { getTestimonials } from "@/services/testimonial.service";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageBanner breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Testimoni" }]} description="Cerita dan pengalaman langsung dari alumni, peserta didik, dan orang tua tentang sekolah kami." eyebrow="Testimoni" title="Kata Mereka Tentang Kami" />

      <Section>
        <TestimonialGrid testimonials={testimonials} />
      </Section>
    </>
  );
}
