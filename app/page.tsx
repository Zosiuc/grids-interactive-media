'use client'
import './globals.css'
import Link from "next/link";
import { motion } from "framer-motion";
import Asset2 from 'app/shapes/SVG/Asset2.svg';
import Asset3 from 'app/shapes/SVG/Asset3.svg';
import HalfCircle from 'app/shapes/SVG/Halfcircle.svg';
import Circle from 'app/shapes/SVG/Circle.svg';
import Vierkant from 'app/shapes/SVG/Vierkant.svg';
import Driehoek from 'app/shapes/SVG/Driehoek.svg';
import Ruitvorm from 'app/shapes/SVG/Ruitvorm.svg';
import HalveCirkelOnderkant from 'app/shapes/SVG/Halve-cirkel-onderkant.svg';
import Trapezium from 'app/shapes/SVG/Trapezium.svg';
import React, {useEffect} from "react";


export default function Home() {
    const imgs = [
        { Component: Asset2, name: "asset2", x:219 ,y:2},
        { Component: Asset3, name: "asset3", x:-190 ,y:90},
        { Component: HalfCircle, name: "halfcircle",x:-80 ,y:90},
        { Component: Circle, name:"Circle" ,x:20 ,y: 109},
        { Component: Vierkant, name:"Vierkant" ,x: 324,y:30 },
        { Component: Driehoek, name: "Driehoek",x: 324,y:-34 },
        { Component: Ruitvorm, name:"Ruitvorm" ,x:-40 ,y: 21},
        { Component: HalveCirkelOnderkant, name:"HalveCirkelOnderkant" ,x:40 ,y:-203 },
        { Component: Trapezium, name:"Trapezium" ,x:-30 ,y:-190 }
    ];
    const [hasCanvas, setHasCanvas] = React.useState(false);

    function hendelNew() {
        localStorage.removeItem("canvasShapes")
    }
    useEffect(() => {
        const storedShapes = localStorage.getItem("canvasShapes");
        if (storedShapes) setHasCanvas(true);
    }, [])

    return (
        <main className="flex justify-between max-w-screen flex-wrap p-6 m-20 gap-20 relative">
            <div className="flex justify-center  w-full">
            <Link
                href="./artBoard"
                onClick={() => {hendelNew()}}
                className="absolute mt-70 border w-80 text-center rounded-full font-semibold p-6 bg-white text-gray-900 z-20 hover:bg-blue-400 hover:scale-105 transport duration-900"
            >New Board</Link>
                {hasCanvas && (
                    <Link
                        href="./artBoard"
                        className="absolute mt-90 w-70 text-center rounded-full border p-6 bg-white text-gray-800 z-20 hover:bg-blue-400  hover:scale-105 transport duration-900"
                    >Resume</Link>
                )}

            </div>
            {imgs.map((img, index) => {
                // random values per kaart
                const offsetX = Math.floor(Math.random() * 90 + index) ;
                const offsetY = Math.floor(Math.random() + index ) ;
                const duration = Math.random() * 40 + 40; // tussen 40-80 sec

                return (
                    <motion.div
                        key={img.name}
                        animate={{
                            y: [img.y-offsetY, 100, offsetY, img.y],
                            x: [img.x, -offsetX,30, offsetX, img.x],
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
                            {imgs.map((img, index) => {
                                const ShapeComponent = img.Component;
                                return (
                                    <div
                                        key={index}
                                        className="absolute group w-50"
                                        style={{
                                            top: img.y,
                                            left: img.x,
                                            color: "red",
                                            fill: "green"
                                        }}
                                    >
                                    <ShapeComponent/>
                                </div>
                                )
                            })}
                        </div>
                    </motion.div>
                );
            })}
        </main>
    );
}
