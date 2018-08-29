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

module powerbi.extensibility.visual {

    import Code = powerbi.extensibility.utils.D3; // Stored in the d3.ts file.

    export interface Metadata {
        measures: string[];
        categories: string[];
    }

    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private settings: VisualSettings;

        constructor(options: VisualConstructorOptions) {
            // console.log('Visual constructor', options);
            this.target = options.element;

            if (typeof document !== "undefined") {
                const style: HTMLElement = document.createElement("style");
                style.innerText = Code.style;

                const div: HTMLElement = document.createElement("div");
                div.setAttribute('id', 'container');

                this.target.appendChild(style);
                this.target.appendChild(div);
            }
        }

        public update(options: VisualUpdateOptions) {
            // console.log('Visual update', options);
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);

            if (options && options.dataViews && options.dataViews[0]) {
                document.getElementById('container').innerHTML = '';
                this.render(options.dataViews[0], options.viewport.width, options.viewport.height);
            }
        }

        // Render the visualization by executing all the included code.
        private render (dataView: DataView, width: number, height: number) {
            // console.log(dataView);

            // Append all code together, starting with the bridging code, then the dependencies, then the main D3 file.
            let code = this.createBridgeCode(dataView, width, height);
            code += Code.dependencies.join('');
            code += Code.script;

            // Execute and evaluate code.
            eval(code);
        }

        // Creates JavaScript code, allowing D3 code to access the data, and viewport properties.
        // Specification:

        // var pbi = {
        //     width: 0,
        //     height: 0,
        //     render: function(mapping, callback) {
        //         var meta = {
        //             "measures": [""],
        //             "categories": [""]
        //         };
        //         var data = [{}];
                             
        //         if (arguments.length < 2) {
        //             callback = mapping;
        //             mapping = null;
        //         } else {
        //             data = data.map(function(d) {
        //                 return mapping(d);
        //             });
        //         }
        //         callback(data, meta);
        //     }
        // };
        private createBridgeCode (dataView: DataView, width: number, height: number): string {
            let code = `var pbi={width:${width},height:${height},render:function(mapping,callback){`;
            code += `var meta=${JSON.stringify(Visual.extractMetadata(dataView))};`;
            code += `var data=${JSON.stringify(Visual.extractData(dataView))};`
            code += `if (arguments.length < 2) {callback=mapping;mapping=null;} else {data=data.map(function(d){return mapping(d);});}`
            code += `callback(data,meta);}};`;

            return code;
        }

        // Extract metadata, to generalize access to data.
        // Example:

        // var meta = {
        //      "measures": ["Sales"],
        //      "categories": ["Size", "Color"]
        // };
        private static extractMetadata (dataView: DataView): Metadata {
            let meta = {
                measures: [],
                categories: []
            };
            meta.measures = dataView.metadata.columns.filter(c => c.roles.measure).map(m => m.displayName);
            meta.categories = dataView.metadata.columns.filter(c => c.roles.category).map(c => c.displayName);

            return meta;
        }

        // Transform data into an array of objects, suitable for use with D3.
        private static extractData (dataView: DataView) {
            let data = [];
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