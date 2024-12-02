import Image from "next/image";

export default () => {
  return (
    <div>
      <Image src="/avatar.jpeg" width={64} height={64} alt="Next.js logo" />
      <div>YAMI</div>
    </div>
  );
};