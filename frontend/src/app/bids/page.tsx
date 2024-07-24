"use client";
import { PlaceBidIcon, PlaceBidWhiteIcon } from "@/assets/Icons";
import Layout from "@/components/Layout";
import CustomModal from "@/components/Modal";
import React, { useState } from "react";

const BidsPage = () => {
	const [bidOpen, setBidOpen] = useState<boolean>(false);

	return (
		<Layout>
			<div className="flex flex-col items-center justify-center py-20">
				<div className="flex flex-col items-center gap-5 border-b w-full pb-5">
					<div className="w-20 h-20 ">
						<img
							className="w-full h-full rounded-2xl"
							src="/img-1.png"
							alt=""
						/>
					</div>

					<p className="text-[18px] font-bold text-[#49536E] ">
						Chiko & Roko x R66
					</p>
				</div>

				<div className="flex lg:w-[500px] items-center rounded-lg justify-between bg-[#FAFAFB] gap-5 border-b  py-3 px-2 my-5">
					<div className=" flex items-center gap-2">
						<div className="w-8 h-8 ">
							<img
								className="w-full h-full rounded-2xl"
								src="/img-1.png"
								alt=""
							/>
						</div>
						<div>
							<p className="font-satoshi text-sm font-normal text-primaryText">
								Price
							</p>
							<p className="text-[16px] font-bold text-[#192648] ">9.56 ETH</p>
						</div>
					</div>

					<p className="text-[16px] font-bold text-[#192648] ">$50,152.56</p>
				</div>
			</div>

			<div className="border rounded-lg px-5 py-5">
				{Array(10)
					.fill(0)
					.map((_, i) => (
						<div
							key={i}
							className="flex items-center justify-between py-5 border-b "
						>
							<div className="flex items-center gap-4 ">
								<div className="w-8 h-8 ">
									<img
										className="w-full h-full rounded-2xl"
										src="/hero-img.png"
										alt=""
									/>
								</div>
								<p className="font-satoshi text-base text-primaryText">
									0x2c934.............fa3f2c2.....a180
								</p>
								<div className="px-3 bg-[#F7F7F7] rounded-full py-2">
									<p className="font-satoshi text-xs font-light">
										25th July, 2023 11:23pm
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4 ">
								<p className="font-satoshi font-light text-base text-[#49536E]">
									19.56 ETH
								</p>
								<button
									onClick={() => setBidOpen(true)}
									className="px-3 bg-[#F7F7F7] border rounded-lg py-2"
								>
									<p className="font-satoshi text-xs text-[#49536E]">
										Accept Bid
									</p>
								</button>
							</div>
						</div>
					))}
			</div>

			<CustomModal
				isOpen={bidOpen}
				onClose={() => setBidOpen(!bidOpen)}
				title="You are about to accept a bid!"
			>
				<div className="pt-6">
					<div className="flex items-center gap-4 ">
						<div className="w-8 h-8 ">
							<img
								className="w-full h-full rounded-2xl"
								src="/hero-img.png"
								alt=""
							/>
						</div>
						<p className="font-satoshi text-base text-primaryText">
							0x2c934.............fa3f2c2.....a180
						</p>
					</div>

          <div className="flex w-full items-center rounded-lg justify-between bg-[#FAFAFB] gap-5 border-b  py-3 px-2 my-5">
					<div className=" flex items-center gap-2">
						<div className="w-8 h-8 ">
							<img
								className="w-full h-full rounded-2xl"
								src="/img-1.png"
								alt=""
							/>
						</div>
						<div>
							<p className="font-satoshi text-sm font-normal text-primaryText">
								Price
							</p>
							<p className="text-[16px] font-bold text-[#192648] ">9.56 ETH</p>
						</div>
					</div>

					<p className="text-[16px] font-bold text-[#192648] ">$50,152.56</p>
				</div>
					

					<button className="w-full border flex items-center justify-center gap-3 border-primary bg-primary rounded-lg py-3 text-[18px] font-bold text-white mt-5">
						<PlaceBidWhiteIcon color="#fff" /> Accept Bid
					</button>
				</div>
			</CustomModal>
		</Layout>
	);
};

export default BidsPage;
