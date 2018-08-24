# d3-visual-template
A generic Power BI custom visual template for rendering a D3.js data visualization.

## Prerequisites
1. Install Node.js, and have a network connection that either is public, or bypasses a proxy.
2. Navigate to the folder containing this source code: ex) `cd C:\Users\stpiebr\Projects\d3-visual-template`
3. Run `npm install -g powerbi-visuals-tools`.
4. Run `npm install`.

## Commands
To begin supplying JavaScript and CSS files, run this command and follow the instructions:
`npm run prep`

To start the visual in development mode (assuming [everything is configured](https://docs.microsoft.com/en-us/power-bi/service-custom-visuals-getting-started-with-developer-tools "Getting Started with Developer Tools")):
`npm start`

To build the visual and create the .pbiviz file within `/dist`:
`npm run build`