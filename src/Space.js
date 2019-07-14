import React from 'react';
import Konva from 'konva';
import { Stage, Layer, Text, Circle, Star, Ellipse } from 'react-konva';


export default class Space extends React.Component {
    constructor(props) {
        super(props);

        this.spaceZoom = false;
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

        this.planetRadius = 10;
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

    stopProbePulse() {
        if (this.tween) {
            this.tween.destroy();
        }
        if (this.pulseMoving) {
            this.probePulseFinished();
        }
    }
    probePulseFinished() {
        this.pulseMoving = false;
        if (this.pulseRef) {
            this.pulseRef.setAttrs({
                'radiusX': this.pulseRadius.x,
                'radiusY': this.pulseRadius.y,
            })
        }
    }

    processSpaceMap() {

        /* perform probe distance pulse */
        if (this.pulseRef) {
            if (!this.pulseMoving && !this.pulsePause) {
                if (this.tween) this.tween.destroy();
                this.pulseMoving = true;
                this.tween = new Konva.Tween({
                    node: this.pulseRef,
                    duration: 10,
                    radiusX: this.innerRadius.x,
                    radiusY: this.innerRadius.y,
                    onFinish: () => {
                        this.stopProbePulse();
                    },
                }).play();
            }
        }

        /* "zoom" space map if probes reach the edge */
        if (this.spaceZoom && this.outerEllipseRef && this.innerEllipseRef) {
            this.spaceZoom = false;
            this.pulsePause = true;
            this.stopProbePulse();
            if (this.centerPlanetRef.getAttr('radius') !== 3) {
                console.log("shrinking planet");
                this.centerPlanetRef.to({
                    duration: 1,
                    radius: 3
                })
            }
            if (!this.outerEllipseMoving) {
                console.log("anim starting");
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

    render() {
        return (
            <div id="probecontent" ref={this.probeDivRef}  >
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
                <div className="stars"></div>
                <Stage width={794} height={538} className="dynamic-layer" >

                    <Layer hitGraphEnabled={false}>

                        <Ellipse
                            id='pulse'
                            x={this.centerCanvas.x}
                            y={this.centerCanvas.y}
                            radiusX={this.pulseRadius.x}
                            radiusY={this.pulseRadius.y}
                            stroke="#555"
                            ref={node => {
                                this.pulseRef = node;
                            }}
                        />
                        <Ellipse
                            id='innerEllipse'
                            x={this.centerCanvas.x}
                            y={this.centerCanvas.y}
                            radiusX={this.innerRadius.x}
                            radiusY={this.innerRadius.y}
                            stroke="white"
                            ref={node => {
                                this.innerEllipseRef = node;
                            }}
                        />
                        <Ellipse
                            id='outerEllipse'
                            x={this.centerCanvas.x}
                            y={this.centerCanvas.y}
                            radiusX={this.outerRadius.x}
                            radiusY={this.outerRadius.y}
                            stroke="white"
                            ref={node => {
                                this.outerEllipseRef = node;
                            }}
                        />
                        <Circle
                            id='centerPlanet'
                            x={this.centerCanvas.x}
                            y={this.centerCanvas.y}
                            radius={this.planetRadius}
                            fill="green"
                            ref={node => {
                                this.centerPlanetRef = node;
                            }}
                        />
                    </Layer>
                    <Layer className="static-layer" hitGraphEnabled={true}>
                        <Text text="Some text on canvas" fontSize={15} />
                        <MyPortal>
                            <button id="portal-button">button</button>
                        </MyPortal>
                        <Star
                            x={100}
                            y={100}
                            numPoints={5}
                            innerRadius={20}
                            outerRadius={40}
                            fill="#89b717"
                            opacity={0.8}
                            draggable
                            rotation={15}
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOpacity={0.6}
                        />

                    </Layer>
                </Stage>

            </div>
        )
    }
}