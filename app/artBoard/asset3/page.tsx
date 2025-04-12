import Image from "next/image";


export default function Asset3() {
  return (
    <main className="flex justify-center flex-wrap p-6 m-20 gap-20 w-full">
      <div className="flex justify-center w-auto h-60 rounded-4xl p-2 shadow-xl hover:scale-105 transition duration-400 my-special">
        <Image 
        src="/SVG/Asset3.svg"
        alt="asdas"
        width={400}
        height={400}
        className="flex justify-center m-4"
        >
        </Image>
      </div>  
    </main>
  );
}
