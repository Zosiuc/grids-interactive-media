import React, {useEffect} from "react";
import {componentMap, shapeOptions} from "@/app/shapes/Shapes";
type Shape = {
    x: number,
    y: number,
    componentKey:string,
    color: string,
    size: number,
    rotation?: number;
}

interface GridState {
    shapes:Shape[],
    selectedColor:string,
    selectedSize:number,
    setShapes: (shapes: (prev: Shape[]) => Shape[]) => void,
    handleDragStart:(e:React.MouseEvent<HTMLDivElement>, index:number)=>void,
    handleTouchStart:(e:React.TouchEvent<HTMLDivElement>, index:number)=>void,
    selected:number|null,
    selectedShapeIndex:number|null,
    setSelectedShapeIndex:(selectedShapeIndex:number)=>void,
    handleResizeStart:(e:React.MouseEvent<HTMLDivElement>, index:number)=>void,
    handleResizeTouchStart:(e:React.TouchEvent<HTMLDivElement>, index:number)=>void,
    handleRotateStart:(e:React.MouseEvent<HTMLDivElement>, index:number)=>void,
    setDraggingIndex:(draggingIndex:number|null)=>void,
    draggingIndex:number|null,
    dragOffset:{x:number, y:number},
}
const snapToGrid = (x: number, y: number, gridSize: number = 20) => {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return { x: snappedX, y: snappedY };
};

// Controle of x en y een exact kruispunt zijn op het grid
const isValidGridPoint = (x: number, y: number, gridSize: number = 20) => {
    return x % gridSize === 0 && y % gridSize === 0;
};

const Grid:React.FC<GridState> = ({setDraggingIndex,draggingIndex,dragOffset, shapes,selectedColor, selectedSize, setShapes, handleResizeTouchStart, handleResizeStart, handleTouchStart, selectedShapeIndex, setSelectedShapeIndex, handleDragStart, selected,handleRotateStart}) => {

    const [hoverCoords, setHoverCoords] = React.useState<{x: number, y: number} | null>(null);


    const handleAddShape = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (selected === null) return alert("Selecteer een vorm eerst");

        const rect = e.currentTarget.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        const { x, y } = snapToGrid(rawX, rawY);

        if (!isValidGridPoint(x, y)) return alert("Klik op een grid-kruispunt");

        const selectedShape = shapeOptions.find((s) => s.id === selected);
        if (!selectedShape) return;

        setShapes((prev) => [
            ...prev,
            {
                x,
                y,
                componentKey: selectedShape.componentKey,
                color: selectedColor,
                size: selectedSize,
                rotation: 0,
            },
        ]);
    };

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


        const handleMouseUp = () => {
            if (draggingIndex === null) return;

            setShapes((prev) =>
                prev.map((shape, idx) => {
                    if (idx !== draggingIndex) return shape;

                    const { x, y } = snapToGrid(shape.x, shape.y);
                    return { ...shape, x, y };
                })
            );

            setDraggingIndex(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingIndex, dragOffset, setShapes]);



    return (
        <div id={"print-section"} className="page work-space   relative  bg-white overflow-clip rounded-md shadow-lg"
             style={{
                 width: '8.27in',
                 height: '11.69in',
                 position: 'relative',
                 backgroundColor: 'white',
                 overflow: 'hidden',
             }}
             onMouseDown={handleAddShape}
             onMouseMove={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const rawX = e.clientX - rect.left;
                 const rawY = e.clientY - rect.top;
                 const {x, y} = snapToGrid(rawX, rawY);
                 setHoverCoords({x, y});
             }}
             onMouseLeave={() => setHoverCoords(null)}
        >

            {shapes.map((shape, index) => {
                const ShapeComponent = componentMap[shape.componentKey];

                return (
                    <div
                        key={index}
                        id={"shape"}
                        className="absolute group z-10 "
                        style={{
                            width: shape.size,
                            height: shape.size,
                            top: shape.y - (shape.size / 2),
                            left: shape.x - (shape.size / 2),
                            color: shape.color,
                            fill: shape.color,
                            cursor: "pointer",
                            transform: `rotate(${shape.rotation || 0}deg)`,
                            transformOrigin: 'center',

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



                        <ShapeComponent/>

                        {selectedShapeIndex === index && (
                            <>
                                <div
                                    className="absolute bg-blue-200  drop-shadow-xl opacity-25 bottom-0 right-0  cursor-se-resize "
                                    style={{
                                        width: shape.size,
                                        height: shape.size,
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleResizeStart(e, index)

                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        handleResizeTouchStart(e, index);
                                    }}
                                />
                                <div
                                    className="rotate-handle"
                                    onMouseDown={(e) => handleRotateStart(e, index)}
                                    style={{
                                        position: 'absolute',
                                        top: -10,
                                        left: -10,
                                        transform: 'translateX(-50%)',
                                        width: shape.size / 4,
                                        height: shape.size / 4,
                                        backgroundColor: "gray",
                                        opacity:"75%",
                                        borderRadius: "45px 45px 0 45px ",
                                        cursor: 'grab',
                                    }}>

                                </div>

                            </>

                        )}
                    </div>
                );
            })}
            <svg id={"grids"} className="grid-overlay absolute top-0 left-0 w-full h-full pointer-events-none"
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="lightgray" strokeWidth="0.9"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)"/>

                {hoverCoords && (
                    <>
                        <line
                            x1={hoverCoords.x}
                            y1={0}
                            x2={hoverCoords.x}
                            y2="100%"
                            stroke="black"
                            strokeOpacity={"35%"}
                            strokeWidth="1"
                        />
                        <line
                            x1={0}
                            y1={hoverCoords.y}
                            x2="100%"
                            y2={hoverCoords.y}
                            stroke="black"
                            strokeOpacity={"35%"}
                            strokeWidth="1"
                        />
                    </>
                )}
            </svg>
            {hoverCoords && (
                <div
                    className="absolute text-xs bg-black text-white px-2 py-1 opacity-75 rounded pointer-events-none"
                    style={{
                        top: hoverCoords.y + 5,
                        left: hoverCoords.x + 5,
                    }}
                >
                    x: {hoverCoords.x}, y: {hoverCoords.y}
                </div>
            )}



        </div>
    )
}
export default Grid;