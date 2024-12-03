export default async function Page({
  params,
}: {
  params: Promise<{ path: string }>
}) {
  const path = decodeURIComponent((await params).path);
  return (
    <div className="p-4">
      <img src={path} alt="" />
    </div>
  );
}
