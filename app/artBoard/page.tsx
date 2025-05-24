'use client'
import React, {useEffect, useState} from 'react';
import {colorOptions} from "@/app/artBoard/util/colors";
import {shapeOptions} from "@/app/shapes/Shapes"
import homeIcon from "app/assets/icons/homeButton.png";
import Image from "next/image";
import Link from 'next/link';
import FileBar from "@/app/components/file/FileBar";
import ToolsBar from "@/app/components/tools/ToolsBar";
import Freeform from "@/app/components/spaceWork/freeform/Freeform";
import Grid from "@/app/components/spaceWork/grid/Grid";


type Shape = {
    x: number,
    y: number,
    componentKey:string,
    color: string,
    size: number,
    rotation?: number;
}


export default function ArtBoard() {
    const [gridActive , setGridActive] = useState<boolean>(false);
    const [fileOnView, setFileOnView] = useState<boolean>(false);
    const [toolsOnView, setToolsOnView] = useState<boolean>(false);
    const [selectedButton, setSelectedButton] = useState<'file' | 'tools' | null>(null);
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
            x, y, componentKey: selectedShape.componentKey, color: selectedColor, size:selectedSize, rotation: 0,
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
    /////////////

    function handleRotateStart(e: React.MouseEvent<HTMLDivElement>, index: number) {
        e.stopPropagation();
        const shape = shapes[index];
        const centerX = shape.x + shape.size / 2;
        const centerY = shape.y + shape.size / 2;

        const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        const initialRotation = shape.rotation || 0;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
            const delta = currentAngle - startAngle;

            setShapes((prevShapes) => {
                const updated = [...prevShapes];
                updated[index] = {
                    ...updated[index],
                    rotation: (initialRotation + delta) % 360,
                };
                return updated;
            });
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }
    ////////////////////

    const handleDownloadPDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const element = document.getElementById('print-section');
        if (!element) {
            alert("Kon het te exporteren element niet vinden.");
            return;
        }
        window.stop()


        const html2pdf = (await import('html2pdf.js')) ;

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
        <main className="main-page">
            <nav className='nav_bar'>
                <div className='bar_container'>
                    <Link href="/">
                        <Image src={homeIcon} alt="homeIcon" width={0} height={0}/>
                    </Link>
                    <button
                        className={selectedButton === 'file' ? 'bar_button selected' : 'bar_button'}
                        onClick={() => {

                            if (selectedButton === 'file') {
                                setSelectedButton(null);
                                setToolsOnView(false);
                                setFileOnView(false);
                            }else {
                                setSelectedButton('file');
                                setToolsOnView(false);
                                setFileOnView(true);
                            }
                        }}
                    >
                        File
                    </button>

                    <button
                        className={selectedButton === 'tools' ? 'bar_button selected' : 'bar_button'}
                        onClick={() => {

                            if (selectedButton === 'tools') {
                                setSelectedButton(null);
                                setFileOnView(false);
                                setToolsOnView(false);
                            }else{
                            setSelectedButton('tools');
                                setFileOnView(false);
                                setToolsOnView(true);
                            }
                        }
                        }
                    >
                        Tools
                    </button>
                </div>
            </nav>

            <article className='pag_container'>
                <nav className={`${!fileOnView&&!toolsOnView ? `hidden` : `side-bar ` }`}>

                    <FileBar view={fileOnView} handleDownloadPDF={handleDownloadPDF} handlePrint={handlePrint} handleClearAll={handleClearAll} handleUnset={handleUnset}/>
                    <ToolsBar view={toolsOnView} gridActive={gridActive} setGridActive={setGridActive} selected={selected} setSelected={setSelected} selectedColor={selectedColor} setSelectedColor={setSelectedColor} selectedSize={selectedSize} setSelectedSize={setSelectedSize}/>

                </nav>

                <section className="art-board">
                    { gridActive ?
                        <Grid selected={selected} setSelectedShapeIndex={setSelectedShapeIndex} shapes={shapes} handleDragStart={handleDragStart} handleResizeStart={handleResizeStart} handleTouchStart={handleTouchStart} handleAddShape={ handleAddShape} handleResizeTouchStart={handleResizeTouchStart} selectedShapeIndex={selectedShapeIndex} handleRotateStart={handleRotateStart}/>
                        :
                        <Freeform selected={selected} setSelectedShapeIndex={setSelectedShapeIndex} shapes={shapes} handleDragStart={handleDragStart} handleResizeStart={handleResizeStart} handleTouchStart={handleTouchStart} handleAddShape={ handleAddShape} handleResizeTouchStart={handleResizeTouchStart} selectedShapeIndex={selectedShapeIndex} handleRotateStart={handleRotateStart}/>
                    }
                </section>
            </article>

        </main>
    );
}