/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var D3;
            (function (D3) {
                D3.deps = "var d3_sankey=function(o){var r={},c=24,i=8,f=[1,1],a=[],s=[];function t(){function r(n,r){return n.source.y-r.source.y}function t(n,r){return n.target.y-r.target.y}a.forEach(function(n){n.sourceLinks.sort(t),n.targetLinks.sort(r)}),a.forEach(function(n){var r=0,t=0;n.sourceLinks.forEach(function(n){n.sy=r,r+=n.dy}),n.targetLinks.forEach(function(n){n.ty=t,t+=n.dy})})}function y(n){return n.y+n.dy/2}function h(n){return n.value}return r.nodeWidth=function(n){return arguments.length?(c=+n,r):c},r.nodePadding=function(n){return arguments.length?(i=+n,r):i},r.nodes=function(n){return arguments.length?(a=n,r):a},r.links=function(n){return arguments.length?(s=n,r):s},r.size=function(n){return arguments.length?(f=n,r):f},r.layout=function(n){return a.forEach(function(n){n.sourceLinks=[],n.targetLinks=[]}),s.forEach(function(n){var r=n.source,t=n.target;\"number\"==typeof r&&(r=n.source=a[n.source]),\"number\"==typeof t&&(t=n.target=a[n.target]),r.sourceLinks.push(n),t.targetLinks.push(n)}),a.forEach(function(n){n.value=Math.max(d3.sum(n.sourceLinks,h),d3.sum(n.targetLinks,h))}),function(){var r,n=a,t=0;for(;n.length;)r=[],n.forEach(function(n){n.x=t,n.dx=c,n.sourceLinks.forEach(function(n){r.push(n.target)})}),n=r,++t;e=t,a.forEach(function(n){n.sourceLinks.length||(n.x=e-1)}),u=(o-c)/(t-1),a.forEach(function(n){n.x*=u});var u;var e}(),function(n){var r=d3.nest().key(function(n){return n.x}).sortKeys(d3.ascending).entries(a).map(function(n){return n.values});t=d3.min(r,function(n){return(f[1]-(n.length-1)*i)/d3.sum(n,h)}),r.forEach(function(n){n.forEach(function(n,r){n.y=r,n.dy=n.value*t})}),s.forEach(function(n){n.dy=n.value*t}),c();var t;for(var u=1;0<n;--n)o(u*=.99),c(),e(u),c();function e(t){function u(n){return y(n.source)*n.value}r.forEach(function(n,r){n.forEach(function(n){if(n.targetLinks.length){var r=d3.sum(n.targetLinks,u)/d3.sum(n.targetLinks,h);n.y+=(r-y(n))*t}})})}function o(t){function u(n){return y(n.target)*n.value}r.slice().reverse().forEach(function(n){n.forEach(function(n){if(n.sourceLinks.length){var r=d3.sum(n.sourceLinks,u)/d3.sum(n.sourceLinks,h);n.y+=(r-y(n))*t}})})}function c(){function c(n,r){return n.y-r.y}r.forEach(function(n){var r,t,u,e=0,o=n.length;for(n.sort(c),u=0;u<o;++u)r=n[u],0<(t=e-r.y)&&(r.y+=t),e=r.y+r.dy+i;if(0<(t=e-i-f[1]))for(e=r.y-=t,u=o-2;0<=u;--u)r=n[u],0<(t=r.y+r.dy+i-e)&&(r.y-=t),e=r.y})}}(n),t(),r},r.relayout=function(){return t(),r},r.link=function(){var f=.5;function r(n){var r=n.source.x+n.source.dx,t=n.target.x,u=d3.interpolateNumber(r,t),e=u(f),o=u(1-f),c=n.source.y+n.sy+n.dy/2,i=n.target.y+n.ty+n.dy/2;return\"M\"+r+\",\"+c+\"C\"+e+\",\"+c+\" \"+o+\",\"+i+\" \"+t+\",\"+i}return r.curvature=function(n){return arguments.length?(f=+n,r):f},r},r};";
                D3.script = "var width=pbi.width,height=pbi.height,margin={top:10,right:10,bottom:10,left:10},vis=d3.select(\"#chart\").attr(\"width\",width).attr(\"height\",height).append(\"g\").attr(\"class\",\"vis\").attr(\"width\",width).attr(\"height\",height);width=width-margin.left-margin.right,height=height-margin.top-margin.bottom;var units=\"Units\",formatNumber=d3.format(\",.0f\"),format=function(t){return formatNumber(t)+\" \"+units},color=d3.scale.category20(),svg=vis.append(\"g\").attr(\"transform\",\"translate(\"+margin.left+\",\"+margin.top+\")\"),graph={nodes:[],links:[]},uniqueNodes=[],accessor=function(t){var e,n=[];for(e in t)n.push(e);return{source:t[n[0]],target:t[n[1]],amount:+t[n[2]]}};pbi.dsv(accessor,function(t){t.forEach(function(t){var e=t.amount;0!==e&&(graph.nodes.push({name:t.source}),graph.nodes.push({name:t.target}),graph.links.push({source:t.source,target:t.target,value:e}),-1===uniqueNodes.indexOf(t.source)&&uniqueNodes.push(t.source),-1===uniqueNodes.indexOf(t.target)&&uniqueNodes.push(t.target))})});var paddingSize=10;paddingSize=8<=uniqueNodes.length?10:6<=uniqueNodes.length?30:4<=uniqueNodes.length?50:70;var sankey=d3_sankey(width).nodeWidth(20).nodePadding(paddingSize).size([width,height]),path=sankey.link();graph.nodes=d3.keys(d3.nest().key(function(t){return t.name}).map(graph.nodes)),graph.links.forEach(function(t,e){graph.links[e].source=graph.nodes.indexOf(graph.links[e].source),graph.links[e].target=graph.nodes.indexOf(graph.links[e].target)}),graph.nodes.forEach(function(t,e){graph.nodes[e]={name:t}}),sankey.nodes(graph.nodes).links(graph.links).layout(32);var link=svg.append(\"g\").selectAll(\".link\").data(graph.links).enter().append(\"path\").attr(\"class\",\"statcan_vis_ext_sankeychart_link\").attr(\"d\",path).style(\"stroke-width\",function(t){return Math.max(1,t.dy)}).sort(function(t,e){return e.dy-t.dy});link.append(\"title\").text(function(t){return t.source.name+\" -> \"+t.target.name+\":\\n\"+format(t.value)});var node=svg.append(\"g\").selectAll(\".node\").data(graph.nodes).enter().append(\"g\").attr(\"class\",\"statcan_vis_ext_sankeychart_node\").attr(\"transform\",function(t){return\"translate(\"+t.x+\",\"+t.y+\")\"}).call(d3.behavior.drag().origin(function(t){return t}).on(\"dragstart\",function(){this.parentNode.appendChild(this)}).on(\"drag\",dragmove));function dragmove(t){d3.select(this).attr(\"transform\",\"translate(\"+t.x+\",\"+(t.y=Math.max(0,Math.min(height-t.dy,d3.event.y)))+\")\"),sankey.relayout(),link.attr(\"d\",path)}node.append(\"rect\").attr(\"height\",function(t){return t.dy}).attr(\"width\",sankey.nodeWidth()).style(\"fill\",function(t){return t.color=color(t.name.replace(/ .*/,\"\"))}).style(\"stroke\",function(t){return d3.rgb(t.color).darker(2)}).append(\"title\").text(function(t){return t.name+\": \\n\"+format(t.value)}),node.append(\"text\").attr(\"font-family\",\"sans-serif\").attr(\"font-size\",\"12px\").attr(\"x\",-6).attr(\"y\",function(t){return t.dy/2}).attr(\"dy\",\".35em\").attr(\"text-anchor\",\"end\").attr(\"transform\",null).text(function(t){return t.name}).filter(function(t){return t.x<width/2}).attr(\"x\",6+sankey.nodeWidth()).attr(\"text-anchor\",\"start\");";
                D3.style = ".statcan_vis_ext_sankeychart_node rect{cursor:move;fill-opacity:.9;shape-rendering:crispEdges}.statcan_vis_ext_sankeychart_node text{pointer-events:none;text-shadow:0 1px 0 #fff}.statcan_vis_ext_sankeychart_link{fill:none;stroke:#000;stroke-opacity:.2}.statcan_vis_ext_sankeychart_link:hover{stroke-opacity:.5}.statcan_vis_ext_sankeychart_title{font-family:sans-serif;font-size:12pt}";
            })(D3 = utils.D3 || (utils.D3 = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A;
            (function (d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A) {
                "use strict";
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                var VisualSettings = (function (_super) {
                    __extends(VisualSettings, _super);
                    function VisualSettings() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.dataPoint = new dataPointSettings();
                        return _this;
                    }
                    return VisualSettings;
                }(DataViewObjectsParser));
                d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.VisualSettings = VisualSettings;
                var dataPointSettings = (function () {
                    function dataPointSettings() {
                        // Default color
                        this.defaultColor = "";
                        // Show all
                        this.showAllDataPoints = true;
                        // Fill
                        this.fill = "";
                        // Color saturation
                        this.fillRule = "";
                        // Text Size
                        this.fontSize = 12;
                    }
                    return dataPointSettings;
                }());
                d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.dataPointSettings = dataPointSettings;
            })(d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A = visual.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A || (visual.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A;
            (function (d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A) {
                "use strict";
                var Visual = (function () {
                    function Visual(options) {
                        console.log('Visual constructor', options);
                        this.target = options.element;
                        this.updateCount = 0;
                        if (typeof document !== "undefined") {
                            var new_p = document.createElement("p");
                            var s = document.createElement("script");
                            s.appendChild(document.createTextNode("console.log('Hello World');"));
                            new_p.appendChild(document.createTextNode("Update counting:"));
                            new_p.setAttribute('id', 'name');
                            var new_em = document.createElement("em");
                            this.textNode = document.createTextNode(this.updateCount.toString());
                            new_em.appendChild(this.textNode);
                            new_p.appendChild(new_em);
                            this.target.appendChild(new_p);
                            this.target.appendChild(s);
                        }
                        eval("document.getElementById('name').innerHTML = 'Hello there';console.log('Hello World');");
                        // console.log(Code.deps);
                        // console.log(Code.script);
                        // console.log(Code.style);
                    }
                    Visual.prototype.update = function (options) {
                        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                        console.log('Visual update', options);
                        if (typeof this.textNode !== "undefined") {
                            this.textNode.textContent = (this.updateCount++).toString();
                        }
                    };
                    Visual.parseSettings = function (dataView) {
                        return d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.VisualSettings.parse(dataView);
                    };
                    /**
                     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
                     * objects and properties you want to expose to the users in the property pane.
                     *
                     */
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        return d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.VisualSettings.enumerateObjectInstances(this.settings || d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.VisualSettings.getDefault(), options);
                    };
                    return Visual;
                }());
                d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.Visual = Visual;
            })(d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A = visual.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A || (visual.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A_DEBUG = {
                name: 'd3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A_DEBUG',
                displayName: 'D3VisualTemplate',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '2.1.0',
                create: function (options) { return new powerbi.extensibility.visual.d3VisualTemplate34F9EC7F64FF4B919F604D56CDE4B51A.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map