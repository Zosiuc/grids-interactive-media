import Image from "next/image";
import Link from "next/link";



export default function Home() {
  const imgs = [
    {url:"/SVG/Asset2.svg",name:"asset2"},
    {url:"/SVG/Asset3.svg",name:"asset3"},
    {url:"/SVG/Halfcircle.svg",name:"halfcircle"}
  ]

  return (
    <main className="flex justify-center flex-wrap p-6 m-20 gap-20 ">
      {imgs.map((img, index) => {
          return(
            <Link 
            key={index}
            href={`/artBoard/${img.name}`}
            className="flex justify-center w-auto h-60 rounded-4xl p-2 shadow-xl hover:scale-105 transition duration-400 my-special">
            
              <Image 
                src={img.url}
                alt="asdas"
                width={160}
                height={1800}
                className="flex  justify-center m-4"
                >
                </Image>
            </Link>
          )
      })}
      
      
    </main>
  );
}
