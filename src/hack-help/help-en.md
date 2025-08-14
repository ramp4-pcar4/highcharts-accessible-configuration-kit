# Getting Started

The Highcharts Accessible Configuration Kit (HACK) is a tool to help you easily create and edit [highcharts](https://www.highcharts.com/). You can upload data in a datatable format through a CSV, XLS, or XLSX file or by pasting the data directly. You can also import an existing highcharts using a JSON file on the side menu. For a multi-series chart, this is an example of a valid datatable format:

<p style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 14px; margin-top: 10px;margin-bottom: 10px;">
Year, Company 1, Company 2, Company 3, Company 4<br>
2020,59,24,58,47<br>
2021,83,79,88,83.33<br>
2022,65,72,75,70.66<br>
2023,40,56,21,65
</p>

which corresponds to this chart:

![Sample chart](samplechart.png)

The first column should correspond to the x-axis category followed by its labels. By default, when you import data it will automatically be displayed as a line chart, which you can later change in the templates tab.

Note that different chart types may require specific data formats for accurate visualizations. For a single series chart or a pie chart there should only be one column. This is an example of a valid datatable for a single series/pie chart:

<p style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 14px; margin-top: 10px;margin-bottom: 10px;">
"Sport","Responses" <br>
"Badminton",4 <br>
"Volleyball",24 <br>
"Other",9 <br>
"Soccer",21 <br>
"Basketball",42
</p>

When switched to a pie chart this looks like:
![Sample pie chart](piechart.png)


# Datatable


After uploading your data, you can navigate to the datatable view to find a prepopulated table displayed alongside a preview of the chart. On this page, you can edit the datatable values and manipulate the rows and columns. The chart preview will update in real time.

![Sample datatable](datatable.png)


# Templates


In the templates tab, you can choose the type of chart you want to represent your dataset with. For a single-type chart, you can choose between area chart, bar chart, column chart, line chart, pie chart, spline chart, and scatter plot.

Line charts are great for representing changes and trends over time.
![Sample line chart](linechart.png)

Similarly, spline charts are line charts that have smooth curves instead of straight line segments.
![Sample spline chart](splinechart.png)

Area Charts are typically used to graph trends over time and show magnitude or volume.
![Sample area chart](areachart.png)

Bar and column charts are simple and effective for comparing different categories.
![Sample bar chart](barchart.png)
![Sample column chart](columnchart.png)

Pie charts are good for representing percentages and comparing parts that make up a whole.
![Sample pie chart](piechart.png)

#### Hybrid Charts

If you have more than one data series, you can also represent your data in the form of a hybrid chart— two charts in one. Choose a second template to represent your data with and select the data series you want to transfer to the second template.

![Sample hybrid chart](hybridchart.png)


# Customization

There are many customization options in the <span style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 2px 8px;">Customize Chart</span> section:

<table style="border:1px solid #000000ff;">
  <tr style="border:1px solid #000000ff;">
    <th style="border:1px solid #000000ff; text-align:left; padding: 8px; background:#e5e7eb;">Tab name</th>
    <th style="text-align:left; padding: 8px; background:#e5e7eb;">Options</th>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Chart titles</td>
    <td style="padding: 8px;">Change the chart title or sub-title</td>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Data series</td>
    <td style="padding: 8px;">Customize colours and line, series or point types</td>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Axes</td>
    <td style="padding: 8px;">Change the titles of the chart axes</td>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Advanced</td>
    <td style="padding: 8px;">Edit the chart configuration JSON file directly, all of the configurable properties can be found
    <a
      href="https://raw.githubusercontent.com/ramp4-pcar4/highcharts-accessible-configuration-kit/main/HighchartsSchema.json"
      class="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
    here
    </a>
    </td>
  </tr>
</table>


# Exporting


On the side menu, you can easily export your highcharts configuration as a JSON file. JSON files can be reimported and edited again later.
In the context menu on any chart preview, you may print your chart or download it as a PNG, JPEG, PDF, SVG, CSV, or XLS. Note that saving as a CSV or XLS means only the datatable is saved, not the template or customization.

![Sample chart](contextmenu.gif)


# Accessibility

This tool is WCAG 2.1 "AA" compliant. It is fully keyboard navigable and mobile friendly.