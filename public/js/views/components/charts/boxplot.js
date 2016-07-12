import React from "react";
import d3 from 'd3';
if (!window.d3){
	window.d3 = require('d3');
} 

import ReStock from "react-stockcharts";

const { ChartCanvas, Chart, EventCapture } = ReStock;

const { CandlestickSeries } = ReStock.series;
const { financeEODDiscontiniousScale } = ReStock.scale;
const { XAxis, YAxis } = ReStock.axes;
console.log('ReStock.series', ReStock.series);
console.log('ReStock.scale', ReStock.scale);
console.log('ReStock.helper', ReStock.helper);
const { MouseCoordinates } = ReStock.coordinates;
const { TooltipContainer, OHLCTooltip } = ReStock.tooltip;
const fitWidth = ReStock.helper.fitWidth;
const TypeChooser = ReStock.helper.TypeChooser;

class CandleStickChart extends React.Component {
  render() {

    const {
      type,
      width,
      height,
      data,
      company
    } = this.props;
    if (!data.length) return (<h4>No Graph</h4>)
    return (
      <ChartCanvas width={width} height={height}
					margin={{left: 70, right: 70, top:20, bottom: 30}} type={type}
					seriesName={company}
					data={data}

					xAccessor={d => new Date(d.timestamp)} discontinous xScale={financeEODDiscontiniousScale()}
					xExtents={[new Date(data[0].timestamp), new Date(data[data.length - 1].timestamp)]}>

				<Chart id={1} yExtents={d => [d.high, d.low]}
				yMousePointerDisplayLocation="right" yMousePointerDisplayFormat={d3.format(".2f")}>
					<XAxis axisAt="bottom" orient="bottom"  tickStroke="#FFFFFF" stroke="#FFFFFF" ticks={6}/>
					<YAxis axisAt="left" orient="left" ticks={5} stroke="#FFFFFF"  tickStroke="#FFFFFF" />
					<CandlestickSeries wickStroke={d => d.close > d.open ? "#6BA583" : "#db0000" } />
				</Chart>
				<MouseCoordinates stroke="#FFFFFF" xDisplayFormat={d3.time.format("%Y-%m-%d")} />
				<EventCapture mouseMove={true} />
				<TooltipContainer>
					<OHLCTooltip forChart={1} origin={[-45, -15]}/>
				</TooltipContainer>
			</ChartCanvas>
    );
  }
}
CandleStickChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
  type: "svg",
};


CandleStickChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};


export default CandleStickChart;