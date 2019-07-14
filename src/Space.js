import React from 'react';
// import Konva from 'konva';
import { Stage, Layer, Circle, Ellipse, Line } from 'react-konva';
// import MyPortal from './MyPortal';
import HelperConst from './HelperConst';

export default class Space extends React.Component {
    constructor(props) {
        super(props);


        this.ellipseMetrics = {
            x: 4 / 3,
            y: 2 / 3,
            base: 225,
        }
        this.centerCanvas = {
            x: 400,
            y: 250,
        };
        this.pulseRadius = {
            x: 0,
            y: 0,
        };
        this.innerRadius = {
            x: this.ellipseMetrics.base * this.ellipseMetrics.x,
            y: this.ellipseMetrics.base * this.ellipseMetrics.y,
        };
        this.outerRadius = {
            x: this.ellipseMetrics.base * this.ellipseMetrics.x * 3,
            y: this.ellipseMetrics.base * this.ellipseMetrics.y * 3,
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
        const zoomDistance = HelperConst.spaceZoomLevels[this.props.zoomLevel];
        const x = this.props.probeDistance
            .div(zoomDistance)
            .times(this.innerRadius.x)
            .floor()
            .plus(this.planetRadius)
            .plus(1)
            .toNumber();
        const y = this.props.probeDistance
            .div(zoomDistance)
            .times(this.innerRadius.y)
            .floor()
            .plus(this.planetRadius)
            .plus(1)
            .toNumber();
        return { x: x, y: y };
    }


    processSpaceMap() {

        /* at what zoom do we need to be? */
        const newZoomLevel = HelperConst.getSpaceZoomLevelIdx(this.props.probeDistance);
        if (newZoomLevel > this.props.zoomLevel) {
            this.props.setSpaceZoomLevel(newZoomLevel);
        }

        /* perform probe distance pulse */
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
        // console.log("pulseColor:",this.pulseColor);

        /* "zoom" space map if probes reach the edge */
        if ((this.zoomShown < this.props.zoomLevel)
            && this.outerEllipseRef
            && this.innerEllipseRef
            && !this.outerEllipseMoving) {
            console.log("spaceZoom:", this.zoomShown);
            this.zoomShown += 1;
            if (this.props.zoomLevel < 2) {
                console.log("shrinking planet");
                this.centerPlanetRef.to({
                    duration: 1,
                    radius: 3
                })
            }
            if (!this.outerEllipseMoving) {
                console.log("ring anim starting");
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
        if (this.props.zoomLevel === 0) {
            rows.push(
                <Circle
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
        switch (this.props.zoomLevel) {
            case 0:
                /* the big planet */
                rows.push(
                    <Circle
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
                        fillRadialGradientColorStops={[0.4, 'green', 0.9, 'blue', 1, '#333']}
                        ref={node => {
                            this.centerPlanetRef = node;
                        }}
                    />
                );
                break;
            case 1:
                /* just a dot... */
                rows.push(
                    <Circle
                        id='centerPlanet'
                        x={this.centerCanvas.x}
                        y={this.centerCanvas.y}
                        radius={3}
                        fill="green"
                        ref={node => {
                            this.centerPlanetRef = node;
                        }}
                    />
                );
                break;
            default:
                /*  reticle only */
                rows.push(
                    <React.Fragment>
                        <Ellipse
                            id='centerPlanet'
                            x={this.centerCanvas.x}
                            y={this.centerCanvas.y}
                            radiusX={20 * this.ellipseMetrics.x}
                            radiusY={20 * this.ellipseMetrics.y}
                            stroke="#d55"
                            dash={[5, 1]}
                            ref={node => {
                                this.centerPlanetRef = node;
                            }}
                        />
                        <Line
                            points={[this.centerCanvas.x - 5, this.centerCanvas.y, this.centerCanvas.x + 5, this.centerCanvas.y]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Line
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
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
                <Stage width={794} height={538} className="dynamic-layer" >

                    <Layer hitGraphEnabled={false}>

                        {rows}
                    </Layer>
                    <Layer className="static-layer" hitGraphEnabled={false}>
                        {/* <MyPortal>
                            <button id="portal-button" disabled={true}>{HelperConst.showNum(HelperConst.spaceZoomLevels[this.zoomShown])}</button>
                        </MyPortal> */}


                    </Layer>
                </Stage>

            </div>
        )
    }
}