import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import { select } from 'd3-selection';
import { geomap } from 'd3-geomap';
import { features } from 'process';
import * as d3 from 'd3';
import * as t from 'topojson';
// export * from 'd3-selection';
export * from 'd3-drag';

import mercatorTw from 'taiwan-atlas';
import { IfStmt } from '@angular/compiler';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    hospital = { name: "", url: "" };
    townId = "";

    constructor() { }

    ngOnInit(): void {

        //#region <外框，中心點>
        let width = 900;
        let height = 900;
        let centered;
        //#endregion </外框，中心點>

        //醫院位置、資訊
        var markers = [
            { level: 2, long: 120.29715, lat: 22.62767, name: "高雄市立大同醫院", url: "https://www.google.com/search?q=高雄市立大同醫院" },
            { level: 2, long: 120.34103, lat: 22.62602, name: "國軍高雄總醫院附設民眾診療服務處附設社區復健中心", url: "https://www.google.com/search?q=國軍高雄總醫院附設民眾診療服務處附設社區復健中心" },
            { level: 1, long: 120.32360, lat: 22.62681, name: "高雄市立民生醫院", url: "https://www.google.com/search?q=高雄市立民生醫院" },
            { level: 2, long: 120.29796, lat: 22.61589, name: "阮綜合醫療社團法人阮綜合醫院", url: "https://www.google.com/search?q=阮綜合醫療社團法人阮綜合醫院" },
            { level: 1, long: 120.32401, lat: 22.63353, name: "天主教聖功醫療財團法人聖功醫院", url: "https://www.google.com/search?q=天主教聖功醫療財團法人聖功醫院" },

            { level: 1, long: 120.29732, lat: 22.61483, name: "邱外科醫院", url: "https://www.google.com/search?q=邱外科醫院/" },
            { level: 2, long: 120.29111, lat: 22.65536, name: "高雄市立聯合醫院", url: "https://www.google.com/search?q=高雄市立聯合醫院" },
            { level: 1, long: 120.28503, lat: 22.59038, name: "高雄市立旗津醫院", url: "https://www.google.com/search?q=高雄市立旗津醫院" },
            { level: 3, long: 120.30964, lat: 22.64617, name: "財團法人私立高雄醫學大學附設中和紀念醫院", url: "https://www.google.com/search?q=財團法人私立高雄醫學大學附設中和紀念醫院" },
            { level: 1, long: 120.32898, lat: 22.72380, name: "健仁醫院", url: "https://www.google.com/search?q=健仁醫院" },

            { level: 2, long: 120.36336, lat: 22.56758, name: "高雄市立小港醫院", url: "https://www.google.com/search?q=高雄市立小港醫院" },
            { level: 2, long: 120.29111, lat: 22.70220, name: "國軍高雄總醫院左營分院", url: "https://www.google.com/search?q=國軍高雄總醫院左營分院" },
            { level: 3, long: 120.32300, lat: 22.67755, name: "高雄榮民總醫院", url: "https://www.google.com/search?q=高雄榮民總醫院" },
            { level: 1, long: 120.28566, lat: 22.78965, name: "國軍高雄總醫院岡山分院附設民眾診療服務處", url: "https://www.google.com/search?q=國軍高雄總醫院岡山分院附設民眾診療服務處" },
            { level: 1, long: 120.29453, lat: 22.79699, name: "高雄市立岡山醫院", url: "https://www.google.com/search?q=高雄市立岡山醫院" },

            { level: 3, long: 120.36444, lat: 22.76609, name: "義大醫療財團法人義大醫院", url: "https://www.google.com/search?q=義大醫療財團法人義大醫院" },
            { level: 1, long: 120.36544, lat: 22.76626, name: "義大醫療財團法人義大癌治療醫院", url: "https://www.google.com/search?q=義大醫療財團法人義大癌治療醫院" },
            { level: 1, long: 120.36304, lat: 22.62869, name: "高雄市立鳳山醫院", url: "https://www.google.com/search?q=高雄市立鳳山醫院" },
            { level: 1, long: 120.36192, lat: 22.62552, name: "大東醫院", url: "https://www.google.com/search?q=大東醫院" },
            { level: 1, long: 120.33567, lat: 22.59779, name: "杏和醫院", url: "https://www.google.com/search?q=杏和醫院" },

            { level: 1, long: 120.38488, lat: 22.61787, name: "瑞生醫院", url: "https://www.google.com/search?q=瑞生醫院" },
            { level: 1, long: 120.38670, lat: 22.50382, name: "建佑醫院", url: "https://www.google.com/search?q=建佑醫院" },
            { level: 3, long: 120.35280, lat: 22.64949, name: "長庚醫療財團法人高雄長庚紀念醫院", url: "https://www.google.com/search?q=長庚醫療財團法人高雄長庚紀念醫院" },
            { level: 2, long: 120.48333, lat: 22.88067, name: "衛生福利部旗山醫院", url: "https://www.google.com/search?q=衛生福利部旗山醫院" },
        ];

        //地圖中點 zoom (drag 不好操作)
        // const zoom = d3.zoom()
        //     .on('zoom', (event) => {
        //         svg.attr('transform', event.transform);
        //     })
        //     .scaleExtent([1, 10]);
        //取消zoom放大
        // d3.select('#zoom-reset-button').on("click", function () {
        //     zoom.transform(svg, d3.zoomIdentity);
        // });

        // 3d 投影 2d
        let projection = d3.geoMercator()
            .center([120.31041, 22.64889])// 函式是用於設定地圖的中心位置，[107,31] 指的是經度和緯度。
            .scale(30000)//函式用於設定放大的比例。
            .translate([200, 500]);//函式用於設定平移。;

        //svg 最外框
        let svg = d3.select('#map').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style("fill", "grey")
        // .call(zoom)
        // .on("wheel.zoom", null);

        var rect = svg.append('rect')
            .attr("x", "10")
            .attr("y", "10")
            .attr("width", width)
            .attr("height", height).attr("fill", "white").on("click", function () { clicked(null); });

        // nation 框path
        let path = d3.geoPath()
            .projection(projection);

        // country/town 框path
        let countriesGroup = svg.append('g');
        countriesGroup.attr('class', 'map');

        //醫院point
        var bubbles = svg
            .selectAll("myCircles")
            .data(markers)
            .enter()
            .append("circle")
            .attr("class", "bubbleLabel")
            .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
            .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
            .attr("r", function (d) { return d.level * 2 })
            .style("fill", function (d) { return `rgba(255, 0, 0, 0.${3 * d.level})` })
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 3)
            .attr("fill-opacity", 1)
            .on("mouseenter", (d: any, i: any) => {
                this.hospital = i;
            })
            .on("click", function (d, i) {
                window.location.href = i.url;
            });

        var countries;
        var villages;

        //點擊 country/town zoom
        var clicked = (d) => {
            var x, y, k;

            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
            }

            // countriesGroup.selectAll("path")
            //     .classed("active", centered && function (d) { return d === centered; });

            // countriesGroup.selectAll("myCircles")
            //     .classed("active", centered && function (d) { return d === centered; });

            countriesGroup.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            // .style("stroke-width", 1.5 / k + "px");

            bubbles.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");
            chooseTown(d);
        }

        var chooseTown = (d) => {
            countries
                .attr("stroke", "none");
            if (this.townId == d.properties.TOWNID) {
                this.townId = null;
            }
            else {
                this.townId = d.properties.TOWNID;
                svg.select(`#country${d.properties.TOWNID}`)
                    .attr("stroke", "white")
                    // .attr("stroke-width", "3px")
                    .append("filter")
                    .attr("id", "dropshadow");
            }

            console.log(`#country${d.properties.TOWNID}`);
        }

        var chooseHospital = (hospital: object) => {
            if (this.hospital == hospital) {

            }
        }

        // unzoom 點擊 zoom
        d3.select('#zoom-reset-button').on("click", function () { clicked(null); });

        // 
        var labels = svg.append('g').attr('class', 'labels');

        //匯入json 檔(走http client)
        d3.json("./assets/villages-10t.json")
            .then((topology: any) => {
                // <---- Renamed it from data to topology
                //篩選 行政區
                (topology as any).objects.towns.geometries = (topology as any).objects.towns.geometries.filter(x => x.properties.COUNTYNAME == "高雄市");
                (topology as any).objects.villages.geometries = (topology as any).objects.villages.geometries.filter(x => x.properties.COUNTYNAME == "高雄市");
                // (topology as any).objects.countries.geometries = (topology as any).objects.countries.geometries.filter(x => x.properties.COUNTYNAME=="高雄市");
                console.log("------>", (topology as any));

                // countriesGroup.selectAll('path')
                //     .data(t.feature(topology, (topology as any).objects.towns).features)
                //     //.data(t.feature(topology, topology.objects.countries)
                //     //  .geometries)
                //     .enter()
                //     .append('path')
                //     .attr('d', path);

                // countriesGroup.selectAll('path')
                //     .data(t.feature(topology, (topology as any).objects.countries).features)
                //     //.data(t.feature(topology, topology.objects.countries)
                //     //  .geometries)
                //     .enter()
                //     .append('path')
                //     .attr('d', path);

                // country/town 框
                countries = countriesGroup
                    .selectAll("path")
                    .data(t.feature(topology, (topology as any).objects.towns).features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    // .attr("stroke", "#000")
                    // .attr("stroke-width", "2px")
                    .attr("id", function (d: any, i) {
                        if (d.properties)
                            return `country${d.properties.TOWNID}`;
                    })
                    .attr("class", "country")
                    // add a mouseover action to show name label for feature/country
                    // .on("mouseover", function (d: any, i: any) {
                    //     d3.select(this).style("fill", "orange");
                    //     console.log(i);
                    //     d3.select(`#countryLabel${i.properties.TOWNID}`).style("display", "block");
                    // })
                    // .on("mouseout", function (d: any, i: any) {
                    //     d3.select(this).style("fill", "grey");
                    //     d3.select(`#countryLabel${i.properties.TOWNID}`).style("display", "none");
                    // })
                    .on("mouseover", function (d, i) {
                        Tooltip.style("opacity", 1)
                        d3.select(this).style("fill", "orange");
                    })
                    .on("mousemove", function (d, i: any) {
                        Tooltip
                            .html(i.properties.TOWNNAME)
                            .style("left", (d.clientX + 10) + "px")
                            .style("top", (d.clientY) + "px")
                    })
                    .on("mouseleave", function (d, i) {
                        Tooltip.style("opacity", 0)
                        d3.select(this).style("fill", "grey");
                    })
                    // add an onclick action to zoom into clicked country
                    .on("click", function (d, i) {
                        d3.selectAll(".country").classed("country-on", false);
                        d3.select(this).classed("country-on", true);
                        clicked(i);
                    });

                var Tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 1)
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px")
                    .style("position","absolute")

                // villages = countriesGroup
                //     .selectAll("path")
                //     .data(t.feature(topology, (topology as any).objects.villages).features)
                //     .enter()
                //     .append("path")
                //     .attr("d", path)
                //     .attr("id", function (d: any, i) {
                //         if (d.properties)
                //             return `vill${d.properties.VILLCODE}`;
                //     })
                //     .attr("class", "vill")
                //     .attr("class", function (d: any, i) {
                //         if (d.properties)
                //             return `countryLabel${d.properties.TOWNID}`;
                //     })
                //     .attr('opacity', 0)
                //     // add a mouseover action to show name label for feature/country
                //     .on("mouseover", function (d: any, i: any) {
                //         d3.select(this).style("fill", "orange");
                //         console.log(i);
                //         d3.select(`#countryLabel${i.properties.TOWNID}`).style("display", "block");
                //     })
                //     .on("mouseout", function (d: any, i: any) {
                //         d3.select(this).style("fill", "grey");
                //         d3.select(`#countryLabel${i.properties.TOWNID}`).style("display", "none");
                //     })
                //     // add an onclick action to zoom into clicked country
                //     .on("click", function (d, i) {
                //         d3.selectAll(".country").classed("country-on", false);
                //         d3.select(this).classed("country-on", true);
                //         clicked(i);
                //     });

                //
                let countryLabels = countriesGroup
                    .selectAll("g")
                    .data(t.feature(topology, (topology as any).objects.towns).features)
                    .enter()
                    .append("g")
                    .attr("class", "countryLabel")
                    .attr("display", "none")
                    .attr("id", function (d: any) {
                        if (d.properties)
                            return `countryLabel${d.properties.TOWNID}`;
                    })
                    .attr("transform", function (d: any) {
                        return (
                            "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")"
                        );
                    })
                    // add mouseover functionality to the label
                    .on("mouseenter", function (d: any, i: any) {
                        d3.select(this).style("display", "block");
                        d3.select(`#country${i.properties.TOWNID}`).style("fill", "orange");
                    })
                    .on("mouseout", function (d, i: any) {
                        d3.select(this).style("display", "none");
                        d3.select(`#country${i.properties.TOWNID}`).style("fill", "grey");
                    })
                    // add an onlcick action to zoom into clicked country
                    .on("click", function (d, i) {
                        clicked(i);
                    });

                // add the text to the label group showing country name
                countryLabels
                    .append("text")
                    .attr("class", "countryName")
                    .style("text-anchor", "middle")
                    .attr("dx", 0)
                    .attr("dy", 0)
                    .style("fill", "white")
                    .attr("stroke", "black")
                    .style("font-weight", "700")
                    .text(function (d: any) {
                        if (d.properties)
                            return `${d.properties.TOWNNAME}`;
                    });


                // countriesGroup
                //     .append("rect")
                //     .attr("x", 0)
                //     .attr("y", 0)
                //     .attr("width", w)
                //     .attr("height", h)
                //     ;
                console.log("ending json calling1");

            });

        console.log("outside json calling1");
    }
}
