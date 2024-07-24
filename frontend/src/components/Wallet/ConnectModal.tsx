import Image from "next/image";
import GenericModal from "./GenericModal";
import { Connector, useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import CustomModal from "../Modal";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const loader = ({ src }: { src: string }) => {
	return src;
};

const Wallet = ({
	name,
	alt,
	src,
	connector,
	closeModal,
}: {
	name: string;
	alt: string;
	src: string;
	connector: Connector;
	closeModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	const { connect } = useConnect();

	const isSvg = src?.startsWith("<svg");

	function handleConnectWallet(e: React.MouseEvent<HTMLButtonElement>): void {
		connect({ connector });
		closeModal(e);
		localStorage.setItem("lastUsedConnector", connector.name);
	}

	return (
		<button
			className="flex gap-4 items-center text-start p-[.2rem] border-b  px-5 py-2  hover:bg-[#FAFAFB] hover:px-5  hover:bg-outline-grey hover:rounded-[10px] transition-all cursor-pointer"
			onClick={(e) => handleConnectWallet(e)}
		>
			<div className="h-[2.2rem] w-[2.2rem] rounded-[5px]">
				{isSvg ? (
					<div
						className="h-full w-full object-cover rounded-[5px]"
						dangerouslySetInnerHTML={{
							__html: src ?? "",
						}}
					/>
				) : (
					<Image
						alt={alt}
						loader={loader}
						src={src}
						width={70}
						height={70}
						className="h-full w-full object-cover rounded-[5px]"
					/>
				)}
			</div>
			<p className="flex-1 capitalize font-satoshi">{name}</p>
		</button>
	);
};

const ConnectModal = ({ isOpen, onClose }: Props) => {
	const [animate, setAnimate] = useState(false);
	const { address } = useAccount();
  const { disconnect } = useDisconnect();

	const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setAnimate(false);
		setTimeout(() => {
			onClose();
		}, 400);
	};


 

	useEffect(() => {
		if (isOpen) {
			setAnimate(true);
		} else {
			setAnimate(false);
		}
	}, [isOpen]);
	const { connectors } = useConnect();
	return (
		<CustomModal isOpen={isOpen} onClose={onClose} title="Connect Wallet">
			{!address ? (
				<div className="flex flex-col gap-5  ">
					{connectors.map((connector, index) => (
						<Wallet
							closeModal={closeModal}
							key={connector.id || index}
							src={connector.icon.light!}
							name={connector.name}
							connector={connector}
							alt="alt"
						/>
					))}
				</div>
			) : (
				<button onClick={() => disconnect()} className="w-full py-3 border border-primary rounded-xl text-primary">Disconnect</button>
			)}
		</CustomModal>
	);
};

export default ConnectModal;
