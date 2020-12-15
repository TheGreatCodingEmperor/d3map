import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3ServiceService {

  constructor() { }

  draw(svg){
    const projection = getMercator()
      .scale(2200)
      .translate([-1200, 1400])
      .center([0,0]);
    
      const pathGenerator = geoPath().projection(projection);

      json('/assets/counties-mercator-10t.json').then(data => {
        const country = feature(data, data.object["SAU_adm1-2"]);

        const gMap = svg.append('g')
        gMap.selectAll('path').data(country.features)
          .enter().append('path')
      })
  }
}
