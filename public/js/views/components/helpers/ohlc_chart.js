
if (!window.d3){
	window.d3 = require('d3');
}
const Charts = require('../charts/ohlc');

Charts.genChart.ohlc = (data) => {

    let parentWidth = window.innerWidth - 200;
    
    Charts.genChart.chartCount += 1;
    console.log('data', data);
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = parentWidth  - margin.left - margin.right;
    let height = Math.round(parentWidth * 0.6666) - margin.top - margin.bottom;

    let xScale = window.d3.scaleTime();
    let yScale = window.d3.scaleLinear();

    let xAxis = window.d3.axisBottom(xScale).ticks(5);

    let yAxis = window.d3.axisLeft(yScale);

    let series = Charts.series.ohlc()
        .xScale(xScale)
        .yScale(yScale);

    let svg = window.d3.select('#chart').classed('chart', true).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    let g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let plotArea = g.append('g');
    plotArea.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: width, height: height });
    plotArea.attr('clip-path', 'url(#plotAreaClip)');


    let maxDate = window.d3.max(data, (d) => {
        return window.d3.timeFormat("%c")(new Date(d.timestamp));
    });
    let minDate = window.d3.min(data, (d) => {
        return window.d3.timeFormat("%c")(new Date(d.timestamp));
    });
    xScale.domain([
        minDate,
        maxDate
    ]);

    yScale.domain(
        [
            window.d3.min(data, (d) => {
                return d.low;
            }),
            window.d3.max(data, (d) => {
                return d.high;
            })
        ]
    ).nice();

    xScale.range([0, width]);
    yScale.range([height, 0]);

    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    g.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);
};

module.exports = Charts;