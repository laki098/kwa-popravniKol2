import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { PieChartItem } from './pice-chart-item.model';
import { PieChartData } from './pie-chart-data.model';
import { ItemService } from '../items/item.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {

  public pieChartData: PieChartData;
  public title;
  private labels;
  private values;
  private height;
  private width;
  private innerRadius;

  private tooltip: any;
  private total: number;

  radius: number;
  // Arcs & pie
  private arc: any; private pie: any; private slices: any;
  private color: any;
  // Drawing containers
  private svg: any; private mainContainer: any;
  // Data
  dataSource: PieChartItem[];

  private arcLabel: any;
  private texts: any;

  legend = [];

  noData: boolean = false;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    let items;
    this.itemService.getAll().subscribe(data => {
      items = data;



      let labels = items.map(item => item.title);
      let values = items.map(item => item.price);



      let minValue = Math.min(...values);
      let maxValue = Math.max(...values);
      let step = (maxValue-minValue)/10;
      let count = [0,0,0,0,0,0,0,0,0,0];
      values.forEach(element => {
        if(element<=step){
          count[0]+=1;
        }
        else if(element<=step*2 && element>step){
          count[1]+=1
        }
        else if(element<=step*3 && element>step*2){
          count[2]+=1
        }
        else if(element<=step*4 && element>step*3){
          count[3]+=1
        }
        else if(element<=step*5 && element>step*4){
          count[4]+=1
        }
        else if(element<=step*6 && element>step*5){
          count[5]+=1
        }
        else if(element<=step*7 && element>step*6){
          count[6]+=1
        }
        else if(element<=step*8 && element>step*7){
          count[7]+=1
        }
        else if(element<=step*9 && element>step*8){
          count[8]+=1
        }
        else if(element<=step*10 && element>step*9){
          count[9]+=1
        }

      });

      values = count;
      labels = [step*1,step*2,step*3,step*4,step*5,step*6,step*7,step*8,step*9,step*10]


      this.pieChartData = new PieChartData("Items", labels, values, 400, 400);
      let id = "id" + Date.now();
      this.svg = d3.select('#pie').attr("id", id).select('svg');
      this.title = this.pieChartData.title;
      this.values = this.pieChartData.values;
      this.labels = this.pieChartData.labels;
      if (!this.values || !this.labels) {
        this.noData = true;
        return;
      }
      for (let index = 0; index < this.values.length; index++) {
        if (this.values[index] == 0) {
          this.values.splice(index, 1);
          this.labels.splice(index, 1);
          index--;
        }
      }
      if (this.values.length == 0) {
        this.noData = true;
        return;
      }
      this.height = this.pieChartData.height;
      this.width = this.pieChartData.width;
      this.innerRadius = this.pieChartData.innerRadiusInPercentage;
      this.dataSource = this.getData(this.labels, this.values);
      this.total = this.dataSource.reduce((sum, it) => sum += Math.abs(it.value), 0);
      this.setSVGDimensions();
      this.color = d3.scaleOrdinal(d3.schemeCategory10);
      this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.radius},${this.radius})`);
      this.pie = d3.pie().sort(null).value((d: any) => Math.abs(d.value));
      this.draw();
      window.addEventListener('resize', this.resize.bind(this));
      this.tooltip = d3.select('#' + id)
        .append('div').attr('class', 'item-pie-chart-tooltip').style('display', 'none').style('opacity', 0);


    });

  }

  private resize() {
    this.setSVGDimensions();
    this.repaint();
  }

  private repaint() {
    this.draw();
    this.drawLabels();
  }

  private setSVGDimensions() {
    this.radius = (Math.min(this.width, this.height)) / 2;
    this.svg.attr('width', 2 * this.radius).attr('height', 2 * this.radius);
    this.svg.select('g').attr('transform', 'translate(' + this.radius + ',' + this.radius + ')');
  }

  private draw() {
    this.setArcs();
    this.drawSlices();
    this.drawLabels();
  }

  private setArcs() {
    this.arc = d3.arc().outerRadius(this.radius).innerRadius(this.radius * this.innerRadius);
    this.arcLabel = d3.arc().innerRadius(this.radius * .8).outerRadius(this.radius * .8);
  }

  private drawSlices() {
    this.slices = this.mainContainer.selectAll('path')
      .remove().exit()
      .data(this.pie(this.dataSource))
      .enter().append('g').append('path')
      .attr('d', this.arc);
    this.slices
      .attr('fill', (d, i) => this.color(i));
    this.slices
      .attr('fill', (d, i) => this.color(i))
      .on('mousemove', function (s) {
        const percent = (Math.abs(Math.abs(s.data.value) / this.total) * 100).toFixed(2) + '%';
        this.tooltip.style('top', (d3.event.layerY + 20) + 'px').style('left', (d3.event.layerX) + 'px')
          .style('display', 'block').style('opacity', 1).style('border', '1px solid' + this.color(s.index));
        this.tooltip.html(`${s.data.name}: ${s.data.value} (${percent})`);
      }.bind(this))
      .on('mouseout', function () {
        this.tooltip.style('display', 'none').style('opacity', 0);
      }.bind(this));
  }

  private drawLabels() {
    this.texts = this.mainContainer.selectAll('text')
      .remove().exit()
      .data(this.pie(this.dataSource))
      .enter().append('text')
      .attr('text-anchor', 'middle').attr('transform', d => `translate(${this.arcLabel.centroid(d)})`);

    this.texts.append('tspan')
      .attr('x', 0).attr('y', 0).attr('fill-opacity', 0.7).style('font-weight', 'bold')
      .text(d => d.data.value);
  }

  getData(labels: string[], values: number[]) {
    const samples = [];
    for (let i = 0; i < values.length; i++) {
      samples.push({
        name: labels[i],
        value: values[i]
      });
    }
    return samples;
  }

}
