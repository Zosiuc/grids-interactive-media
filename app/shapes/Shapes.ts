
import Asset2 from 'app/shapes/SVG/Asset2.svg';
import Asset3 from 'app/shapes/SVG/Asset3.svg';
import HalfCircle from 'app/shapes/SVG/Halfcircle.svg';
import Circle from 'app/shapes/SVG/Circle.svg';
import Vierkant from 'app/shapes/SVG/Vierkant.svg';
import Driehoek from 'app/shapes/SVG/Driehoek.svg';
import Ruitvorm from 'app/shapes/SVG/Ruitvorm.svg';
import HalveCirkelOnderkant from 'app/shapes/SVG/Halve-cirkel-onderkant.svg';
import Trapezium from 'app/shapes/SVG/Trapezium.svg';
import Ster from 'app/shapes/SVG/Ster.svg';

import {FC, SVGProps} from "react";
type SVGComponent = FC<SVGProps<SVGSVGElement>>;

export const componentMap: Record<string, SVGComponent> = {
    Asset2: Asset2,
    Asset3: Asset3,
    HalfCircle: HalfCircle,
    Circle:Circle,
    Vierkant:Vierkant,
    Driehoek:Driehoek,
    Ruitvorm:Ruitvorm,
    HalveCirkelOnderkant:HalveCirkelOnderkant,
    Trapezium:Trapezium,
    Ster:Ster
};
/*
export {
    Asset2,
    Asset3,
    HalfCircle,
    Circle,
    Vierkant,
    Driehoek,
    Ruitvorm,
    HalveCirkelOnderkant,
    Trapezium,
    Ster,
};*/
