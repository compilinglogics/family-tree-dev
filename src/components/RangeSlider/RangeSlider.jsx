// RangeSlider.js

import React from 'react';
import './rangeSlider.scss'

const RangeSlider = (props) => {
    return (
        <div class="custom-range-slider">

            <label style={{ '--c': '#0E0E0E' }}>
                <input className='' type="range" id="two" {...props} />
                <output class="bottom" for="two" style={{ '--min': props.min, '--max': props.max }}>
                    {props.value}
                </output>
            </label>

        </div>
    )
}

export default RangeSlider