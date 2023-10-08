from flask import Flask, request, make_response
import json, sys

import matplotlib.pyplot as plt
import matplotlib.patches as patches

from shapely.prepared import prep
from shapely import Polygon, Point
import numpy as np

app = Flask(__name__)

polygon_points = []
with open("shape.json", "r") as file:
    polygon_points = json.loads(file.read())
    file.close()

latmin = sys.maxsize
latmax = 0
lonmin = sys.maxsize
lonmax = 0
for point in polygon_points:
    latmin = min(latmin, point[0])
    latmax = max(latmax, point[0])
    lonmin = min(lonmin, point[1])
    lonmax = max(lonmax, point[1])

def get_rectangles(resolution):
    polygon = Polygon(polygon_points)
    prepared_polygon = prep(polygon)
    hits = filter(prepared_polygon.contains, polygon_points)

    points = []
    for lat in np.arange(latmin, latmax, resolution):
        for lon in np.arange(lonmin, lonmax, resolution):
            points.append(Point((round(lat,4), round(lon,4))))

    valid_points = []
    valid_points.extend(filter(prepared_polygon.contains, points))

    rectangles = []
    for point in valid_points:
        if (
            Point(point.x + resolution, point.y) in valid_points and
            Point(point.x, point.y + resolution) in valid_points and
            Point(point.x + resolution, point.y + resolution) in valid_points
        ):
            rectangles.append([
                point.x, 
                point.y,
                resolution,
                resolution
            ])
    return rectangles

MAX_NEEDED = 500
MIN_RESOLUTION = 5
# Rectangles on 100 
ratio100 = len(get_rectangles(100))

@app.route("/", methods = ["GET"])
def run():
    needed = int(request.args["rectangles"])
    if needed > MAX_NEEDED:
        return make_response("", 401)

    resolution = int(needed / 147 * 100)
    if resolution < MIN_RESOLUTION:
        resolution = MIN_RESOLUTION

    last_rectangles = []
    rectangles = get_rectangles(resolution)

    while len(rectangles) > needed:
        resolution += 1
        last_rectangles = rectangles
        rectangles = get_rectangles(resolution)
    while len(rectangles) < needed and resolution >= MIN_RESOLUTION:
        resolution -= 1
        last_rectangles = rectangles
        rectangles = get_rectangles(resolution)
    if abs(needed - len(last_rectangles)) < abs(needed - len(rectangles)):
        rectangles = last_rectangles
    return rectangles