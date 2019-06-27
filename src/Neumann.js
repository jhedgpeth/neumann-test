import React from 'react';
import './index.css';
import { Decimal } from 'decimal.js';
import Income from './Income';
import Business from './Business.js';
// import Probe from './Probe.js';
import BusinessInit from './BusinessInit';
import ProbeInit from './ProbeInit';
import ComputeFunc from './ComputeFunc';
// import HelperConst from './HelperConst';


// =====================================================
export default class Neumann extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            money: new Decimal(0),
            knowledge: new Decimal(0),
            businesses: [],
            probes: [],
        };

        this.timeInterval = 100;
        this.timeMultiplier = this.timeInterval / 1000;

        // this._business = React.createRef();
        this.updateGame = this.updateGame.bind(this);
        this.clickBusiness = this.clickBusiness.bind(this);
        this.clickProbe = this.clickProbe.bind(this);

    }

    componentDidMount() {
        console.log("game didmount");
        this.setState({
            businesses: BusinessInit(),
            probes: ProbeInit(),
        })
        this.gameIntervalId = setInterval(this.updateGame, this.timeInterval);
    }

    componentWillUnmount() {
        console.log("game willunmount");
        clearInterval(this.gameIntervalId);
    }

    componentDidUpdate() {
        // console.log("game didupdate");

    }

    updateGame() {
        // console.log("updateGame()");
        const Decimal = require('decimal.js');

        let revenue = new Decimal(0);
        this.state.businesses.forEach((bus) => {
            revenue = revenue.plus(ComputeFunc.computeEarning(bus).revenue);
        });

        let learning = new Decimal(0);
        this.state.probes.forEach((probe) => {
            learning = learning.plus(ComputeFunc.computeEarning(probe).learning);
        })

        this.setState({
            money: this.state.money.plus(revenue),
            knowledge: this.state.knowledge.plus(learning),
        });
    }

    clickBusiness(bus) {
        console.log("business click ", bus.name);
        const busCost = ComputeFunc.getCost(bus);
        if (this.state.money.gte(busCost.money)) {

            let updatedBus = { ...bus };
            updatedBus.owned = (updatedBus.owned + busCost.num);
            const newMoney = this.state.money.minus(busCost.money);

            let busList = this.state.businesses.map((b) => {
                return (b.name === bus.name) ? updatedBus : b;
            })
            this.setState({
                businesses: busList,
                money: newMoney,
            })
        }
    }

    clickProbe(probe) {
        console.log("probe click ", probe.name);
        const probeCost = ComputeFunc.getCost(probe);
        if (this.state.knowledge.gte(probeCost.knowledge)) {

            let updatedProbe = { ...probe };
            updatedProbe.owned = (updatedProbe.owned + probeCost.num);
            const newKnowledge = this.state.knowledge.minus(probeCost.knowledge);

            let probeList = this.state.probes.map((p) => {
                return (p.name === probe.name) ? updatedProbe : p;
            })
            this.setState({
                probes: probeList,
                knowledge: newKnowledge,
            })
        }
    }

    render() {

        return (
            <div id="wrapper">
                <div id="header">

                    <Income
                        money={this.state.money}
                        knowledge={this.state.knowledge}
                        businesses={this.state.businesses}
                        probes={this.state.probes}
                    />

                </div>
                <div id="left-sidebar">

                    <Business
                        businesses={this.state.businesses}
                        onClick={this.clickBusiness}
                    />
                    
                </div>
                <div id="right-sidebar">

                    right side

                </div>

                <div id="content">
                    <div className="container">

                        main stuff

                    </div>

                </div>

                <div id="footer">

                    footer

                </div>
            </div>
        )
    }




}

// =====================================================


