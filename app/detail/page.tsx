import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams<{ path: string }>();
  const path = decodeURIComponent(params.path);
  return (
    <div className="p-4">
      <img src={path} alt="" />
    </div>
  );
}
