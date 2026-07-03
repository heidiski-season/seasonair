import Container from "@/components/container";

export default function MissionStrip() {
  return (
    <section className="bg-[#0a1628] py-14 text-center">
      <Container>
        <p className="mx-auto max-w-2xl font-display text-2xl font-medium non-italic leading-snug text-white sm:text-3xl">
          "We exist to give you an effortless entry into a fun winter season.
          <span className="not-italic text-glacier"> Work hard. Play hard(er)!</span>"
        </p>
      </Container>
    </section>
  );
}
