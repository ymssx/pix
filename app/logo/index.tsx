import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex gap-2">
      <Image src="/avatar.jpeg" width={64} height={64} alt="YAMI" />
      <div>YAMI</div>
    </div>
  );
};
