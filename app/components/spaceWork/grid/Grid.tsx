import React from "react";
import {componentMap} from "@/app/shapes/Shapes";
import Image from "next/image";
import rotateIcon from "@/app/assets/icons/unset.png";
type Shape = {
    x: number,
    y: number,
    componentKey:string,
    color: string,
    size: number,
    rotation?: number;
}

interface GridState {
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
}


const Grid:React.FC<GridState> = ({handleAddShape, shapes, handleResizeTouchStart, handleResizeStart, handleTouchStart, selectedShapeIndex, setSelectedShapeIndex, handleDragStart, selected,handleRotateStart}) => {

    return (
        <div id={"print-section"} className="page work-space   relative  bg-white overflow-clip rounded-md shadow-lg"
             onClick={handleAddShape}>

            {shapes.map((shape, index) => {
                const ShapeComponent = componentMap[shape.componentKey];

                return (
                    <div
                        key={index}
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
            <svg className="grid-overlay" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="lightgray" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)"/>
            </svg>


        </div>
    )
}
export default Grid;