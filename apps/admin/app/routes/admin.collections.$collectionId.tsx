import { Layout } from "@/components/custom/layout";
import ThemeSwitch from "@/components/theme-switch";
import { TopNav } from "@/components/top-nav";
import { UserNav } from "@/components/user-nav";
import {
	File,
	Home,
	LineChart,
	ListFilter,
	MoreHorizontal,
	Package,
	Package2,
	PanelLeft,
	PlusCircle,
	Search,
	ShoppingCart,
	Users2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";
import { Link, useParams } from "@remix-run/react";
import { useEffect } from "react";

export const description = "collections";

export default function Collections() {
	const { items, fetchItems } = useStore();
	const { collectionId } = useParams();
	if (!collectionId) {
		return <div>Collection ID is not provided</div>;
	}
	useEffect(() => {
		fetchItems(collectionId);
	}, [collectionId]);

	if (!items) {
		return <div>No items found</div>;
	}
	// 最初のアイテムの構造を取得
	const firstItem = items[0];
	if (!firstItem) {
		return <div>No items found</div>;
	}
	const keys = Object.keys(firstItem.data);
	return (
		<Layout>
			{/* ===== Top Heading ===== */}
			<Layout.Header>
				<TopNav links={topNav} />
				<div className="ml-auto flex items-center space-x-4">
					<Search />
					<ThemeSwitch />
					<UserNav />
				</div>
			</Layout.Header>

			{/* ===== Main ===== */}
			<Layout.Body>
				<div className="flex min-h-screen w-full flex-col">
					<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
						<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
							<Sheet>
								<SheetTrigger asChild>
									<Button size="icon" variant="outline" className="sm:hidden">
										<PanelLeft className="h-5 w-5" />
										<span className="sr-only">Toggle Menu</span>
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="sm:max-w-xs">
									<nav className="grid gap-6 text-lg font-medium">
										<Link
											to="#"
											className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
										>
											<Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
											<span className="sr-only">Acme Inc</span>
										</Link>
										<Link
											to="#"
											className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
										>
											<Home className="h-5 w-5" />
											Dashboard
										</Link>
										<Link
											to="#"
											className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
										>
											<ShoppingCart className="h-5 w-5" />
											Orders
										</Link>
										<Link
											to="#"
											className="flex items-center gap-4 px-2.5 text-foreground"
										>
											<Package className="h-5 w-5" />
											Products
										</Link>
										<Link
											to="#"
											className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
										>
											<Users2 className="h-5 w-5" />
											Customers
										</Link>
										<Link
											to="#"
											className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
										>
											<LineChart className="h-5 w-5" />
											Settings
										</Link>
									</nav>
								</SheetContent>
							</Sheet>
							<div className="relative ml-auto flex-1 md:grow-0">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search..."
									className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
								/>
							</div>
						</header>
						<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
							<Tabs defaultValue="all">
								<div className="flex items-center">
									<TabsList>
										<TabsTrigger value="all">All</TabsTrigger>
										<TabsTrigger value="active">Active</TabsTrigger>
										<TabsTrigger value="draft">Draft</TabsTrigger>
										<TabsTrigger value="archived" className="hidden sm:flex">
											Archived
										</TabsTrigger>
									</TabsList>
									<div className="ml-auto flex items-center gap-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="h-7 gap-1"
												>
													<ListFilter className="h-3.5 w-3.5" />
													<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
														Filter
													</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Filter by</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuCheckboxItem checked>
													Active
												</DropdownMenuCheckboxItem>
												<DropdownMenuCheckboxItem>
													Draft
												</DropdownMenuCheckboxItem>
												<DropdownMenuCheckboxItem>
													Archived
												</DropdownMenuCheckboxItem>
											</DropdownMenuContent>
										</DropdownMenu>
										<Button size="sm" variant="outline" className="h-7 gap-1">
											<File className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
												Export
											</span>
										</Button>
										<Button size="sm" className="h-7 gap-1">
											<PlusCircle className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
												New Item
											</span>
										</Button>
									</div>
								</div>
								<TabsContent value="all">
									<Card>
										<CardContent>
											<Table>
												<TableHeader>
													<TableRow>
														{keys.map((key) => (
															<TableHead key={key}>
																{key.charAt(0).toUpperCase() + key.slice(1)}
															</TableHead>
														))}
														<TableHead>
															<span className="sr-only">Actions</span>
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{items.map((item) => (
														<TableRow key={item.id}>
															{keys.map((key) => (
																<TableCell key={key}>
																	{item.data[key]}
																</TableCell>
															))}
															<TableCell>
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button
																			aria-haspopup="true"
																			size="icon"
																			variant="ghost"
																		>
																			<MoreHorizontal className="h-4 w-4" />
																			<span className="sr-only">
																				Toggle menu
																			</span>
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent align="end">
																		<DropdownMenuLabel>
																			Actions
																		</DropdownMenuLabel>
																		<DropdownMenuItem>Edit</DropdownMenuItem>
																		<DropdownMenuItem>Delete</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</CardContent>
										<CardFooter>
											<div className="text-xs text-muted-foreground">
												Showing <strong>1-{items.length}</strong> of{" "}
												<strong>{items.length}</strong> products
											</div>
										</CardFooter>
									</Card>
								</TabsContent>
							</Tabs>
						</main>
					</div>
				</div>
			</Layout.Body>
		</Layout>
	);
}

const topNav = [
	{
		title: "Overview",
		href: "dashboard/overview",
		isActive: true,
	},
	{
		title: "Customers",
		href: "dashboard/customers",
		isActive: false,
	},
	{
		title: "Products",
		href: "dashboard/products",
		isActive: false,
	},
	{
		title: "Settings",
		href: "dashboard/settings",
		isActive: false,
	},
];
