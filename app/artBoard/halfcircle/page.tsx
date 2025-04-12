import Image from "next/image";


export default function Halfcircle() {
  return (
    <main className="flex justify-center flex-wrap p-6 m-20 gap-20 w-full">
      <div className="flex justify-center w-auto h-60 rounded-4xl p-2 shadow-xl hover:scale-105 transition duration-400 my-special">
        <Image 
        src="/SVG/Halfcircle.svg"
        alt="asdas"
        width={300}
        height={300}
        className="flex justify-center m-4"
        >
        </Image>
      </div>  
    </main>
  );
}
