import Hero from "@/components/home/block-1/Hero";
import BlockTwoMain from "@/components/home/block-2/BlockTwoMain";
import BlobTestWidget from "@/components/BlobTestWidget";

export default function Home() {
  return (
    <>
      <Hero height="100vh" />
      <BlockTwoMain height="100%" />
      <BlobTestWidget />
    </>
  );
}
