import Image from "next/image";
import log from './log.json';

export default function Home() {
  const list = log;
  const listView = list
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map(item => (
      <div className="mb-10" key={item.date}>
        <div className="mb-2">
          {item.msg}
          <time className="text-sm ml-2 opacity-70">{item.date}</time>
        </div>
        <div>
          {item.list?.map(pic => (
            <a href={`/detail/${encodeURIComponent(pic)}`}>
              <Image width={1000} height={180} className="inline-block" src={pic} key={pic} alt="" style={{ height: '180px', width: 'auto' }} />
            </a>
          ))}
        </div>
      </div>
    ));

  return (
    <div className="p-4">
      <div>{listView}</div>
    </div>
  );
}
