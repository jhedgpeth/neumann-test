import React from 'react';
// import Konva from 'konva';
import { Stage, Layer, Circle, Ellipse, Line, Text } from 'react-konva';
// import MyPortal from './MyPortal';
import HelperConst from './HelperConst';
// import ComputeFunc from './ComputeFunc';
// import Decimal from 'decimal.js';
const mylog = HelperConst.DebugLog;

export default class Space extends React.Component {
    constructor(props) {
        super(props);

        this.centerCanvas = {
            x: 400,
            y: 250,
        };
        this.pulseRadius = {
            x: 0,
            y: 0,
        };
        this.innerRadius = {
            x: 300,
            y: 150,
        };
        this.outerRadius = {
            x: this.innerRadius.x * 3,
            y: this.innerRadius.y * 3,
        }
        this.moonLocation = {
            x: this.centerCanvas.x + 130,
            y: this.centerCanvas.y - 135,
        }

        if (this.props.zoomLevel === 0) {
            this.planetRadius = 10;
        } else if (this.props.zoomLevel === 1) {
            this.planetRadius = 3;
        } else {
            this.planetRadius = 0;
        }

        this.zoomShown = this.props.zoomLevel;

        this.pulseColor = "#222";
        this.pulseColorCt = 0;

        this.starClass = "stars starpause";

        // this.buildNewZoomText = this.buildNewZoomText.bind(this);

    }

    static getRangeValues(n) {
        if (n === 2) {
            return ({
                probeSpendPct: 1,
                rangeCt: 2,
                distribRange: [0, 50, 100],
                handleStyle: [
                    { backgroundColor: 'gold', border: '0', },
                    { backgroundColor: 'black', border: '1px solid #ddd', },
                    { backgroundColor: 'blue', border: '0', },
                ],
                trackStyle: [
                    { backgroundColor: 'gold' },
                    { backgroundColor: 'blue' },
                ],
                railStyle: { backgroundColor: 'blue' },

            })
        } else if (n === 3) {
            return ({
                probeSpendPct: 1,
                rangeCt: 3,
                distribRange: [0, 33, 66, 100],
                handleStyle: [
                    { backgroundColor: 'gold', border: '0', },
                    { backgroundColor: 'black', border: '1px solid #ddd', },
                    { backgroundColor: 'black', border: '1px solid #ddd', },
                    { backgroundColor: 'red', border: '0', },
                ],
                trackStyle: [
                    { backgroundColor: 'gold' },
                    { backgroundColor: 'blue' },
                    { backgroundColor: 'red' },
                ],
                railStyle: { backgroundColor: 'red' },
            })
        }
    }

    resetProbeZoom() {
        this.outerEllipseRef.setAttrs({
            'radiusX': this.outerRadius.x,
            'radiusY': this.outerRadius.y,
        })
        this.innerEllipseRef.setAttrs({
            'radiusX': this.innerRadius.x,
            'radiusY': this.innerRadius.y,
        })
        this.planetRadius = 3;
        this.pulsePause = false;
        this.starClass = "stars starpause";
    }
    probeOuterZoomFinished() {
        this.outerEllipseMoving = false;
        !this.innerEllipseMoving && this.resetProbeZoom();

    }
    probeInnerZoomFinished() {
        this.innerEllipseMoving = false;
        !this.outerEllipseMoving && this.resetProbeZoom();
    }

    calcProbePulseRadius() {
        const pulseFactor = this.props.probeDistance
            .div(this.props.mapDistance);

        let xRadius = pulseFactor
            .times(this.innerRadius.x)
            .floor()
            // .plus(this.planetRadius).plus(1)
            .toNumber();
        if (xRadius < (this.planetRadius + 1)) xRadius = this.planetRadius + 1;

        let yRadius = pulseFactor
            .times(this.innerRadius.y)
            .floor()
            // .plus(this.planetRadius).plus(1)
            .toNumber();
        if (yRadius < (this.planetRadius + 1)) yRadius = this.planetRadius + 1;

        return { x: xRadius, y: yRadius };
    }

