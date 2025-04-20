'use client'
import React, {useEffect, useState} from 'react';
import {colorOptions} from "@/app/artBoard/util/colors";
import {shapeOptions} from "@/app/shapes/Shapes"
import {componentMap} from "@/app/shapes/Shapes";
import {drawOptions} from "@/app/artBoard/util/draw";

import terugIcon from "app/assets/icons/unset.png"
import homeIcon from "app/assets/icons/home.png"
import printIcon from "app/assets/icons/print.png"
import exportPdf from "app/assets/icons/export-pdf-512.webp"
import resetIcon from "app/assets/icons/trash.png"

import Image from "next/image";
import {redirect} from "next/navigation";

type Shape = {
    x: number,
    y: number,
    componentKey:string,
    color: string,
    size: number,
}


export default function ArtBoard() {

    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedSize, setSelectedSize] = useState< number>(40);
    const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);

    const [selected, setSelected] = useState<number | null>(null);

    const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);

    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({x: 20, y: 20});

    const handleAddShape = (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        if (selected === null) return alert("Please select a shape")

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const selectedShape = shapeOptions.find((s) => s.id === selected)
        if (!selectedShape) return;

        setShapes((prev) => [...prev, {
            x, y, componentKey: selectedShape.componentKey, color: selectedColor, size:selectedSize
        }]);
        localStorage.setItem('canvasShapes', JSON.stringify(shapes));
    }

    function handleUnset() {
        setShapes((prev) => prev.slice(0, -1));
        localStorage.setItem('canvasShapes', JSON.stringify(shapes));
    }

    function handleClearAll() {
        setShapes([]);
        localStorage.removeItem('canvasShapes');
    }



    function handleResizeStart(e: React.MouseEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();
        const startSize = shapes[index].size;
        const startX = e.clientX;
        const startY = e.clientY;


        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = Math.max(
                moveEvent.clientX - startX,
                moveEvent.clientY - startY
            );
            setShapes((prevShapes) => {
                const updated = [...prevShapes];
                updated[index] = {
                    ...updated[index],
                    size: Math.max(10, startSize + delta), // minimum size

                };
                return updated;
            });
            //localStorage.setItem('canvasShapes', JSON.stringify(shapes));
        };

        const handleMouseUp = () => {
            setSelectedShapeIndex(null);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }
    function handleResizeTouchStart(e: React.TouchEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();
        const touch = e.touches[0];
        const startSize = shapes[index].size;
        const startX = touch.clientX;
        const startY = touch.clientY;


        const handleTouchMove = (touchEvent: TouchEvent) => {
            const touch = touchEvent.touches[0];
            const delta = Math.max(
                touch.clientX - startX,
                touch.clientY - startY
            );
            setShapes((prevShapes) => {
                const updated = [...prevShapes];
                updated[index] = {
                    ...updated[index],
                    size: Math.max(10, startSize + delta), // minimum size

                };
                return updated;
            });
            //localStorage.setItem('canvasShapes', JSON.stringify(shapes));
        };

        const handleTouchEnd = () => {
            setSelectedShapeIndex(null);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };

        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);
    }

    ////////////////////////////////////
    function handleDragStart(e: React.MouseEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();
        const shape = shapes[index];
        const offsetX = e.clientX - shape.x;
        const offsetY = e.clientY - shape.y;

        setDragOffset({ x: offsetX, y: offsetY });
        setDraggingIndex(index);
    }
    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();
        const touch = e.touches[0];
        const shape = shapes[index];
        const offsetX = touch.clientX - shape.x;
        const offsetY = touch.clientY - shape.y;

        setDragOffset({ x: offsetX, y: offsetY });
        setDraggingIndex(index);
    }

    const handleDownloadPDF = async () => {
        const element = document.getElementById('print-section');
        if (!element) {
            alert("Kon het te exporteren element niet vinden.");
            return;
        }

        const html2pdf = (await import('html2pdf.js')) as any;

        const opt = {
            margin:       0,
            filename:     'boruil.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true // belangrijk voor afbeeldingen
            },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf.default().set(opt).from(element).save();
    };


    function handlePrint() {
        window.print();
    }


    useEffect(() => {


        const handleMouseMove = (e: MouseEvent) => {
            if (draggingIndex === null) return;

            setShapes((prev) => {
                const updated = [...prev];
                updated[draggingIndex] = {
                    ...updated[draggingIndex],
                    x: e.clientX - dragOffset.x ,
                    y: e.clientY - dragOffset.y ,
                };
                return updated;
            });
        };

        const handleMouseUp = (e:MouseEvent) => {
            e.stopPropagation();
            setDraggingIndex(null);
        };
        /////////////////////////////

        const handleTouchMove = (e: TouchEvent) => {
            if (draggingIndex === null) return;
            const touch = e.touches[0];

            setShapes((prev) => {
                const updated = [...prev];
                updated[draggingIndex] = {
                    ...updated[draggingIndex],
                    x: touch.clientX - dragOffset.x,
                    y: touch.clientY - dragOffset.y,
                };
                return updated;
            });
        };

        const handleTouchEnd = () => {
            setDraggingIndex(null);
        };


        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [draggingIndex, dragOffset]);

    useEffect(() => {
        const storedShapes = localStorage.getItem("canvasShapes");
        if(!storedShapes) return;
        const parsedShapes = JSON.parse(storedShapes);
        setShapes(parsedShapes)

    }, [])


    return (
        <main className="flex justify-center flex-wrap p-6 m-20 gap-20 w-full">

            <nav
                className="fixed top-2 w-full left-0 flex justify-center p-2  gap-2 z-200 rounded-md my-special shadow-lg">
                <div
                    className="flex flex-wrap flex-col  gap-2 justify-center items-center rounded-lg bg-amber-200 p-2 px-6 shadow-md hover:shadow-lg">
                    <label className={'text-xs font-semibold'}>Tools</label>
                    <div
                        className={'flex flex-wrap flex-row min-w-20 gap-2'}>

                        <button
                            className="flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-300 rounded-full p-2 h-8  hover:opacity-25"
                            type="button"
                            onClick={() => redirect(".")}>
                            <Image src={homeIcon} alt={"home"} width={20} height={20}/>
                        </button>
                        <button
                            className="print-button flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-300 rounded-full p-2 h-8  hover:opacity-25"
                            type="button" onClick={handleDownloadPDF}>
                            <Image src={exportPdf} alt={"print"} width={20} height={20}/>
                        </button>
                        <button
                            className="print-button flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-300 rounded-full p-2 h-8  hover:opacity-25"
                            type="button" onClick={handlePrint}>
                            <Image src={printIcon} alt={"print"} width={20} height={20}/>
                        </button>
                        <button
                            className="flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-300 rounded-full p-2 h-8  hover:opacity-25"
                            type="button"
                            onClick={handleClearAll}>
                            <Image src={resetIcon} alt={"reset"} width={20} height={20}/>
                        </button>
                        <button
                            className="flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-300 rounded-full p-2 h-8  hover:opacity-25"
                            type="button"
                            onClick={handleUnset}>
                            <Image src={terugIcon} alt={"unset"} width={20} height={20}/>
                        </button>
                    </div>
                </div>

                <div
                    className="flex flex-wrap flex-row gap-5 justify-center items-center rounded-lg bg-amber-200 p-2 px-6 shadow-md hover:shadow-lg">
                    <section
                        className={"flex flex-row gap-3 w-full"}>
                        <div className={"flex flex-col bg-amber-100 p-2  rounded-md shadow-lg"}>
                            <label className={'text-xs font-semibold'}>Shape</label>
                            <div className={'flex flex-wrap flex-row w-full gap-2'}>
                                {shapeOptions.map((option, index) => {
                                    const ShapeComponent = componentMap[option.componentKey];
                                    return (
                                        <label key={option.id}
                                               className={`cursor-pointer transition-all ${selected === option.id ? 'ring-1  ring-blue-500' : 'ring-2 ring-transparent '} rounded-xl p-1`}>
                                            <input
                                                type="radio"
                                                name="shape"
                                                value={option.id}
                                                onChange={() => setSelected(option.id)}
                                                className="hidden"
                                            />
                                            <div
                                                key={index}
                                                style={{fill: selectedColor, color: selectedColor}}
                                            >
                                                <ShapeComponent width={20} height={20}/>
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={"flex flex-col bg-amber-100 p-2  rounded-md shadow-lg"}>
                            <label className={'text-xs font-semibold'}>Draw</label>
                            <div className={" "}>
                                <div className={'flex flex-wrap flex-row w-full gap-2'}>
                                    {drawOptions.map((option, index) => {
                                        return (
                                            <label key={option.id}
                                                   className={`cursor-pointer transition-all ${selected === option.id ? 'ring-1  ring-blue-500' : 'ring-2 ring-transparent '} rounded-xl p-1`}>
                                                <input
                                                    type="radio"
                                                    name="shape"
                                                    value={option.id}
                                                    onChange={() => setSelected(option.id)}
                                                    className="hidden"
                                                />
                                                <div
                                                    key={index}
                                                >
                                                    ... soon
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className={"flex flex-row gap-12 w-full"}>
                        <div className="flex  gap-2 h-4 items-center">
                            <input
                                type="range"
                                min={20}
                                max={200}
                                step={5}
                                value={selectedSize}
                                onChange={(e) => {
                                    setSelectedSize(Number(e.target.value));
                                }
                                }
                                className="w-32"
                            />
                            <span className="text-sm">{selectedSize}px</span>
                        </div>
                        <div className="flex gap-3 h-4 items-center">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    className="w-6 h-6 rounded-full border-2"
                                    style={{
                                        backgroundColor: color,
                                        borderColor: selectedColor === color ? 'black' : 'transparent'
                                    }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </section>

                </div>

            </nav>

            <section className="flex flex-col gap-2 mt-30 justify-center items-center rounded-md shadow-lg">

                <div id={"print-section"} className="page relative w-[794px] h-[1123px] bg-white overflow-clip rounded-md shadow-lg"
                     onClick={handleAddShape}>
                    {/* Canvas achtergrond */}


                    {/* Alle geplaatste shapes */}

                    {shapes.map((shape, index) => {
                        const ShapeComponent = componentMap[shape.componentKey];

                        return (
                            <div
                                key={index}
                                className="absolute group"
                                style={{
                                    top: shape.y,
                                    left: shape.x,
                                    color: shape.color,
                                    fill: shape.color,
                                    cursor: "pointer",

                                }}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleDragStart(e, index);
                                }}


                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    handleTouchStart(e, index);
                                }}
                                onClick={(e) => {
                                    if (selected) {
                                        e.stopPropagation();
                                        setSelectedShapeIndex(index);
                                    }

                                }}
                            >
                                <ShapeComponent width={shape.size} height={shape.size}/>

                                {selectedShapeIndex === index && (
                                    <>
                                        <div
                                            className="absolute bg-blue-200 w-full h-full drop-shadow-xl opacity-25 bottom-0 right-0  cursor-se-resize "
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                                handleResizeStart(e, index)

                                            }}
                                            onTouchStart={(e) => {
                                                e.stopPropagation();
                                                handleResizeTouchStart(e, index);
                                            }}
                                        />
                                       {/* <>
                                             Rechts
                                            <div
                                                className="absolute w-2 h-full right-0 top-0 cursor-e-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'right')}/>
                                             Links
                                            <div
                                                className="absolute w-2 h-full left-0 top-0 cursor-w-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'left')}/>
                                             Onder
                                            <div
                                                className="absolute h-2 w-full bottom-0 left-0 cursor-s-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'bottom')}/>
                                             Boven
                                            <div
                                                className="absolute h-2 w-full top-0 left-0 cursor-n-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'top')}/>
                                        </>*/}
                                    </>

                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}