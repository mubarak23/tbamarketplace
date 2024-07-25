import Link from "next/link";
import React from "react";
interface TBAProps {
	route: string;
	title: string;
	amount?: number;
	seller: string;
	lisiting_id: number;
}

const TBACard = ({ route, title, seller, amount, lisiting_id }: TBAProps) => {
	return (
		<Link href={`${route}/${lisiting_id}`}>
			<div className="flex flex-col p-[16px] bg-[#F9F8FF] border border-[#DCD4FF] rounded-xl">
				<img src="/img-1.png" alt="nft" />
				<p className="text-primaryText font-bold font-satoshi text-[16px] pt-4">
				 TBA: 0x{title?.slice(0, 5).concat("...").concat(title?.slice(-5))}
				</p>
				<div className="bg-primary space-y-3 px-3 py-3 mt-5 border border-primary rounded-lg">
					<p className="text-[#F9F8FF] font-satoshi font-normal">
						<span>Price: </span>
						{amount} STRK
					</p>
					<p className="text-[#B2B7C2] font-satoshi font-normal">
						<span>Seller: </span>
						0x{seller?.slice(0, 5).concat("...").concat(seller?.slice(-5))}
					</p>
				</div>
			</div>
		</Link>
	);
};

export default TBACard;
