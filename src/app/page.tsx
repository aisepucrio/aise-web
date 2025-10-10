import Hero from "@/pages/block-1/Hero";
import BlockTwoMain from "@/pages/block-2/BlockTwoMain";

export default function Home() {
  return (
    <>
      <Hero
        height="150vh"
        title={
          "Welcome to AISE Lab Artificial Intelligence and Software Engineering Laboratory"
        }
        subtitle={
          "Where we are dedicated to advancing the frontiers of software engineering through innovative Artificial Intelligence (AI) technologies"
        }
      />
      <BlockTwoMain height="200rem" />
    </>
  );
}
