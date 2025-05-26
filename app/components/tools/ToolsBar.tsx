import React from "react";
import Image from "next/image";
import shapesIcon from "@/app/assets/icons/shapesIcon.png";
import {shapeOptions} from "@/app/shapes/Shapes"
import {componentMap} from "@/app/shapes/Shapes";
import {drawOptions} from "@/app/artBoard/util/draw";
import colorsIcon from "@/app/assets/icons/colorIcon.png";
import {colorOptions} from "@/app/artBoard/util/colors";
import sizeIcon from "@/app/assets/icons/sizeIcon.png";
import gridIcon from "@/app/assets/icons/gridIcon.png";


interface toolsBarProps {
    view:boolean,
    gridActive:boolean,
    setGridActive:(gridActive:boolean) => void,
    selected:number|null,
    setSelected: (selected:number|null) => void,
    selectedColor:string,
    setSelectedColor:(color:string)=>void,
    selectedSize:number,
    setSelectedSize:(selectedSize:number)=>void,
    afterResize:(newSize:number)=>void,
    afterRefill:(newColor:string)=>void

}

const ToolsBar:React.FC<toolsBarProps> = ({ view,gridActive, setGridActive, selected, setSelected, selectedColor, setSelectedColor, selectedSize, setSelectedSize, afterResize, afterRefill}) => {

    return (
        <div
            className={` ${ !view? `hidden` : `drawing-tools` }`}>
            <label className={'shape-title'}>
                <Image className="shapeIcon" src={shapesIcon} alt={'shapes'} width={20} height={20}/>
                Shapes</label>
            <section
                className={"shape-selection"}>

                <div className={"shape-container"}>
                    <div className={'shape-items'}>
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
                                        <ShapeComponent width={40} height={40}/>
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                </div>
                <div className={"draw-container"}>
                    <label className={'draw-title'}>Draw</label>
                    <div className={'draw-items'}>
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
            </section>
            <section className={"editor"}>
                <div className="colors-container">
                    <label>
                        <Image className="colorsIcon" src={colorsIcon} alt={'colors'} width={0} height={0}/>
                        Colors
                    </label>
                    <div className="colors">
                        {colorOptions.map((color) => (

                            <button
                                key={color}
                                className="color-button"
                                style={{
                                    backgroundColor: color,
                                    borderColor: selectedColor === color ? 'black' : 'transparent'
                                }}
                                onClick={
                                () => {
                                    afterRefill(color);
                                    setSelectedColor(color);
                                }
                            }
                            />
                        ))}
                    </div>
                </div>
                <div className='size'>
                    <label>
                        <Image className="sizeIcon" src={sizeIcon} alt='size' width={0} height={0}/>
                        Size</label>
                    <div className="size-container">
                        <input
                            type="range"
                            min={10}
                            max={1123}
                            step={1}
                            value={selectedSize}
                            onChange={(e) => {
                                afterResize(Number(e.target.value))
                                setSelectedSize(Number(e.target.value));
                            }
                            }
                            className="size-range"
                        />
                        <span className="text-sm">{selectedSize}px</span>
                    </div>
                </div>
                <div className="grid-switcher">
                    <div className="grid-label">
                        <Image className="grid-icon" src={gridIcon} alt="Grid" width={24} height={24}/>
                        <span>Grid</span>
                    </div>

                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={gridActive}
                            onChange={(e) => setGridActive(e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

            </section>

        </div>
    )
}
export default ToolsBar;