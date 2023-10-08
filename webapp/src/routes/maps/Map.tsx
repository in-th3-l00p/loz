import React, { useContext, useEffect, useRef, useState } from "react";
import { Map, Location } from "../../utils/types";
import api, { BACKEND } from "../../utils/api";
import { useParams } from "react-router-dom";
import { getTopLeft, getTopRight, pointInsidePolygon } from "../../utils/geometry";
import AuthContext from "../../hooks/Auth";
import LocationPopup from "../../components/LocationPopup";

const MAP_SRC = "/tshirt.jpeg";
const MAP_WIDTH = 728;
const MAP_HEIGHT = 721;
export const COLORS = {
  unavailable: { primary: "#b3b3b3", secondary: "#d9d9d9", text: "black" },
  available: { primary: "#02bf63", secondary: "#7eda57", text: "white" },
  winner: { primary: "#ff914d", secondary: "#ffbd59", text: "white" },
  loser: { primary: "#ff3131", secondary: "#ff5758", text: "white" },
  claimed: { primary: "#0dc0e0", secondary: "#5de1e6", text: "white" },
};


const MapDisplay = () => {
    const params = useParams();
    const auth = useContext(AuthContext);
    const [map, setMap] = useState<Map>();
    const [loading, setLoading] = useState(true);

    const canvasRef = useRef(null);
    const [popupX, setPopupX] = useState(0);
    const [popupY, setPopupY] = useState(0);
    const [popupDirection, setPopupDirection] = useState("left");
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    function drawPolygon(polygon: [number, number][], context: CanvasRenderingContext2D) {
        context.beginPath();
        for (let i = 1; i < polygon.length; i++)
            context.lineTo(polygon[i][0], polygon[i][1]);
        context.lineTo(polygon[0][0], polygon[0][1]);
        context.lineWidth = 5;
        context.closePath();
        context.stroke();
    };

    function fillPolygon(polygon: [number, number][], context: CanvasRenderingContext2D) {
        context.beginPath();
        for (let i = 1; i < polygon.length; i++) {
            context.lineTo(polygon[i][0], polygon[i][1]);
        }
        context.lineTo(polygon[0][0], polygon[0][1]);
        context.closePath();
        context.fill();
    };

    function drawImage(polygon: [number, number][], context: CanvasRenderingContext2D, image: HTMLImageElement) {
        const width = polygon[1][0] - polygon[3][0];
        const height = polygon[3][1] - polygon[1][1];
        const x = polygon[0][0];
        const y = polygon[0][1];
        context.drawImage(image, x, y, width, height);
    };


    function drawMap() {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        canvas.width = MAP_WIDTH;
        canvas.height = MAP_HEIGHT;

        const mapImage = new Image();
        mapImage.src = MAP_SRC;
        context.drawImage(mapImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);
        map?.locations!.forEach((shape: Location) => {
            if (shape.claimed_by === auth.user!.id) {
                context.strokeStyle = "Green";
            } else if (shape.status === "winner" || shape.status === "loser") {
                context.strokeStyle = "Red";
            } else if (shape.status === "unavailable") {
                context.strokeStyle = "Gray";
            } else if (shape.status === "claimed") {
                context.strokeStyle = COLORS.claimed.secondary;
            }
            drawPolygon(shape.points, context);
            context.strokeStyle = "Black";

            if (shape.image_path) {
                const image = new Image();
                image.src = BACKEND + shape.image_path;
                drawImage(shape.points, context, image);
            }
        });
    };

    function handleCanvasClick(e: any) {
        const canvas: any = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const multiplierX = rect.width / MAP_WIDTH;
        const multiplierY = rect.height / MAP_HEIGHT;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        console.log(map?.locations);
        map?.locations!.forEach((area: Location) => {
            if (pointInsidePolygon(area.points, [x / multiplierX, y / multiplierY,])) {
                console.log(area.points);
                console.log(x / multiplierX, y / multiplierY);
                if (x > rect.width / 2) {
                    setPopupDirection("left");
                    const [maxX, maxY] = getTopLeft(area.points);
                    setPopupX(maxX * multiplierX + rect.left - 25);
                    setPopupY(maxY * multiplierY + rect.top);
                } else {
                    setPopupDirection("right");
                    const [maxX, maxY] = getTopRight(area.points);
                    setPopupX(maxX * multiplierX + rect.left + 25);
                    setPopupY(maxY * multiplierY + rect.top);
                }

                setSelectedLocation(area);
            }
        });
    };


    useEffect(() => {
        api.get("/api/maps/" + params.id)
            .then(resp => setMap(resp.data["data"]))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        if (canvasRef.current && !loading) {
            drawMap();
        }
    }, [canvasRef.current, loading]);

    if (loading)
        return <p>loading...</p>
    return (
        <section className="px-4 md:px-10 lg:px-32">
            {/* display data */}
            <h2 className={"text-3xl font-bold py-10"}>Harta: {map?.name}</h2>
            <canvas
                className="w-[75vw] mx-auto h-[75vw] landscape:w-[75vh] landscape:h-[75vh] border"
                ref={canvasRef}
                onClick={handleCanvasClick}
            ></canvas>
            {selectedLocation ? (
                <LocationPopup
                    x={popupX}
                    y={popupY}
                    direction={popupDirection}
                    location={selectedLocation}
                    setLocation={setSelectedLocation}
                />
            ) : (
                <></>
            )}
        </section>
    );
}

export default MapDisplay;