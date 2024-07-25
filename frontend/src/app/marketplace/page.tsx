"use client";
import React, { useState } from "react";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItems,
} from "@headlessui/react";
import { filters } from "./data";
import {
	ChevronDownIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/16/solid";
import Layout from "@/components/Layout";
import NFTCard from "@/components/Card";
import useListingHook from "@/components/hooks/useListing";
import OrbitProgress from "react-loading-indicators/OrbitProgress";

const MarketPlace = () => {

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
	const { listings, isLoading } = useListingHook();

	return (
		<Layout>
			<div className="bg-white">
				<div>
					<Dialog
						open={mobileFiltersOpen}
						onClose={setMobileFiltersOpen}
						className="relative z-40 lg:hidden"
					>
						<DialogBackdrop
							transition
							className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
						/>

						<div className="fixed inset-0 z-40 flex">
							<DialogPanel
								transition
								className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
							>
								<div className="flex items-center justify-between px-4">
									<h2 className="text-lg font-medium text-gray-900">Filters</h2>
									<button
										type="button"
										onClick={() => setMobileFiltersOpen(false)}
										className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
									>
										<span className="sr-only">Close menu</span>
										<XMarkIcon aria-hidden="true" className="h-6 w-6" />
									</button>
								</div>

								<form className="mt-4">
									{filters.map((section) => (
										<Disclosure
											key={section.name}
											as="div"
											className="border-t border-gray-200 pb-4 pt-4"
										>
											<fieldset>
												<legend className="w-full px-2">
													<DisclosureButton className="group flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
														<span className="text-sm font-medium text-gray-900">
															{section.name}
														</span>
														<span className="ml-6 flex h-7 items-center">
															<ChevronDownIcon
																aria-hidden="true"
																className="h-5 w-5 rotate-0 transform group-data-[open]:-rotate-180"
															/>
														</span>
													</DisclosureButton>
												</legend>
												<DisclosurePanel className="px-4 pb-2 pt-4">
													<div className="space-y-6">
														{section.options.map((option, optionIdx) => (
															<div
																key={option.value}
																className="flex items-center"
															>
																<input
																	defaultValue={option.value}
																	id={`${section.id}-${optionIdx}-mobile`}
																	name={`${section.id}[]`}
																	type="checkbox"
																	className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																/>
																<label
																	htmlFor={`${section.id}-${optionIdx}-mobile`}
																	className="ml-3 text-sm text-gray-500"
																>
																	{option.label}
																</label>
															</div>
														))}
													</div>
												</DisclosurePanel>
											</fieldset>
										</Disclosure>
									))}
								</form>
							</DialogPanel>
						</div>
					</Dialog>

					<main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
						<div className="border-b flex items-center justify-between border-gray-200 pb-10 gap-5">
							<div className="flex items-center gap-5">
								<button className="bg-[#F9F8FF] text-sm border border-[#F9F8FF] text-primaryText rounded-lg px-5 py-3">
									Filters
								</button>
								<button className="bg-[#F9F8FF] text-sm border border-[#F9F8FF] text-primaryText rounded-lg px-5 py-3">
									Clear All
								</button>
							</div>

							<Menu as="div" className="relative inline-block text-left">
								<div>
									<MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-[#F9F8FF] text-sm  px-3 py-3 text-sm font-medium text-primaryText shadow-sm ring-1 ring-inset ring-[#F9F8FF] hover:bg-gray-50">
										Sort BY
										<ChevronDownIcon
											aria-hidden="true"
											className="-mr-1 h-5 w-5 text-gray-400"
										/>
									</MenuButton>
								</div>

								<MenuItems
									transition
									className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
								>
									Lowest
								</MenuItems>
								<MenuItems
									transition
									className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
								>
									Highest
								</MenuItems>
							</Menu>
						</div>

						<div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
							<aside>
								<h2 className="sr-only">Filters</h2>

								<button
									type="button"
									onClick={() => setMobileFiltersOpen(true)}
									className="inline-flex items-center lg:hidden"
								>
									<span className="text-sm font-medium text-gray-700">
										Filters
									</span>
									<PlusIcon
										aria-hidden="true"
										className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
									/>
								</button>

								<div className="hidden lg:block">
									<form className="space-y-10 divide-y divide-gray-200">
										{filters.map((section, sectionIdx) => (
											<div key={section.name}>
												<fieldset>
													<legend className="block text-sm font-medium text-gray-900">
														{section.name}
													</legend>
													<div className="space-y-3 pt-6">
														{section.options.map((option, optionIdx) => (
															<div
																key={option.value}
																className="flex items-center"
															>
																<input
																	defaultValue={option.value}
																	id={`${section.id}-${optionIdx}`}
																	name={`${section.id}[]`}
																	type="checkbox"
																	className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																/>
																<label
																	htmlFor={`${section.id}-${optionIdx}`}
																	className="ml-3 text-sm text-gray-600"
																>
																	{option.label}
																</label>
															</div>
														))}
													</div>
												</fieldset>
											</div>
										))}
									</form>
								</div>
							</aside>

							<div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
								{isLoading ? (
									<div className="h-[50vh] flex items-center justify-center">
										<OrbitProgress
										color="#4A23A4"
										size="medium"
										text=""
										textColor=""
									/>
									</div>
								) : (
									<div className="grid grid-cols-3 gap-10 ">
										{listings?.map(
											(
												{ nft_contract_address, seller, token_id, amount, listing_id },
												i
											) => (
												<div key={i}>
													<NFTCard lisiting_id={listing_id} title={nft_contract_address} seller={seller} route="/details" amount={amount} />
												</div>
											)
										)}
									</div>
								)}
							</div>
						</div>
					</main>
				</div>
			</div>
		</Layout>
	);
};

export default MarketPlace;
