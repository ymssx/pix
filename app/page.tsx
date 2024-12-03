import Image from "next/image";
import log from './log.json';

export default function Home() {
  const list = log;
  const listView = list
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map(item => (
      <div key={item.date}>
        <div className="mt-10 mb-2">
          {item.msg}
          <time className="text-sm ml-2 opacity-70">{item.date}</time>
        </div>
        <div>
          {item.list?.map(pic => (
            <a href={`/detail/${encodeURIComponent(pic)}`}>
              <img className="inline-block" src={pic} key={pic} alt="" style={{ height: '180px' }} />
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
