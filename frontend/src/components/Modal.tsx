"use client";

import { useState, FC, ReactNode } from "react";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CustomModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children?: ReactNode; // Add children prop
}

const CustomModal: FC<CustomModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
}) => {
	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-[#000000A3] bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4  sm:items-center sm:p-0">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4  text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
					>
						<div>
							<div className="flex items-center w-full  gap-20 justify-between border-b pb-1">
							<DialogTitle
									as="h3"
									className="text-[20px] text-center font-bold text-primaryText"
								>
									{title}
								</DialogTitle>

									<div className="flex justify-end">
								<XMarkIcon
									onClick={onClose}
									className="w-6 h-6 cursor-pointer "
								/>
							</div>
							</div>
							<div className="py-10">{children}</div>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default CustomModal;
