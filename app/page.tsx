'use client'
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    const imgs = [
        { url: "/SVG/Asset2.svg", name: "asset2", x:219 ,y:2},
        { url: "/SVG/Asset3.svg", name: "asset3", x:-190 ,y:90},
        { url: "/SVG/Halfcircle.svg", name: "halfcircle",x:-80 ,y:90}
    ];

    return (
        <main className="flex justify-center flex-wrap p-6 m-20 gap-20 relative">
            <Link
                href="./artBoard"
                className="absolute mt-70 border w-60 text-center p-6 bg-white text-gray-900 z-20 hover:bg-blue-400 hover:scale-105 transport duration-900"
            >New Board</Link>

            <Link
                href="./artBoard"
                className="absolute mt-90 w-60 text-center border p-6 bg-white text-gray-900 z-20 hover:bg-blue-400  hover:scale-105 transport duration-900"
            >load a Board</Link>

            <button/>
            {imgs.map((img, index) => {
                // random values per kaart
                const offsetX = Math.floor(Math.random() * 90) ;
                const offsetY = Math.floor(Math.random() ) ;
                const duration = Math.random() * 40 + 40; // tussen 40-80 sec

                return (
                    <motion.div
                        key={img.name}
                        animate={{
                            y: [img.y,-offsetY, offsetY, img.y],
                            x: [img.x, -offsetX, offsetX, img.x],
                        }}
                        whileHover={{ scale: 1.8 }}
                        transition={{
                            duration: duration-18,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className="flex justify-center w-auto h-60 rounded-4xl opacity-45 p-2 shadow-xl my-special "
                        >
                            <Image
                                src={img.url}
                                alt={img.name}
                                width={160}
                                height={180}
                                className="m-4"
                            />
                        </div>
                    </motion.div>
                );
            })}
        </main>
    );
}
