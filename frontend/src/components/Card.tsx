import Link from "next/link";
import React from "react";
interface TBAProps {
	route: string
}
const TBACard = ({route}: TBAProps) => {
	return (
		<Link href={route}>
			<div className="flex flex-col p-[16px] bg-[#F9F8FF] border border-[#DCD4FF] rounded-xl">
				<img src="/img-1.png" alt="nft" />
				<p className="text-primaryText font-bold font-satoshi text-[20px] pt-4">
					Chiko & Roko x R66
				</p>
				<div className="bg-primary space-y-3 px-3 py-3 mt-5 border border-primary rounded-lg">
					<p className="text-[#F9F8FF] font-satoshi font-normal">
						<span>Price: </span>0.188 STRK
					</p>
					<p className="text-[#B2B7C2] font-satoshi font-normal">
						<span>Highest Bid: </span>1.188 STRK
					</p>
				</div>
			</div>
		</Link>
	);
};

export default TBACard;
