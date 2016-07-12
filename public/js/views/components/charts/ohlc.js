//import d3 from 'd3';
if (!window.d3){
	window.d3 = require('d3');
}


Charts.avaliableCharts.push('ohlc');
Charts.series.ohlc =  () => {

    let xScale = window.d3.scaleTime();
    let yScale = window.d3.scaleLinear();
    const isUpDay = (d) => {
    	return d.close > d.open;
    };
    const isDownDay = (d) => {
    	return !isUpDay;
    };
    let tickWidth = 5;
    let line = window.d3.line()
            .x((d) => {
                return d.x;
            })
            .y((d) => {
                return d.y;
             });
    let highLowLines =  (bars) => {

            let paths = bars.selectAll('.high-low-line').data((d) => {
                return [d];
            });

            paths.enter().append('path');

            paths.classed('high-low-line', true)
                .attr('d', (d) => {
                    return line([
                        { x: xScale(d.timestamp), y: yScale(d.high) },
                        { x: xScale(d.timestamp), y: yScale(d.low) }
                    ]);
                });
        };
        let openCloseTicks =  (bars) => {
            let open;
            let close;

            open = bars.selectAll('.open-tick').data((d) => {
                return [d];
            });

            close = bars.selectAll('.close-tick').data((d) => {
                return [d];
            });

            open.enter().append('path');
            close.enter().append('path');

            open.classed('open-tick', true)
                .attr('d',  (d) => {
                    return line([
                        { x: xScale(d.timestamp) - tickWidth, y: yScale(d.open) },
                        { x: xScale(d.timestamp), y: yScale(d.open) }
                    ]);
                });

            close.classed('close-tick', true)
                .attr('d',  (d) => {
                    return line([
                        { x: xScale(d.timestamp), y: yScale(d.close) },
                        { x: xScale(d.timestamp) + tickWidth, y: yScale(d.close) }
                    ]);
                });

            open.exit().remove();
            close.exit().remove();
        };
    const ohlc =  (selection) => {
    	  let series;
    	  let bars;
        selection.each((data) => {
             series = window.d3.selectAll('.ohlc-series').data([data]);
                series.enter().append('g').classed('ohlc-series', true);

                bars = series.selectAll('.bar')
                    .data(data, (d) => {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed('bar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });
                highLowLines(bars);
                openCloseTicks(bars);

                bars.exit().remove();

        });
    };

    ohlc.xScale = (value) => {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return ohlc;
    };

    ohlc.yScale = (value) => {
         if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return ohlc;
    };
     ohlc.tickWidth =  (value) => {
            if (!arguments.length) {
                return tickWidth;
            }
            tickWidth = value;
            return ohlc;
        };

    return ohlc;
};
module.exports = Charts;