import React from 'react';
// import Konva from 'konva';
import { Stage, Layer, Circle, Ellipse, Line, Text } from 'react-konva';
// import MyPortal from './MyPortal';
// import ComputeFunc from './ComputeFunc';
import HelperConst from './HelperConst';
// import ComputeFunc from './ComputeFunc';
import Decimal from 'decimal.js';
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
        this.probeCount = {
            x: 25,
            y: 25,
        }
        this.probeStatus = {
            x: 500,
            y: 25,
        }

        const conv = Space.convertDistanceToSpace(this.props.probe.distance);
        this.mapDistance = conv.dist;
        this.zoomLevel = conv.idx;
        this.zoomName = conv.name;

        // this.planetColors = {
        //     'earth': [0.4, '#1A8A09', 0.8, '#163bb5', 0.9, '#333'],
        //     'sun': [0.4, '#fadf98', 0.8, '#B1954D', 1, '#333'],
        // }
        this.planetColors = {
            'earth': [0.1, '#1A8A09', 0.65, '#163bb5', 0.75, '#333'],
            'sun': [0.4, '#fadf98', 0.8, '#B1954D', 1, '#333'],
            'sunsmall': [0.4, '#fadf98', 1, '#B1954D'],
        }
        this.setPlanetSize();


        this.zoomDuration = 0.25;
        this.zoomShown = this.zoomLevel;

        this.pulseColor = "#222";
        this.pulseColorCt = 0;

        this.starClass = "stars starpause";

        mylog("init mapDistance:", this.mapDistance, "zoomLevel:", this.zoomLevel, "zoomShown:", this.zoomShown, "zoomName:", this.zoomName);
    }

    /* view DIAMETERS */
    static spaceZoomLevels = [
        new Decimal("768e3"),  // moon
        new Decimal("1.556e9"),    // Jupiter
        new Decimal("287.46e9"), // solar system
        new Decimal("15e12"),    // Oort Cloud
        new Decimal("950e15"),  //  milky way (diameter)
        new Decimal("111e18"),  // NGC 4945
        new Decimal("440e24"),  // observable universe
        // new Decimal("Infinity"),
    ];
    static spaceZoomLevelNames = [
        "Moon",
        "Jupiter",
        "Solar System",
        "Oort Cloud",
        "Milky Way",
        "Galaxy NGC 4945",
        "Edge of Observable Universe",
    ];

    static getSpaceInfoForIndex(idx) {
        const definedLevels = Space.spaceZoomLevels.length;
        if (idx < definedLevels) {
            return { idx: idx, dist: Space.spaceZoomLevels[idx], name: Space.spaceZoomLevelNames[idx] };
        } else {
            const baseE9 = Space.spaceZoomLevels[definedLevels - 1].log("1e9").floor().toNumber();
            const diff = idx - definedLevels;
            return { idx: idx, dist: new Decimal("1e9").pow(baseE9 + diff + 1), name: "Dark Unknown" };
        }
    }

    static convertDistanceToSpace(d) {
        const definedLevels = Space.spaceZoomLevels.length;
        for (let n = 0; n < definedLevels; n++) {
            const dist = Space.spaceZoomLevels[n];
            if (dist.gt(d)) return { idx: n, dist: dist, name: this.spaceZoomLevelNames[n] };
        }
        const baseE9 = Space.spaceZoomLevels[definedLevels - 1].log("1e9").floor().toNumber();
        const dFloor = d.log("1e9").floor().toNumber();
        const diff = dFloor - baseE9;
        // const numE10 = definedLevels + dFloor.toNumber() - lvlE10;
        // mylog("dFloor:",dFloor,"baseE9:",baseE9);
        const newDist = new Decimal("1e9").pow(baseE9 + diff + 1);
        mylog("newDist:", HelperConst.showNum(newDist));

        return { idx: definedLevels + diff, dist: new Decimal("1e9").pow(baseE9 + diff + 1), name: "Dark Unknown" };
    }

    setPlanetSize() {
        // set planet size
        if (this.zoomLevel === 0) {
            // Moon
            this.planetRadius = 10;
            this.planetColorStops = this.planetColors.earth;
        } else if (this.zoomLevel === 1) {
            // Jupiter
            this.planetRadius = 10;
            this.planetColorStops = this.planetColors.sun;
        } else if (this.zoomLevel === 2) {
            // Solar System
            this.planetRadius = 3;
            this.planetColorStops = this.planetColors.sunsmall;
        } else {
            this.planetRadius = 0;
        }
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

        this.setPlanetSize();

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
        if (xRadius < (this.planetRadius + 2)) xRadius = this.planetRadius + 2;

        let yRadius = pulseFactor
            .times(this.innerRadius.y)
            .floor()
            // .plus(this.planetRadius).plus(1)
            .toNumber();
        if (yRadius < (this.planetRadius + 2)) yRadius = this.planetRadius + 2;

        return { x: xRadius, y: yRadius };
    }


    processSpaceMap() {
        if (this.props.probe.distance.eq(0)) {
            this.zoomLevel = (Space.convertDistanceToSpace(
                this.props.probe.distance.plus(this.props.probe.getDistPerTick(this.props.timeMultiplier)))
            ).idx;
        } else {
            this.zoomLevel = Space.convertDistanceToSpace(this.props.probe.distance).idx;
        }
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

            this.setPlanetSize();


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

            const conv = Space.getSpaceInfoForIndex(this.zoomShown);
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
                    x: -5,
                    y: -5,
                }}
                fillRadialGradientStartRadius={1}
                fillRadialGradientEndPoint={{
                    x: -5,
                    y: -5,
                }}
                fillRadialGradientEndRadius={this.planetRadius * 2}
                fillRadialGradientColorStops={this.planetColorStops}
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
            /* moon for closest zoom */
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
        if (this.zoomShown > 2) {
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

                        {/* verticals */}
                        <Line
                            points={[this.centerCanvas.x - this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 10, this.centerCanvas.x - this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 50]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Line
                            points={[this.centerCanvas.x + 110, this.centerCanvas.y + this.innerRadius.y + 30, this.centerCanvas.x + this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 30]}
                            stroke="#d55"
                            strokeWidth={1}
                        />

                        {/* left and right */}
                        <Line
                            points={[this.centerCanvas.x - this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 30, this.centerCanvas.x - 110, this.centerCanvas.y + this.innerRadius.y + 30]}
                            stroke="#d55"
                            strokeWidth={1}
                        />
                        <Line
                            points={[this.centerCanvas.x + this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 10, this.centerCanvas.x + this.innerRadius.x, this.centerCanvas.y + this.innerRadius.y + 50]}
                            stroke="#d55"
                            strokeWidth={1}
                        />

                        <Text
                            x={this.centerCanvas.x - 100}
                            y={this.centerCanvas.y + this.innerRadius.y + 24}
                            width={200}
                            text={"Zoom #" + this.zoomShown + ": " + HelperConst.showInt(this.mapDistance) + " km"}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
                            fontStyle={'bold'}
                            align="center"
                            fill="#1A8A09"
                        />
                        <Text
                            x={this.centerCanvas.x - 100}
                            y={this.centerCanvas.y + this.innerRadius.y + 45}
                            width={200}
                            text={this.zoomName}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
                            align="center"
                            fill="#1A8A09"
                        />
                        {/* <MyPortal>
                            <button id="portal-button" disabled={true}>{HelperConst.showNum(Space.spaceZoomLevels[this.zoomShown])}</button>
                        </MyPortal> */}

                    </Layer>

                    <Layer className="status-layer" hitGraphEnabled={false}>

                        <Text
                            x={this.probeCount.x}
                            y={this.probeCount.y}
                            width={200}
                            text={HelperConst.showInt(this.props.probe.number) + " Probe" + (this.props.probe.number.gt(1) ? "s" : "")}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
                            align="center"
                            fill="white"
                        />

                        <Text
                            x={this.probeStatus.x}
                            y={this.probeStatus.y}
                            width={200}
                            text={"Probe failure" + (this.props.probe.qualityLoss.gt(1) ? "s: " : ": ")+HelperConst.showInt(this.props.probe.qualityLoss)}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
                            align="center"
                            fill="gold"
                        />
                        <Text
                            x={this.probeStatus.x}
                            y={this.probeStatus.y+16}
                            width={200}
                            text={"Combat loss" + (this.props.probe.combatLoss.gt(1) ? "es: " : ": ")+HelperConst.showInt(this.props.probe.combatLoss)}
                            fontSize={16}
                            fontFamily={'Kodchasan'}
                            align="center"
                            fill="red"
                        />

                    </Layer>

                </Stage>

            </div>
        )
    }
}