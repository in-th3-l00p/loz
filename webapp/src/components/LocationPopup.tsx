import React, { CSSProperties, ReactNode, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../hooks/Auth";
import Popup, { PopupButton } from "./Popup";
import { Location, User } from "../utils/types";
import { COLORS } from "../routes/maps/Map";
import api from "../utils/api";

interface UserCardProps {
    id: number;
    className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ id, className }) => {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/users/" + id)
            .then(resp => setUser(resp.data["data"]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className={"bg-transparent flex flex-row gap-2 items-center " + className}>
            <img
                className="h-14 w-14 rounded-full bg-neutral-200"
                src={user?.pfp_path}
            />
            <div className="flex flex-col justify-around">
                <label className="font-semibold text-lg text-black">{user?.name}</label>
                <label className="font-light text-black">{user?.email}</label>
            </div>
        </div>
    );
}

interface LocationPopupTitleProps {
    backgroundColor: string;
    color: string;
    children?: ReactNode;
}

const LocationPopupTitle: React.FC<LocationPopupTitleProps> = ({ backgroundColor, color, children }) => {
    return (
        <div
            className="px-4 py-2 text-4xl font-semibold"
            style={{ backgroundColor: backgroundColor, color: color }}
        >
            {children}
        </div>
    );
}

export const LOCATION_STATUS = {
    available: "available",
    unavailable: "unavailable",
    winner: "winner",
    loser: "loser",
    claimed: "claimed",
};

interface LocationPopupProps {
    className?: string;
    style?: CSSProperties;
    x: number;
    y: number;
    direction: string;
    location: Location;
    setLocation: React.Dispatch<React.SetStateAction<Location | null>>;
}

const LocationPopup: React.FC<LocationPopupProps> = ({
    className,
    x, y,
    direction,
    style,
    location,
    setLocation,
}) => {
    const { id } = useParams();
    const auth = useContext(AuthContext);

    return (
        <>
            <Popup
                x={x}
                y={y}
                direction={direction}
                className="bg-white z-[10]"
            >
                {/* Uncalimed locations */}
                {location.claimed_by == null && (
                    <div className="flex flex-col">
                        {location.status == LOCATION_STATUS.available && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.available.primary}
                                    color={COLORS.available.text}
                                >
                                    Lozul: {location.id}
                                </LocationPopupTitle>
                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor:
                                            COLORS.available.secondary,
                                        color: COLORS.available.text,
                                    }}
                                >
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    <PopupButton
                                        className="mt-6"
                                        onClick={() => {}
                                            // addToCart(location.id, id)
                                        }
                                        color={COLORS.available.text}
                                        backgroundColor={
                                            COLORS.available.primary
                                        }
                                    >
                                        Adauga in cos
                                    </PopupButton>
                                </div>
                            </>
                        )}

                        {location.status == LOCATION_STATUS.unavailable && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.unavailable.primary}
                                    color={COLORS.unavailable.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>
                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor:
                                            COLORS.unavailable.secondary,
                                        color: COLORS.unavailable.text,
                                    }}
                                >
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">Pret: {location.price}</label>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Claimed by another user */}
                {location.claimed_by && location.claimed_by !== auth.user!.id && (
                    <div className="flex flex-col">
                        {location.status == LOCATION_STATUS.claimed && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.claimed.primary}
                                    color={COLORS.claimed.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>
                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor:
                                            COLORS.claimed.secondary,
                                        color: COLORS.claimed.text,
                                    }}
                                >
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    {location.claimed_by && (
                                        <UserCard
                                            id={location.claimed_by}
                                            className="pt-6"
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {location.status == LOCATION_STATUS.winner && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.winner.primary}
                                    color={COLORS.winner.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>

                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor:
                                            COLORS.winner.secondary,
                                        color: COLORS.winner.text,
                                    }}
                                >
                                    <div className="w-full h-0 pb-[60%] relative">
                                        <img
                                            className="absolute left-0 top-0 w-full h-full object-cover"
                                            src={location.image_path}
                                            alt="location"
                                        />
                                    </div>
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    {location.claimed_by && (
                                        <UserCard
                                            id={location.claimed_by}
                                            className="pt-6"
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {location.status == LOCATION_STATUS.loser && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.loser.primary}
                                    color={COLORS.loser.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>

                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor: COLORS.loser.secondary,
                                        color: COLORS.loser.text,
                                    }}
                                >
                                    <div className="w-full h-0 pb-[60%] relative">
                                        <img
                                            className="absolute left-0 top-0 w-full h-full object-cover"
                                            src={location.image_path}
                                            alt="location"
                                        />
                                    </div>
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">
                                        Premiu: {location.winner_text}
                                    </label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    {location.claimed_by && (
                                        <UserCard
                                            id={location.claimed_by}
                                            className="pt-6"
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Current user location */}
                {location.claimed_by === auth.user!.id && (
                    <div className="flex flex-col">
                        {location.status == LOCATION_STATUS.claimed && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.claimed.primary}
                                    color={COLORS.claimed.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>
                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor:
                                            COLORS.claimed.secondary,
                                        color: COLORS.claimed.text,
                                    }}
                                >
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    {location.claimed_by && (
                                        <UserCard
                                            id={location.claimed_by}
                                            className="pt-6"
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {location.status == LOCATION_STATUS.winner && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.winner.primary}
                                    color={COLORS.winner.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>

                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor:
                                            COLORS.winner.secondary,
                                        color: COLORS.winner.text,
                                    }}
                                >
                                    <div className="w-full h-0 pb-[60%] relative">
                                        <img
                                            className="absolute left-0 top-0 w-full h-full object-cover"
                                            src={location.image_path}
                                            alt="location"
                                        />
                                    </div>
                                    <PopupButton
                                        onClick={() => {}}
                                        color={COLORS.winner.text}
                                        backgroundColor={COLORS.winner.primary}
                                    >
                                        Schimba imaginea
                                    </ PopupButton>
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    {location.claimed_by && (
                                        <UserCard
                                            id={location.claimed_by}
                                            className="pt-6"
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {location.status == LOCATION_STATUS.loser && (
                            <>
                                <LocationPopupTitle
                                    backgroundColor={COLORS.loser.primary}
                                    color={COLORS.loser.text}
                                >
                                    Lozul: {location.id}
                                </ LocationPopupTitle>

                                <div
                                    className="flex flex-col text-semibold text-lg p-4"
                                    style={{
                                        backgroundColor: COLORS.loser.secondary,
                                        color: COLORS.loser.text,
                                    }}
                                >
                                    <div className="w-full h-0 pb-[60%] relative">
                                        <img
                                            className="absolute left-0 top-0 w-full h-full object-cover"
                                            src={location.image_path}
                                            alt="location"
                                        />
                                    </div>
                                    <PopupButton
                                        onClick={() => {}}
                                        color={COLORS.loser.text}
                                        backgroundColor={COLORS.loser.primary}
                                    >
                                        Schimba imaginea
                                    </PopupButton>
                                    <label className="text-black">Status: {location.status}</label>
                                    <label className="text-black">
                                        Premiu: {location.winner_text}
                                    </label>
                                    <label className="text-black">Pret: {location.price}</label>
                                    {location.claimed_by && (
                                        <UserCard
                                            id={location.claimed_by}
                                            className="pt-6"
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Popup>
            <div
                className="bg-black/20 z-[5] absolute left-0 top-0 right-0 bottom-0"
                onClick={() => setLocation(null)}
            />
        </>
    );
};

export default LocationPopup;
