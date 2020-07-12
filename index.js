d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",function(error,data){
   if (error) throw error;
    const padding = 70;
    const w = 1400; 
    const h = 600;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const colors = ["#5e4fa2","#3288bd","#66c2a5","#abdda4","#e6f598","#ffffbf","#fee08b","#fdae61","#f46d43", "#d53e4f","#9e0142"];
    const dataX = data["monthlyVariance"].map((i) => i["year"]);
    const dataY = data["monthlyVariance"].map((i) => i["month"]);
    const dataTemp = data["monthlyVariance"].map((i) => {
  return Math.abs((data.baseTemperature + i['variance']).toFixed(3));
  });
    //console.log(data.monthlyVariance[2]["month"]);
    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataX), d3.max(dataX)])
                     .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
                     .domain([d3.min(dataY), d3.max(dataY)])
                     .range([padding,h - padding]);
 const colorScale = d3.scaleQuantile()
    .domain([d3.min(dataTemp), d3.max(dataTemp)])
    .range(colors);
  const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
   .style("opacity","0.8")
    .style("width", "130px")
   .style("font-family", "Arial")
    .style("font-size", "13px")
    .style("background-color", "#b9b8b8")
   .style("border-radius","5px")
   .style("text-align","center")
   .style("position","absolute")
  .style("visibility", "hidden");
  
    const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
    svg.selectAll("rect")
       .data(data["monthlyVariance"].map(d => d))
       .enter()
       .append("rect")
    .attr("cursor","pointer")
       .attr("fill", (d) => 
          colorScale(Math.abs((data.baseTemperature + d['variance'])))
    )
       .attr("x", (d,i) => xScale(d["year"]))
       .attr("y",(d,i) => yScale(d["month"]))
       .attr("width", 4)
       .attr("height", (d) => 39)
       .attr("class","bar")
  .on("mouseover", (d) =>{  
tooltip.style("visibility","visible")
      .html(d["year"] + "-" + months[d["month"]-1] + "<br>" + (Math.abs((8.66 + d['variance']).toFixed(3))) + "℃" + "<br>" + d['variance'].toFixed(3) + "℃")
          .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY + 10) + "px")
      })
  
     
  .on("mouseout",(d, i)=>{
    tooltip.style("visibility","hidden");
  });
 
 
    const xAxis = d3.axisBottom(xScale).ticks(20).tickFormat(d=> d);
    
    const yAxis = d3.axisLeft(yScale).tickFormat(d=> 
      months[d-1]);
    
    
    svg.append("g")
      .attr("transform", "translate(0," + (h - padding + 40 ) + ")")
       .call(xAxis);
    svg.append("g")
      .attr("transform", "translate(" +  padding + ",0)")
       .call(yAxis)
  
  
  
     const gridSize = 20;
  const legendWidth = gridSize * 2;
 const legend = svg.selectAll("legend")
   .data([0].concat(colorScale.quantiles()), (d) => d)
   .enter()
      .append("g")
      .attr("class", "legend")
    .attr("transform", "translate(" +  (padding + h - 150) + ",0)")
 legend.append("rect")
     .attr("class", "rectLegend")
  .attr("x", (d, i) => legendWidth * i)
   .attr("y", h - padding - 530)
  .attr("width", legendWidth)
      .attr("height", gridSize)
      .style("fill", (d, i) => colors[i]);
  
  legend.append("text")
      .attr("class", "legendText")
      .text((d) =>  (d).toFixed(1))
      .attr("x", (d, i) => (legendWidth + 2 ) * i)
      .attr("y", h - padding - 490) 
      .style("font-size", "12px") 
      

});
