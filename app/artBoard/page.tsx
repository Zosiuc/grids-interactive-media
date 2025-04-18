'use client'
import React, {useEffect, useState} from 'react';
import {componentMap} from "@/app/shapes/Shapes";

type Shape = {
    x: number,
    y: number,
    width: number,
    height: number,
    componentKey:string,
    color: string,
    size: number
}

const shapeOptions: {
    id: number;
    componentKey: string;
}[] = [
    {id: 1, componentKey: "Asset2"},
    {id: 2, componentKey: "Asset3"},
    {id: 3, componentKey: "HalfCircle"},
    {id: 4, componentKey: "Circle"},
    {id: 5, componentKey: "Vierkant"},
    {id: 6, componentKey: "Driehoek"},
    {id: 7, componentKey: "Ruitvorm"},
    {id: 8, componentKey: "HalveCirkelOnderkant"},
    {id: 9, componentKey: "Trapezium"},
    {id: 10, componentKey: "Ster"}

];

const colorOptions = ['#000000', '#ffffff', '#FF5733', '#2ECC71', '#3498DB', '#F39C12'];
const terugIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 25"
         stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 10h11a4 4 0 0 1 0 8h-1M3 10l4 4m-4-4l4-4"/>
    </svg>
)

export default function ArtBoard() {

    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedSize, setSelectedSize] = useState<number>(40);
    const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);

    const [selected, setSelected] = useState<number | null>(null);

    const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);

    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({x: 20, y: 20});

    const handleAddShape = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (selected === null) return alert("Please select a shape")

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left - 20
        const y = e.clientY - rect.top - 10

        const selectedShape = shapeOptions.find((s) => s.id === selected)
        if (!selectedShape) return

        setShapes((prev) => [...prev, {
            x, y, width: 40,
            height: 40, componentKey: selectedShape.componentKey, color: selectedColor, size: selectedSize
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

    function handleSideResizeStart(
        e: React.MouseEvent<HTMLDivElement>,
        index: number,
        side: 'left' | 'right' | 'top' | 'bottom'
    ) {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const shape = shapes[index];

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            setShapes((prevShapes) => {
                const updated = [...prevShapes];
                const current = {...updated[index]};

                if (side === 'right') {
                    current.width = Math.max(10, shape.width + deltaX);
                } else if (side === 'left') {
                    const newWidth = Math.max(10, shape.width - deltaX);
                    if (newWidth !== shape.width) {
                        current.width = newWidth;
                        current.x = shape.x + deltaX;
                    }
                } else if (side === 'bottom') {
                    current.height = Math.max(10, shape.height + deltaY);
                } else if (side === 'top') {
                    const newHeight = Math.max(10, shape.height - deltaY);
                    if (newHeight !== shape.height) {
                        current.height = newHeight;
                        current.y = shape.y + deltaY;
                    }
                }

                updated[index] = current;
                return updated;
            });
            localStorage.setItem('canvasShapes', JSON.stringify(shapes));
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleResizeStart(e: React.MouseEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startSize = shapes[index].size;

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

    function handleDragStart(e: React.MouseEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        console.log(rect);
        const offsetX = e.clientX - rect.left - rect.width ;
        console.log(offsetX);
        const offsetY = e.clientY - rect.top - rect.bottom ;
        console.log(offsetY)

        setDraggingIndex(index);
        setDragOffset({x: offsetX, y: offsetY});
    }

    function handlePrint() {
        console.log("3")
    }


    useEffect(() => {


        const handleMouseMove = (e: MouseEvent) => {
            if (draggingIndex === null) return;

            setShapes((prev) => {
                const updated = [...prev];
                updated[draggingIndex] = {
                    ...updated[draggingIndex],
                    x: e.clientX - dragOffset.x + 900 ,
                    y: e.clientY - dragOffset.y ,
                };
                return updated;
            });
        };

        const handleMouseUp = (e:MouseEvent) => {
            e.stopPropagation();
            setDraggingIndex(null);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
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
                className="fixed top-2 w-full left-0 flex justify-center p-2 w-210 gap-2 z-200 rounded-md my-special shadow-lg">
                <div
                    className="flex flex-wrap flex-row gap-x-15 justify-center items-center rounded-lg bg-amber-200 p-2 px-6 shadow-md hover:shadow-lg">
                    <label className={'text-xs font-semibold'}>Select Shape</label>
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
                    <div className="flex gap-2 h-4 items-center">
                        <input
                            type="range"
                            min={20}
                            max={200}
                            step={5}
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(Number(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm">{selectedSize}px</span>
                    </div>
                    <div className="flex gap-2">
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
                </div>

                <div
                    className="flex flex-wrap flex-col gap-2 justify-center items-center rounded-lg bg-amber-200 p-2 px-6 shadow-md hover:shadow-lg">
                    <label className={'text-xs font-semibold'}>Tools</label>
                    <div
                        className={'flex flex-wrap flex-row gap-2'}>
                        <button
                            className="flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-200 rounded-full p-2 h-8 bg-cyan-100 bg-opacity-25"
                            type="button"
                            onClick={handleClearAll}>New sessie


                        </button>
                        <button
                            className="flex text-sm items-center cursor-pointer hover:scale-108 hover:bg-gray-200 rounded-full p-2 h-8 bg-cyan-100 bg-opacity-25"
                            type="button"
                            onClick={handleUnset}>{terugIcon}


                        </button>
                        <button
                            className="text-sm rounded-full p-2 h-8 bg-cyan-100 cursor-pointer hover:scale-108 hover:bg-gray-200 "
                            type="button" onClick={handlePrint}>Print
                        </button>
                    </div>
                </div>
            </nav>

            <section className="flex flex-col gap-2 mt-20">

                <div className="relative w-[794px] h-[1123px] bg-white overflow-clip rounded-md shadow-lg"
                     onClick={handleAddShape}>
                    {/* Canvas achtergrond */}
                    <div className="absolute text-red-500 inset-0 z-0"/>

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
                                onMouseDown={(e) => handleDragStart(e, index)}
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
                                            className="absolute w-full h-full  bg-blue-200 opacity-35 top-0 left-0  cursor-se-resize "
                                            onMouseDown={(e) => handleResizeStart(e, index)}/>
                                        <>
                                            {/* Rechts */}
                                            <div
                                                className="absolute w-2 h-full right-0 top-0 cursor-e-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'right')}/>
                                            {/* Links */}
                                            <div
                                                className="absolute w-2 h-full left-0 top-0 cursor-w-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'left')}/>
                                            {/* Onder */}
                                            <div
                                                className="absolute h-2 w-full bottom-0 left-0 cursor-s-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'bottom')}/>
                                            {/* Boven */}
                                            <div
                                                className="absolute h-2 w-full top-0 left-0 cursor-n-resize z-10"
                                                onMouseDown={(e) => handleSideResizeStart(e, index, 'top')}/>
                                        </>
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