import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const CONTRACT_ADDR = "0x35983670a768c5451ae1d6e6d9c55e42fbe8a9a794d7aa4b9aed53618190d8d";