"use client"
import { StarknetLogo, UploadIcon } from "@/assets/Icons";
import { Input } from "@/components/Input";
import Layout from "@/components/Layout";
import React from "react";

const CreateNFT = () => {
	return (
		<Layout>
			<div className="py-20">
				<h1 className="text-[#192648] text-[56px] font-satoshi text-center ">
					Submit NFT
				</h1>
				<div className="grid grid-cols-2">
					<div>
						<div className="flex flex-col space-y-10 items-center bg-[#F9F8FF] justify-center py-16 border-2 border-dashed rounded-xl ">
							<p className="text-primary text-[14px] font-satoshi ">
								PNG, GIF, WEBP, MP4 OR MP3. Max 100mb.
							</p>

							<button className="border flex items-center gap-2 border-[#CACDD5]  rounded-lg px-5 py-2 bg-white">
							<UploadIcon />	 Browse Files
							</button>
						</div>
						<div className="py-5">
							<div className="space-y-2">
								<p className="text-[#525C76] text-sm font-satoshi font-bold">
									Price
								</p>
								<Input placeholder="Enter Price" />
								<div className="rounded-lg flex items-center justify-between  px-5 py-2 bg-[#FAFAFB] w-full">
                  <div>
                    <div>
                    <StarknetLogo />
                    </div>
                    <div  className="space-y-2">
                      <p className="text-secondaryText font-normal font-satoshi">Price</p>
                      <p className="text-primaryText font-satoshi text-[18px]  font-bold">9.5 STRK</p>
                    </div>
                  </div>

                  <p className="text-primaryText font-satoshi text-[18px] font-bold">50.5 $</p>

                </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default CreateNFT;
