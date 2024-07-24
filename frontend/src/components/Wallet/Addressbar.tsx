"use client";
import {
	useAccount,
	useStarkProfile,
} from "@starknet-react/core";
import { Dispatch, SetStateAction, } from "react";

const AddressBar = ({
	setOpenConnectedModal,
}: {
	setOpenConnectedModal: Dispatch<SetStateAction<boolean>>;
}) => {
	const { address } = useAccount();
	const { data: starkProfile } = useStarkProfile({
		address,
	});

	const toggleModal = () => {
		setOpenConnectedModal((prev) => !prev);
	};

	if (!address) {
		return null;
	}

	return (
		<div className="flex items-center gap-5">
			<div className="rounded-full w-12 h-12 ">
				<img src="/img-1.png" className="w-full h-full rounded-full" alt="" />
			</div>
			<button
			onClick={toggleModal}
			className="bg-primary py-2 px-4 text-white rounded-full transition duration-300"
		>
			<span>
				{address?.slice(0, 6).concat("...").concat(address?.slice(-5))}
			</span>
		</button>
		</div>
	);
};

export default AddressBar;
