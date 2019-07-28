import React from 'react';
// import Konva from 'konva';
import { Stage, Layer, Circle, Ellipse, Line, Text } from 'react-konva';
// import MyPortal from './MyPortal';
import ComputeFunc from './ComputeFunc';
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
        this.centerRadius = {
            x: 0,
            y: 0,
        }
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

        const conv = ComputeFunc.convertDistanceToSpace(this.props.probe.distance);
        this.mapDistance = conv.dist;
        this.zoomLevel = conv.idx;
        this.zoomName = conv.name;
        if (this.zoomLevel === 0) {
            this.planetRadius = 10;
        } else if (this.zoomLevel === 1) {
            this.planetRadius = 3;
        } else {
            this.planetRadius = 0;
        }

        this.zoomDuration = 0.25;
        this.zoomShown = this.zoomLevel;

        this.pulseColor = "#222";
        this.pulseColorCt = 0;

        this.starClass = "stars starpause";

        mylog("init mapDistance:", this.mapDistance, "zoomLevel:", this.zoomLevel, "zoomShown:", this.zoomShown, "zoomName:", this.zoomName);
    }

    resetProbeZoom() {
        // const conv = ComputeFunc.getSpaceInfoForIndex(this.zoomShown);
        // this.mapDistance = conv.dist;
        // this.zoomLevel = conv.idx;
        // this.zoomName = conv.name;
        // mylog("reset mapDistance:", this.mapDistance, "zoomLevel:", this.zoomLevel, "zoomShown:", this.zoomShown, "zoomName:", this.zoomName);

        if (this.outerEllipseRef) this.outerEllipseRef.setAttrs({
            'radiusX': this.outerRadius.x,
            'radiusY': this.outerRadius.y,
        })
        if (this.innerEllipseRef) this.innerEllipseRef.setAttrs({
            'radiusX': this.innerRadius.x,
            'radiusY': this.innerRadius.y,
        })
        if (this.centerEllipseRef) this.centerEllipseRef.setAttrs({
            'radiusX': this.centerRadius.x,
            'radiusY': this.centerRadius.y,
        })
        // set planet size
        if (this.zoomShown === 0) {
            this.planetRadius = 10;
        } else if (this.zoomShown === 1) {
            this.planetRadius = 3;
        } else {
            this.planetRadius = 0;
        }
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
        const pulseFactor = this.props.probe.distance
            .div(this.mapDistance);

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


    processSpaceMap() {

        this.zoomLevel = ComputeFunc.convertDistanceToSpace(this.props.probe.distance).idx;
        // mylog("zoomLevel:",this.zoomLevel, "zoomShown:",this.zoomShown);

        /* set probe distance pulse */
        if (this.pulseRef) {
            const probeRadius = (
                this.props.probe.distance.eq(0)
                || (this.zoomLevel !== this.zoomShown)
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
        this.pulseColor = "rgba(85,85,0," + (((Math.sin(this.pulseColorCt) + 1) / 4) + 0.5).toFixed(1) + ")"
        // mylog("pulseColor:",this.pulseColor);

        // if ((this.zoomLevel === this.zoomShown)) {
        //     this.resetProbeZoom();
        // }

        /* "zoom" space map if zoom level changes */
        if ((this.zoomLevel !== this.zoomShown)
            && this.outerEllipseRef
            && this.innerEllipseRef
            && this.centerEllipseRef
            && !this.outerEllipseMoving
            && !this.innerEllipseMoving) {

            mylog("before reset.  zoomShown:", this.zoomShown, "zoomLevel:", this.zoomLevel);
            this.resetProbeZoom();

            let toOuterRadX, toOuterRadY, toInnerRadX, toInnerRadY, toCenterRadX, toCenterRadY;
            if (this.zoomLevel > this.zoomShown) {
                // shrink ellipse
                toOuterRadX = this.innerRadius.x;  // shrink
                toOuterRadY = this.innerRadius.y;
                toInnerRadX = 0;  // shrink
                toInnerRadY = 0;
                toCenterRadX = 0;  // stay
                toCenterRadY = 0;
                this.starClass = "stars starzoom";
                this.zoomShown += 1;
            } else {
                // grow ellipse
                toOuterRadX = this.outerRadius.x;  // stay
                toOuterRadY = this.outerRadius.y;
                toInnerRadX = this.outerRadius.x;  // grow
                toInnerRadY = this.outerRadius.y;
                toCenterRadX = this.innerRadius.x;  // grow
                toCenterRadY = this.innerRadius.y;
                this.starClass = "stars starshrink";
                this.zoomShown -= 1;
            }

            // set planet size
            if (this.zoomShown === 0) {
                this.planetRadius = 10;
            } else if (this.zoomShown === 1) {
                this.planetRadius = 3;
            } else {
                this.planetRadius = 0;
            }

            if (!this.outerEllipseMoving) {
                mylog("ring anim starting");
                this.outerEllipseMoving = true;
                this.outerEllipseRef.to({
                    duration: this.zoomDuration,
                    radiusX: toOuterRadX,
                    radiusY: toOuterRadY,
                    onFinish: () => {
                        this.probeOuterZoomFinished();
                    },
                });
                this.innerEllipseMoving = true;
                this.innerEllipseRef.to({
                    duration: this.zoomDuration,
                    radiusX: toInnerRadX,
                    radiusY: toInnerRadY,
                    onFinish: () => {
                        this.probeInnerZoomFinished();
                    },
                });
                this.centerPlanetRef.to({
                    duration: this.zoomDuration,
                    radius: this.planetRadius
                });
                this.centerEllipseRef.to({
                    duration: this.zoomDuration,
                    radiusX: toCenterRadX,
                    radiusY: toCenterRadY,
                });
            }

            const conv = ComputeFunc.getSpaceInfoForIndex(this.zoomShown);
            this.mapDistance = conv.dist;
            this.zoomName = conv.name;
            // mylog("process mapDistance:", this.mapDistance, "zoomLevel:", this.zoomLevel, "zoomShown:", this.zoomShown, "zoomName:", this.zoomName);
            // mylog("starclass:",this.starClass);
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
            <Circle
                key="centerPlanet"
                id='centerPlanet'
                x={this.centerCanvas.x}
                y={this.centerCanvas.y}
                radius={this.planetRadius}
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
        rows.push(
            <Ellipse
                key="centerEllipse"
                id='centerEllipse'
                x={this.centerCanvas.x}
                y={this.centerCanvas.y}
                radiusX={this.centerRadius.x}
                radiusY={this.centerRadius.y}
                stroke="#d55"
                dash={[5, 5]}
                ref={node => {
                    this.centerEllipseRef = node;
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

        if (this.zoomShown === 0) {
            /* moon only for closest zoom */
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
        if (this.zoomShown > 1) {
            /* reticle */
            rows.push(
                <React.Fragment key="crossHairFragment">
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
                            text={"#" + this.zoomShown + ": " + HelperConst.showInt(this.mapDistance) + " km"}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
                            align="center"
                            fill="#1A8A09"
                        />
                        <Text
                            x={this.centerCanvas.x - 80}
                            y={this.centerCanvas.y + this.innerRadius.y + 45}
                            width={160}
                            text={this.zoomName}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
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