    // buildNewZoomText() {
    //     return (
    //         <Text
    //             x={this.centerCanvas.x - 80}
    //             y={this.centerCanvas.y + this.innerRadius.y + 24}
    //             text={"Zoom lvl: " + this.props.zoomLevel + "km"}
    //             fontSize={16}
    //             fill="green"
    //         />
    //     );
    //     // const textWidth = this.zoomText.width();
    //     // const textHeight = this.zoomText.height();
    //     // this.zoomText.x(this.centerCanvas.x - (textWidth / 2));
    //     // this.zoomText.y(this.centerCanvas.y + this.innerRadius.y + 24 - (textHeight / 2));
    // }

    processSpaceMap() {

        // if (!this.zoomText) {
        //     this.buildNewZoomText();
        // }
        // /* at what zoom do we need to be? */
        // if (this.props.zoomLevel > this.zoomShown) {
        //     // this.props.zoomLevelCallback(newZoomLevel);
        //     // this.buildNewZoomText();

        // }


        /* set probe distance pulse */
        if (this.pulseRef) {
            const probeRadius = (
                this.props.probeDistance.eq(0)
                || (this.props.zoomLevel !== this.zoomShown)
                || this.outerEllipseMoving
                || this.innerEllipseMoving)
                ? { x: 0, y: 0 }
                : this.calcProbePulseRadius();
            this.pulseRef.setAttrs({
                'radiusX': probeRadius.x,
                'radiusY': probeRadius.y,
            })
        }
        /* set pulse color */
        this.pulseColorCt = (this.pulseColorCt + this.props.timeMultiplier);
        // this.pulseColor = this.pulseColors[Math.floor(this.pulseColorCt % this.pulseColors.length)];
        this.pulseColor = "rgba(85,85,85," + (((Math.sin(this.pulseColorCt) + 1) / 4) + 0.5).toFixed(1) + ")"
        // mylog("pulseColor:",this.pulseColor);

        /* "zoom" space map if zoom level changes */
        if ((this.props.zoomLevel > this.zoomShown)
            && this.outerEllipseRef
            && this.innerEllipseRef
            && !this.outerEllipseMoving
            && !this.innerEllipseMoving) {
            mylog("zoomShown:", this.zoomShown);
            this.starClass = "stars starzoom";
            this.zoomShown += 1;
            if (this.props.zoomLevel < 2) {
                mylog("shrinking planet");
                this.centerPlanetRef.to({
                    duration: 1,
                    radius: 3
                })
            }
            if (!this.outerEllipseMoving) {
                mylog("ring anim starting");
                this.outerEllipseMoving = true;
                this.outerEllipseRef.to({
                    duration: 1,
                    radiusX: this.innerRadius.x,
                    radiusY: this.innerRadius.y,
                    onFinish: () => {
                        this.probeOuterZoomFinished();
                    },
                });
                this.innerEllipseMoving = true;
                this.innerEllipseRef.to({
                    duration: 1,
                    radiusX: 0,
                    radiusY: 0,
                    onFinish: () => {
                        this.probeInnerZoomFinished();
                    },
                })
            }
        }
    }

