import React, {useEffect} from "react";
import {componentMap} from "@/app/shapes/Shapes";
type Shape = {
    x: number,
    y: number,
    componentKey:string,
    color: string,
    size: number,
    rotation?: number;
}

interface FreeformState {
    handleAddShape:(e: React.MouseEvent<HTMLDivElement, MouseEvent> )=>void,
    shapes:Shape[],
    handleDragStart:(e:React.MouseEvent<HTMLDivElement>, index:number)=>void,
    handleTouchStart:(e:React.TouchEvent<HTMLDivElement>, index:number)=>void,
    selected:number|null,
    selectedShapeIndex:number|null,
    setSelectedShapeIndex:(selectedShapeIndex:number)=>void,
    handleResizeStart:(e:React.MouseEvent<HTMLDivElement>, index:number)=>void,
    handleResizeTouchStart:(e:React.TouchEvent<HTMLDivElement>, index:number)=>void,
    handleRotateStart:(e:React.MouseEvent<HTMLDivElement>, index:number)=>void,
    draggingIndex:number|null,
    setShapes:(shapes: (prev: Shape[]) => Shape[]) => void,
    dragOffset:{x:number,y:number},
    setDraggingIndex:(draggingIndex:number|null)=>void
}


const Freeform:React.FC<FreeformState> = ({draggingIndex,setShapes,dragOffset,setDraggingIndex,handleAddShape, shapes, handleResizeTouchStart, handleResizeStart, handleTouchStart, selectedShapeIndex, setSelectedShapeIndex, handleDragStart, selected,handleRotateStart}) => {

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
    return (
        <div id={"print-section"} className="page work-space relative  bg-white overflow-clip rounded-md shadow-lg"
             onMouseDown={handleAddShape}>
            {/* Canvas achtergrond */}


            {/* Alle geplaatste shapes */}

            {shapes.map((shape, index) => {
                const ShapeComponent = componentMap[shape.componentKey];

                return (
                    <div
                        key={index}
                        className="absolute group shape"
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
                        <div
                            className="rotate-handle"
                            onMouseDown={(e) => handleRotateStart(e, index)}
                            style={{
                                position: 'absolute',
                                top: -2,
                                left: 8,
                                transform: 'translateX(-50%)',
                                width: shape.size / 4,
                                height: shape.size / 4,
                                cursor: 'grab',
                            }}>

                        </div>
                        <div
                            className="rotate-handle"
                            onMouseDown={(e) => handleRotateStart(e, index)}
                            style={{
                                position: 'absolute',
                                top: -2,
                                right: -8,
                                transform: 'translateX(-50%)',
                                width: shape.size / 4,
                                height: shape.size / 4,
                                cursor: 'grab',
                            }}>

                        </div>
                        <div
                            className="rotate-handle"
                            onMouseDown={(e) => handleRotateStart(e, index)}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                transform: 'translateX(-50%)',
                                width: shape.size / 4,
                                height: shape.size / 4,
                                cursor: 'grab',
                            }}>

                        </div>
                        <div
                            className="rotate-handle"
                            onMouseDown={(e) => handleRotateStart(e, index)}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: -10,
                                transform: 'translateX(-50%)',
                                width: shape.size / 4,
                                height: shape.size / 4,
                                cursor: 'grab',
                            }}>

                        </div>


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

                            </>

                        )}
                    </div>
                );
            })}
        </div>
    )
}
export default Freeform;