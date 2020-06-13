import { Component, OnInit, OnChanges, Input, ElementRef, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ScaleBand, ScaleLinear } from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input()
  data = [];

  @Input()
  width: number = 500;
  @Input()
  height: number = 500;
  @Input()
  leftMargin: number = 25;
  @Input()
  rightMargin: number = 25;
  @Input()
  topMargin: number = 25;
  @Input()
  bottomMargin: number = 25;

  private svg;
  private bars;
  private xScale: ScaleBand<string>;
  private yScale;
  private xAxis;
  private yAxis;
  private axes;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    this.svg = d3.select(this.element.nativeElement).append("svg");
    this.svg.attr("height", this.height);
    this.svg.attr("width", this.width);

    this.bars = this.svg.append("g");

    this.axes = this.svg.append("g");

    this.updateAxes();
    this.updateBars();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.data.currentValue != changes.data.previousValue) && (!changes.data.isFirstChange())) {
      this.updateAxes();
      this.updateBars();
    }
  }

  updateBars() {
    this.bars.selectAll("rect").data(this.data).join("rect")
      .attr("x", (d, i) => this.xScale(i))
      .attr("y", d => this.yScale(d.y))
      .attr("height", d => this.yScale(0) - this.yScale(d.y))
      .attr("width", this.xScale.bandwidth())
      .attr("class", d => d.y > 2 ? "bar" : "red-bar");
  }

  updateAxes() {
    this.axes.selectAll("g").remove();
    this.xScale = d3.scaleBand().domain(d3.range(this.data.length).map(d => d.toString())).range([this.leftMargin, this.width - this.rightMargin]).padding(0.5);
    this.yScale = d3.scaleLinear().domain([0, d3.max(this.data, d => d.y) + this.topMargin]).range([this.height - this.topMargin, this.bottomMargin]);
    this.xAxis = g => g.call(d3.axisBottom(this.xScale).tickFormat(i => this.data[i].x).tickSizeOuter(0));
    this.yAxis = g => g.call(d3.axisLeft(this.yScale));
    this.axes.append("g").attr("transform", `translate(0, ${this.height - this.bottomMargin})`).call(this.xAxis);
    this.axes.append("g").attr("transform", `translate(${this.leftMargin}, 0)`).call(this.yAxis);
  }
}
