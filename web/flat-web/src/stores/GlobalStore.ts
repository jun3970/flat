import { Region } from "flat-components";
import { autoPersistStore } from "./utils";
import { LoginProcessResult } from "../api-middleware/flatServer";
import type { UID } from "agora-rtc-sdk-ng";

// clear storage if not match
const LS_VERSION = 1;

export type UserInfo = LoginProcessResult;

/**
 * Properties in Global Store are persisted and shared globally.
 */
export class GlobalStore {
    /**
     * Show tooltips for classroom record hints.
     * Hide it permanently if user close the tooltip.
     */
    public isShowRecordHintTips = true;
    public isShowGuide = false;
    public isTurnOffDeviceTest = false;
    public userInfo: UserInfo | null = null;
    public whiteboardRoomUUID: string | null = null;
    public whiteboardRoomToken: string | null = null;
    public region: Region | null = null;
    public rtcToken: string | null = null;
    public rtcUID: number | null = null;
    public rtcShareScreen: {
        uid: number;
        token: string;
    } | null = null;
    public rtmToken: string | null = null;
    public lastLoginCheck: number | null = null;

    public get userUUID(): string | undefined {
        return this.userInfo?.userUUID;
    }

    public get userName(): string | undefined {
        return this.userInfo?.name;
    }

    public constructor() {
        autoPersistStore({ storeLSName: "GlobalStore", store: this, version: LS_VERSION });
    }

    public updateUserInfo = (userInfo: UserInfo): void => {
        this.userInfo = userInfo;
    };

    public updateToken = (
        config: Partial<
            Pick<
                GlobalStore,
                | "whiteboardRoomUUID"
                | "whiteboardRoomToken"
                | "rtcToken"
                | "rtmToken"
                | "rtcUID"
                | "rtcShareScreen"
                | "region"
            >
        >,
    ): void => {
        const keys = [
            "whiteboardRoomUUID",
            "whiteboardRoomToken",
            "rtcToken",
            "rtmToken",
            "rtcUID",
            "rtcShareScreen",
            "region",
        ] as const;
        for (const key of keys) {
            const value = config[key];
            if (value !== null && value !== undefined) {
                this[key] = value as any;
            }
        }
    };

    public logout = (): void => {
        this.userInfo = null;
    };

    public hideRecordHintTips = (): void => {
        this.isShowRecordHintTips = false;
    };

    public toggleDeviceTest = (): void => {
        this.isTurnOffDeviceTest = !this.isTurnOffDeviceTest;
    };

    public isShareScreenUID = (uid: UID): boolean => {
        return this.rtcShareScreen?.uid === Number(uid);
    };

    public updateShowGuide = (showGuide: boolean): void => {
        this.isShowGuide = showGuide;
    };
}

export const globalStore = new GlobalStore();
