import { Logo } from "@/assets/Icons";
import React, { useState } from "react";
import { Input } from "./Input";
import Link from "next/link";
import { useAccount } from "@starknet-react/core";
import AddressBar from "./Wallet/Addressbar";
import ConnectModal from "./Wallet/ConnectModal";

const Navbar = () => {
	const { address } = useAccount();
	const [openConnectedModal, setOpenConnectedModal] = useState<boolean>(false);

	const toggleUserModal = () => {
		setOpenConnectedModal((prev) => !prev);
	};
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-5">
				<Link href="/">
					<Logo />
				</Link>
				<div className="w-[400px]">
					<Input className="w-full " placeholder="Search TBA" />
				</div>
				<Link
					href="/marketplace"
					className="font-bold font-base font-satoshi text-secondaryText"
				>
					{" "}
					Explore
				</Link>
				<Link
					href="/tbas"
					className="font-bold font-base font-satoshi text-secondaryText"
				>
					TBAs
				</Link>
			</div>
			{!address ? (
				<button
					onClick={toggleUserModal}
					className="bg-gradient-to-r from-[#7873F5] to-[#EC77AB] text-white px-5 py-2 rounded-lg"
				>
					Connect Wallet
				</button>
			) : (
				<AddressBar setOpenConnectedModal={setOpenConnectedModal} />
			)}
			<ConnectModal isOpen={openConnectedModal} onClose={toggleUserModal} />
		</div>
	);
};

export default Navbar;
