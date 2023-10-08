export function pointInsidePolygon(
  polygon: [number, number][],
  point: [number, number]
): boolean {
  const [x, y] = point;
  const n = polygon.length;
  let intersections = 0;

  for (let i = 0; i < n; i++) {
    var [x1, y1] = polygon[i];
    var [x2, y2] = polygon[(i + 1) % n];

    if (
      y1 === y2 &&
      y1 === y &&
      ((x1 <= x && x <= x2) || (x2 <= x && x <= x1))
    ) {
      return true;
    }

    if (y1 > y2) {
      [y1, y2] = [y2, y1];
      [x1, x2] = [x2, x1];
    }

    if (y1 <= y && y <= y2 && x <= Math.max(x1, x2)) {
      if (y1 !== y2) {
        const xIntersect = ((y - y1) * (x2 - x1)) / (y2 - y1) + x1;
        if (x <= xIntersect) {
          intersections++;
        }
      } else if (x1 === x2 && x <= x1) {
        intersections++;
      }
    }
  }

  return intersections % 2 === 1;
}

export function getTopRight(polygon: [number, number][]) {
  var maxX = 0;
  var maxY = 100000;
  polygon.forEach((point) => {
    const [x, y] = point;
    maxX = Math.max(x, maxX);
    maxY = Math.min(y, maxY);
  });

  return [maxX, maxY];
}

export function getTopLeft(polygon: [number, number][]) {
  var maxX = 100000;
  var maxY = 100000;
  polygon.forEach((point) => {
    const [x, y] = point;
    maxX = Math.min(x, maxX);
    maxY = Math.min(y, maxY);
  });

  return [maxX, maxY];
}