    generateSpaceRender() {
        let rows = [];
        rows.push(
            <Ellipse
                key="pulse"
                id='pulse'
                x={this.centerCanvas.x}
                y={this.centerCanvas.y}
                radiusX={this.pulseRadius.x}
                radiusY={this.pulseRadius.y}
                stroke={this.pulseColor}
                fill="rgba(85,85,85,0.2)"
                ref={node => {
                    this.pulseRef = node;
                }}
            />
        );
        rows.push(
            <Ellipse
                key="innerEllipse"
                id='innerEllipse'
                x={this.centerCanvas.x}
                y={this.centerCanvas.y}
                radiusX={this.innerRadius.x}
                radiusY={this.innerRadius.y}
                stroke="#d55"
                dash={[5, 5]}
                ref={node => {
                    this.innerEllipseRef = node;
                }}
            />
        );
        rows.push(
            <Ellipse
                key="outerEllipse"
                id='outerEllipse'
                x={this.centerCanvas.x}
                y={this.centerCanvas.y}
                radiusX={this.outerRadius.x}
                radiusY={this.outerRadius.y}
                stroke="#d55"
                dash={[5, 5]}
                ref={node => {
                    this.outerEllipseRef = node;
                }}
            />
        );

        /* moon only for closest zoom */
        if (this.props.zoomLevel === 0) {
            rows.push(
                <Circle
                    key="moon"
                    id='moon'
                    x={this.moonLocation.x}
                    y={this.moonLocation.y}
                    radius={5}
                    fillRadialGradientStartPoint={{
                        x: -5,
                        y: -5,
                    }}
                    fillRadialGradientStartRadius={1}
                    fillRadialGradientEndPoint={{
                        x: -5,
                        y: -5,
                    }}
                    fillRadialGradientEndRadius={8}
                    fillRadialGradientColorStops={[0.4, '#ddd', 0.9, '#aaa', 1, '#333']}
                />
            );
        }

        /* compute for center planet representation */
        switch (this.props.zoomLevel) {
            case 0:
                /* the big planet */
                rows.push(
                    <Circle
                        key="centerPlanet"
                        id='centerPlanet'
                        x={this.centerCanvas.x}
                        y={this.centerCanvas.y}
                        radius={10}
                        // fill="green"
                        fillRadialGradientStartPoint={{
                            x: -10,
                            y: -10,
                        }}
                        fillRadialGradientStartRadius={1}
                        fillRadialGradientEndPoint={{
                            x: -10,
                            y: -10,
                        }}
                        fillRadialGradientEndRadius={30}
                        fillRadialGradientColorStops={[0.4, '#1A8A09', 0.8, '#163bb5', 1, '#333']}
                        ref={node => {
                            this.centerPlanetRef = node;
                        }}
                    />
                );
                break;
            case "none":
                /* just a dot... */
                rows.push(
                    <Circle
                        key="centerPlanet"
                        id='centerPlanet'
                        x={this.centerCanvas.x}
                        y={this.centerCanvas.y}
                        radius={3}
                        fill="#1A8A09"
                        ref={node => {
                            this.centerPlanetRef = node;
                        }}
                    />
                );
                break;
            default:
                /*  reticle only */
                rows.push(
                    <React.Fragment key="crossHairFragment">
                        {/* <Ellipse
                            id='centerPlanet'
                            x={this.centerCanvas.x}
                            y={this.centerCanvas.y}
                            radiusX={20 * this.ellipseMetrics.x}
                            radiusY={20 * this.ellipseMetrics.y}
                            stroke="#d55"
                            dash={[4, 4]}
                            ref={node => {
                                this.centerPlanetRef = node;
                            }}
                        /> */}
                        <Line
                            key="crossHair1"
                            points={[this.centerCanvas.x - 5, this.centerCanvas.y, this.centerCanvas.x + 5, this.centerCanvas.y]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Line
                            key="crossHair2"
                            points={[this.centerCanvas.x, this.centerCanvas.y - 5, this.centerCanvas.x, this.centerCanvas.y + 5]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                    </React.Fragment>
                );
                break;
        }

        return rows;
    }


    render() {
        this.processSpaceMap();
        const rows = this.generateSpaceRender();

        return (
            <div id="probecontent" ref={this.probeDivRef}  >
                <div className={this.starClass} />
                <div className={this.starClass} />
                <div className={this.starClass} />
                <div className={this.starClass} />
                <div className={this.starClass} />

                <Stage width={794} height={538} className="dynamic-layer" >

                    <Layer hitGraphEnabled={false}>
                        {rows}
                    </Layer>
                    <Layer className="static-layer" hitGraphEnabled={false}>

                        <Line
                            points={[this.centerCanvas.x - this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 10, this.centerCanvas.x - this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 50]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Line
                            points={[this.centerCanvas.x - this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 30, this.centerCanvas.x - 90, this.centerCanvas.y + this.innerRadius.y + 30]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Text
                            x={this.centerCanvas.x - 80}
                            y={this.centerCanvas.y + this.innerRadius.y + 24}
                            width={160}
                            text={"#" + this.props.zoomLevel + ": " + HelperConst.showInt(this.props.mapDistance) + " km"}
                            fontSize={16}
                            align="center"
                            fill="#1A8A09"
                        />
                        <Line
                            points={[this.centerCanvas.x + 90, this.centerCanvas.y + this.innerRadius.y + 30, this.centerCanvas.x + this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 30]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Line
                            points={[this.centerCanvas.x + this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 10, this.centerCanvas.x + this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 50]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        {/* <MyPortal>
                            <button id="portal-button" disabled={true}>{HelperConst.showNum(HelperConst.spaceZoomLevels[this.zoomShown])}</button>
                        </MyPortal> */}


                    </Layer>
                </Stage>

            </div>
        )
    }
}