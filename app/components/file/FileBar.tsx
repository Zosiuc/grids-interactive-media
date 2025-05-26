import Image from "next/image";
import exportPdf from "@/app/assets/icons/export-pdf-512.webp";
import printIcon from "@/app/assets/icons/print.png";
import resetIcon from "@/app/assets/icons/reset.png";
import terugIcon from "@/app/assets/icons/unset.png";
import deleteIcon from "@/app/assets/icons/trash.png";

import React from "react";

interface fileBarProps {
    view:boolean,
    selectedShapeIndex:number|null,
    handleDownloadPDF:(e: React.MouseEvent<HTMLButtonElement>) =>void,
    handlePrint:() =>void,
    handleClearAll:() =>void,
    handleUnset:() =>void,
    handleDelete:()=>void
}

const FileBar:React.FC<fileBarProps> = ({view,selectedShapeIndex, handleDownloadPDF, handlePrint, handleUnset, handleClearAll,handleDelete}) => {


    return (
        <div
            className={` ${!view ? `hidden` : `file-section`} `}>
            <div
                className={'file-container'}>

                <button
                    className="file-button"
                    type="button" onClick={ e => handleDownloadPDF(e)}>
                    <Image src={exportPdf} alt={"print"} width={20} height={20}/>
                    <strong>Export as PDF</strong>
                </button>
                <button
                    className="file-button print-button"
                    type="button" onClick={handlePrint}>
                    <Image src={printIcon} alt={"print"} width={20} height={20}/>
                    <strong>Print</strong>
                </button>
                <button
                    className="file-button"
                    type="button"
                    onClick={handleClearAll}>
                    <Image src={resetIcon} alt={"reset"} width={20} height={20}/>
                    <strong>Reset</strong>
                </button>
                <button
                    className="file-button"
                    type="button"
                    onClick={handleUnset}>
                    <Image src={terugIcon} alt={"unset"} width={20} height={20}/>
                    <strong>Undo</strong>
                </button>
                {(selectedShapeIndex !== null && selectedShapeIndex >= 0) &&
                <button
                    className="file-button"
                    type="button"
                    onClick={handleDelete}>
                    <Image src={deleteIcon} alt={"delete"} width={20} height={20}/>
                    <strong>Delete</strong>
                </button>
                }

            </div>
        </div>
    )
}
export default FileBar;