"use client";
import { PlaceBidWhiteIcon } from "@/assets/Icons";
import NFTCard from "@/components/Card";
import { Input } from "@/components/Input";
import Layout from "@/components/Layout";
import CustomModal from "@/components/Modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
	const [openListing, setOpenListing] = useState<boolean>(false);
	const navigate = useRouter();
	return (
		<Layout>
			<div className="bg-hero bg-no-repeat bg-cover my-10 rounded-xl border border-[#DCD4FF] lg:h-[592px] w-full  flex items-center gap-40 justify-between px-[120px]">
				<div className="flex flex-col  justify-between">
					<h1 className="text-[112px] font-satoshi text-primaryText leading-[134px]">
						Bid&Sell
					</h1>
					<p className="font-satoshi font-500  text-secondaryText py-10">
						Bid for and Sell your NFTs as Token Band Accounts.
					</p>
					<div className="flex gap-5">
						<button className="px-5 py-3 text-white bg-primary border border-primary rounded-lg">
							Explore
						</button>
						<button
							onClick={() => setOpenListing(true)}
							className="px-5 py-3 text-primary bg-transparent border border-primary rounded-lg"
						>
							List Account
						</button>
					</div>
				</div>
				<div className="flex-1">
					<img
						src="/hero-img.png"
						className="w-full  rounded-lg"
						alt="hero-img"
					/>
				</div>
			</div>

			<section>
				<h1 className="font-bold text-[32px] text-[#192648]">
					Latest Addition
				</h1>
				<div className="py-10">
					<div className="grid grid-cols-4 gap-5">
						{Array(8)
							.fill(0)
							.map((_, i) => (
								<div key={i}>
									<NFTCard route="/details" />
								</div>
							))}
					</div>
				</div>
				<button
					onClick={() => navigate.push("/marketplace")}
					className="w-full border border-primary bg-transparent text-primary rounded-lg py-2"
				>
					View All NFTs
				</button>
			</section>
			<section className="bg-hero bg-no-repeat bg-cover my-10 rounded-xl border border-[#DCD4FF] lg:h-[492px] w-full  flex items-center gap-40 justify-between px-[120px]">
				<div>
					<h1 className="bg-gradient-to-r from-[#7873F5] via-purple-500 to-[#EC77AB] bg-clip-text text-transparent font-satoshi text-[56px] font-bold leading-[67px]">
						Provide Access to NFTs as Token Band Accounts
					</h1>
					<p className="py-5 text-primaryText font-satoshi ">
						Powered by <span className="underline text-primary">Starknet</span>
					</p>
					<button className="px-5 py-3 text-white bg-primary border border-primary rounded-lg">
						Submit
					</button>
				</div>
			</section>

			<section className="flex flex-col items-center justify-between py-10">
				<h1 className="text-[112px] font-satoshi text-primaryText leading-[134px]">
					Bid&Sell
				</h1>

				<div className="flex py-5 gap-5">
					<button className="px-5 py-3 text-white bg-primary border border-primary rounded-lg">
						Explore
					</button>
					<button
						onClick={() => navigate.push("/nft")}
						className="px-5 py-3 text-primary bg-transparent border border-primary rounded-lg"
					>
						Submit
					</button>
				</div>
			</section>

			<CustomModal
				isOpen={openListing}
				onClose={() => setOpenListing(!openListing)}
				title="List Tokenbound Account"
			>
				<div>
		

					<Input placeholder="TBA Address" />

					<button
						onClick={() => setOpenListing(true)}
						className="w-full border flex items-center justify-center gap-3 border-primary bg-primary rounded-lg py-3 text-[18px] font-bold text-white mt-5"
					>
						<PlaceBidWhiteIcon color="#fff" /> Submit
					</button>
				</div>
			</CustomModal>
		</Layout>
	);
}
