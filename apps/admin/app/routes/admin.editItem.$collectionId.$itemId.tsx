import { MDXEditorComponent } from "@/components/mdx-editor";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useParams } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { client } from "~/lib/client";

export default function AdminEditItemCollectionIdItemId() {
	const { collectionId, itemId } = useParams();
	const [schema, setSchema] = useState<Record<string, unknown>>({});
	const [formData, setFormData] = useState<Record<string, unknown>>({});
	const { selectedWorkspaceId, editItem } = useStore();
	const { toast } = useToast();
	const [status, setStatus] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSchemaAndItem = async () => {
			if (!selectedWorkspaceId || !collectionId || !itemId) {
				return;
			}
			setIsLoading(true);
			try {
				// スキーマの取得
				const schemaRes = await client.api.collection[":workspace_id"][
					":collection_id"
				].schema.$get({
					param: {
						workspace_id: selectedWorkspaceId,
						collection_id: collectionId,
					},
				});
				const schemaData = await schemaRes.json();
				setSchema(schemaData);

				// アイテムの取得
				const itemRes = await client.api.workspaces[":workspace_id"][":id"][
					":item_id"
				].$get({
					param: {
						workspace_id: selectedWorkspaceId,
						id: collectionId,
						item_id: itemId,
					},
				});
				const itemData = await itemRes.json();

				// データの型を確認してからセット
				if (itemData?.data) {
					console.log("Raw item data:", itemData);
					console.log("Item data fields:", itemData.data);

					// MDXフィールドの処理
					const processedData = Object.entries(itemData.data).reduce(
						(acc, [key, value]) => {
							const fieldSchema = schemaData.properties[key];
							if (fieldSchema && fieldSchema.format === "mdx") {
								acc[key] = value?.toString() || "";
							} else {
								acc[key] = value;
							}
							return acc;
						},
						{},
					);

					console.log("Processed form data:", processedData);
					setFormData(processedData);
					setStatus(itemData.status || "");
				}
			} catch (error) {
				console.error("Failed to fetch schema or item:", error);
				toast({
					title: "エラー",
					description: "スキーマまたはアイテムの取得に失敗しました。",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		if (selectedWorkspaceId && collectionId && itemId) {
			fetchSchemaAndItem();
		}
	}, [selectedWorkspaceId, collectionId, itemId, toast]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedWorkspaceId || !collectionId || !itemId) {
			toast({
				title: "エラー",
				description:
					"ワークスペース、コレクション、またはアイテムIDが不足しています。",
				variant: "destructive",
			});
			return;
		}

		// スキーマに基づいてformDataを変換
		const formattedData = {
			...Object.entries(formData).reduce(
				(acc, [key, value]) => {
					const fieldSchema = schema.properties[key];
					if (fieldSchema) {
						if (
							fieldSchema.type === "number" &&
							typeof value === "string" &&
							!Number.isNaN(Number(value))
						) {
							acc[key] = Number(value);
						} else {
							acc[key] = value;
						}
					} else {
						acc[key] = value;
					}
					return acc;
				},
				{} as Record<string, unknown>,
			),
		};

		try {
			console.log("送信するデータ:", formattedData);
			console.log("送信するステータス:", status);
			await editItem(itemId, collectionId, formattedData, status);
			toast({
				title: "成功",
				description: "アイテムが更新されました。",
			});
			// リダイレクトなどの処理をここに追加
		} catch (error) {
			toast({
				title: "エラー",
				description: "アイテムの更新に失敗しました。",
				variant: "destructive",
			});
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-4 p-4">
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-4 w-[200px]" />
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-[200px] w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-10 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4 p-4">
				<Card>
					<CardHeader>
						<CardTitle>アイテム編集</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Suspense
							fallback={
								<div className="space-y-2">
									<Skeleton className="h-4 w-[100px]" />
									<Skeleton className="h-[200px] w-full" />
								</div>
							}
						>
							{Object.entries(schema.properties || {}).map(([key, value]) => (
								<div key={key} className="flex flex-col space-y-2">
									<Label htmlFor={key}>{key}:</Label>
									{(value as { format?: string }).format === "mdx" ? (
										<MDXEditorComponent
											value={(() => {
												const mdxValue = formData[key];
												console.log("MDX field:", key);
												console.log("MDX raw value:", mdxValue);
												console.log("MDX type:", typeof mdxValue);
												return typeof mdxValue === "string" ? mdxValue : "";
											})()}
											onChange={(newValue) => {
												console.log("MDX value changed:", newValue);
												setFormData((prev) => ({ ...prev, [key]: newValue }));
											}}
										/>
									) : (
										<Input
											id={key}
											value={formData[key]?.toString() || ""}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
											placeholder={`Enter ${key}`}
											required={schema.required?.includes(key)}
										/>
									)}
								</div>
							))}
						</Suspense>
						<div className="flex items-center space-x-2">
							<Label htmlFor="status">ステータス:</Label>
							<Select
								value={status}
								onValueChange={(value) => setStatus(value)}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue defaultValue={status} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="draft">draft</SelectItem>
									<SelectItem value="published">published</SelectItem>
									<SelectItem value="archived">archived</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit">アイテムを更新</Button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>スキーマ</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-gray-100 p-2 rounded">
							{JSON.stringify(schema, null, 2)}
						</pre>
					</CardContent>
				</Card>
			</form>
			<Toaster />
		</>
	);
}
