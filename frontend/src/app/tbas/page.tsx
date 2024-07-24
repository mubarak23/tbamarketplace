
"use client"
import NFTCard from "@/components/Card";
import Layout from "@/components/Layout";
import React, { useState } from "react";

const Bids = () => {
	const [active, setActiveTab] = useState<number>(1);

	const tabs = [
		{
			id: 1,
			label: "Open Bids",
		},

		{
			id: 2,
			label: "Closed Bids",
		},
	];
	return (
		<Layout>
			<div className="py-10">
				<h1 className="text-[#192648] text-[56px] font-satoshi text-center ">
				Requested TBAs
				</h1>

				<div className="flex items-center justify-center cursor-pointer py-10">
					{tabs.map(({ label, id }) => (
						<div
							key={id}
							className={`px-5 py-3 ${
								active == id ? "bg-primary rounded-md" : "bg-[#F5F6F7]"
							}`}
							onClick={() => setActiveTab(id)}
						>
							<p
								className={` text-sm ${
									active == id ? "text-white" : "#969799"
								}`}
							>
								{label}
							</p>
						</div>
					))}
				</div>

        <div className="py-10">
					<div className="grid grid-cols-4 gap-5">
						{Array(8)
							.fill(0)
							.map((_, i) => (
								<div key={i}>
									<NFTCard route="/bids" />
								</div>
							))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Bids;
