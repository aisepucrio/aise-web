import Hero from "@/components/block-1/Hero";
import DottedBlueBackground from "@/components/block-2/DottedBlueBackground";

export default function Home() {
  return (
    <>
      <Hero
        height="112vh"
        title={
          "Welcome to AISE Lab Artificial Intelligence and Software Engineering Laboratory"
        }
        subtitle={
          "Where we are dedicated to advancing the frontiers of software engineering through innovative Artificial Intelligence (AI) technologies"
        }
      />
      <DottedBlueBackground height="300vh" />
    </>
  );
}
