from flask import Flask, request
import numpy as np
from separation_axis_theorem import separating_axis_theorem

app = Flask(__name__)

def edges_of(vertices):
    edges = []
    N = len(vertices)

    for i in range(N):
        edge = vertices[(i + 1)%N] - vertices[i]
        edges.append(edge)

    return edges

def orthogonal(v):
    return np.array([-v[1], v[0]])

def is_separating_axis(o, p1, p2):
    min1, max1 = float('+inf'), float('-inf')
    min2, max2 = float('+inf'), float('-inf')

    for v in p1:
        projection = np.dot(v, o)

        min1 = min(min1, projection)
        max1 = max(max1, projection)

    for v in p2:
        projection = np.dot(v, o)

        min2 = min(min2, projection)
        max2 = max(max2, projection)

    if max1 >= min2 and max2 >= min1:
        d = min(max2 - min1, max1 - min2)
        d_over_o_squared = d/np.dot(o, o) + 1e-10
        pv = d_over_o_squared*o
        return False, pv
    else:
        return True, None

def centers_displacement(p1, p2):
    c1 = np.mean(np.array(p1), axis=0)
    c2 = np.mean(np.array(p2), axis=0)
    return c2 - c1

def collides(p1, p2):
    p1 = [np.array(v, 'float64') for v in p1]
    p2 = [np.array(v, 'float64') for v in p2]

    edges = edges_of(p1)
    edges += edges_of(p2)
    orthogonals = [orthogonal(e) for e in edges]

    push_vectors = []
    for o in orthogonals:
        separates, pv = is_separating_axis(o, p1, p2)

        if separates:
            return False, None
        else:
            push_vectors.append(pv)
    mpv =  min(push_vectors, key=(lambda v: np.dot(v, v)))

    d = centers_displacement(p1, p2)
    if np.dot(d, mpv) > 0:
        mpv = -mpv

    return True, mpv

@app.route("/", methods = ["POST"])
def run():
    points = [np.array(v, 'float64') for v in request.json["points"]]
    count = request.json["rectangles"]

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
