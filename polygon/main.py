from flask import Flask, request
import numpy as np
from separation_axis_theorem import separating_axis_theorem
import json

app = Flask(__name__)

@app.route("/", methods = ["POST"])
def run():
    points = []
    with open("shape.json", "r") as file:
        points = [np.array(v, 'float64') for v in json.loads(file.read())]
        file.close()
    count = float(request.json["rectangles"])

    startX, startY = points[0]
    width, height = (0, 0)
    for point in points:
        width = max(width, point[0])
        height = max(height, point[1])
        startX = min(startX, point[0])
        startY = min(startY, point[1])
    width -= startX 
    height -= startY
    sarea = width * height / count
    swidth = sarea * 0.03
    sheight = sarea / swidth

    rectangles = []
    for x in range(round(width / swidth) + 2):
        for y in range(round(height / sheight) + 2):
            rx = startX - swidth + x * swidth
            ry = startY - sheight + y * sheight
            rpolygon = [
                [rx, ry], [rx, ry + sheight], [rx + swidth, ry], [rx + swidth, ry + sheight]
            ]
            if separating_axis_theorem(points, rpolygon):
                rectangles.append([[ rx, ry, swidth, sheight ], 1])
    return [rectangle[0] for rectangle in rectangles]
