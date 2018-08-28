/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A  {


    // d3.ts
    import Code = powerbi.extensibility.utils.D3;

    
    export interface Metadata {
        measures: string[];
        categories: string[];
    }

    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        // private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;

        constructor(options: VisualConstructorOptions) {
            console.log('Visual constructor', options);
            this.target = options.element;
            // this.updateCount = 0;

            if (typeof document !== "undefined") {
                const new_p: HTMLElement = document.createElement("p");
                const div: HTMLElement = document.createElement("div");
                div.setAttribute('id', 'container');

                // const s: HTMLElement = document.createElement("script");
                // s.appendChild(document.createTextNode("console.log('Hello World');"));
                new_p.appendChild(document.createTextNode("Update counting:"));
                new_p.setAttribute('id', 'name');
                const new_em: HTMLElement = document.createElement("em");
                this.textNode = document.createTextNode("this.updateCount.toString()");
                new_em.appendChild(this.textNode);
                new_p.appendChild(new_em);
                this.target.appendChild(new_p);
                this.target.appendChild(div);
                // this.target.appendChild(s);
            }

            // This line establishes d3 object from d3.js into the global window scope of javascript. We had to cast it to be able to use it.
            // https://medium.com/@jatin7gupta/adding-external-js-libraries-powerbi-custom-visuals-9b0b9a7d4ae
            var d3 = (<any>window).d3;

            var testD3code = "var svg = d3.select('#container').append('svg').attr('width',200).attr('height',300);svg.append('rect').attr('width', 50).attr('height',50).attr('fill','blue');";

            // eval("document.getElementById('name').innerHTML = 'Hello there';console.log('Hello World');");

            eval(testD3code);

            // console.log(Code.deps);
            // console.log(Code.script);
            // console.log(Code.style);
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            //console.log('Visual update', options);
            // if (typeof this.textNode !== "undefined") {
            //     this.textNode.textContent = (this.updateCount++).toString();
            // }

            if (options && options.dataViews && options.dataViews[0]) {
                console.log(Visual.extractMetadata(options.dataViews[0]));
            }

            console.log(Visual.extractData(options.dataViews[0]));
        }

        // Extract metadata, to generalize access to data.
        private static extractMetadata (dataView: DataView): Metadata {
            var meta = {
                measures: [],
                categories: []
            };

            meta.measures = dataView.metadata.columns.filter(c => c.roles.measure).map(m => m.displayName);
            meta.categories = dataView.metadata.columns.filter(c => c.roles.category).map(c => c.displayName);

            return meta;
        }

        // Transform data into an array of objects, suitable for use with D3.
        private static extractData (dataView: DataView) {
            var data = [];
            const columnNames = dataView.metadata.columns.map(c => c.displayName);

            dataView.table.rows.forEach(row => {
                var datum = {};
                row.forEach((v, i) => {
                    datum[columnNames[i]] = v;
                });
                data.push(datum);
            });

            return data;
        }


        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}