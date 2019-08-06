import React from 'react';
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const MyRange = createSliderWithTooltip(Slider.Range);
const MySlider = createSliderWithTooltip(Slider);

export default class Sliders {

    static sliderMarks = {
        0: { 
            style: { 
                'font-weight': 'bold', 
                color: '#ddd',
            },
            label: '0',
        },
        25: { 
            style: { 
                'font-weight': 'bold',  
                color: '#ddd',
            },
            label: '25%',
        },
        50: { 
            style: { 
                'font-weight': 'bold',  
                color: '#ddd',
            },
            label: '50%',
        },
        75: { 
            style: { 
                'font-weight': 'bold',  
                color: '#ddd',
            },
            label: '75%',
        },
        100: { 
            style: { 
                'font-weight': 'bold',  
                color: '#ddd',
            },
            label: '100%'
        },
    };

    static getRangeValues(n) {
        if (n === 1) {
            return ({
                probeSpendPct: 25,
                rangeCt: 1,
                distribRange: [0, 100],
            })
        } else if (n === 2) {
            return ({
                probeSpendPct: 25,
                rangeCt: 2,
                distribRange: [0, 50, 100],
                handleStyle: [
                    { backgroundColor: 'gold', border: '0', height: '0px', width: '0px', },
                    { backgroundColor: 'gold', border: '0', },
                    { backgroundColor: 'cyan', border: '0', height: '0px', width: '0px', },
                ],
                trackStyle: [
                    { backgroundColor: 'gold' },
                    { backgroundColor: 'cyan' },
                ],
                railStyle: { backgroundColor: 'blue' },
            })
        } else if (n === 3) {
            return ({
                probeSpendPct: 25,
                rangeCt: 3,
                distribRange: [0, 33, 66, 100],
                handleStyle: [
                    { backgroundColor: 'gold', border: '0', height: '0px', width: '0px', },
                    { backgroundColor: 'gold', border: '0', },
                    { backgroundColor: 'cyan', border: '0', },
                    { backgroundColor: 'red', border: '0', height: '0px', width: '0px', },
                ],
                trackStyle: [
                    { backgroundColor: 'gold' },
                    { backgroundColor: 'cyan' },
                    { backgroundColor: 'red' },
                ],
                railStyle: { backgroundColor: 'red' },
            })
        }
    }

    static getSlider(props, sliderCallback) {
        return (
            <MySlider
                // count={1}
                min={5}
                max={100}
                value={props.probeSpendPct}
                marks={this.sliderMarks}
                step={5}
                onChange={sliderCallback}
                defaultValue={5}
                trackStyle={[
                    { backgroundColor: '#1A8A09' },
                    { backgroundColor: '#555' },
                ]}
                handleStyle={[
                    // { backgroundColor: '#1A8A09', border: '0', },
                    { backgroundColor: '#1A8A09', border: '0', },
                    { backgroundColor: '#555', border: '0', },
                ]}
                dotStyle={{
                    backgroundColor: '#bbb',
                    border: '0',
                    width: '4px',
                }}
                activeDotStyle={{
                    backgroundColor: '#1A8A09',
                    border: '0',
                    width: '4px',
                }}
                allowCross={false}
                // pushable={true}
                tipFormatter={value => value + "%"}
                tipProps={{ placement: 'bottom' }}
            />
        )
    }

    static getRange(props, rangeCallback) {
        return (
            <MyRange
                count={props.rangeSettings.rangeCt}
                min={0}
                max={100}
                step={2}
                marks={this.sliderMarks}
                onChange={rangeCallback}
                defaultValue={props.rangeSettings.distribRange}
                value={props.rangeSettings.distribRange}
                trackStyle={props.rangeSettings.trackStyle}
                handleStyle={props.rangeSettings.handleStyle}
                railStyle={props.rangeSettings.railStyle}
                dotStyle={{
                    backgroundColor: '#bbb',
                    border: '0',
                    width: '4px',
                }}
                allowCross={false}
                pushable={false}
                tipFormatter={value => value + "%"}
                tipProps={{ placement: 'bottom' }}
            />
        )
    }

}