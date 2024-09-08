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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { client } from "~/lib/client";

export default function AdminCreateItem() {
	const { collectionId } = useParams();
	const [schema, setSchema] = useState<Record<string, unknown>>({});
	const [formData, setFormData] = useState<Record<string, unknown>>({});
	const { selectedWorkspaceId, createItem } = useStore();
	const { toast } = useToast();

	useEffect(() => {
		const fetchSchema = async () => {
			if (!selectedWorkspaceId || !collectionId) {
				return;
			}
			try {
				const res = await client.api.collection[":workspace_id"][
					":collection_id"
				].schema.$get({
					param: {
						workspace_id: selectedWorkspaceId,
						collection_id: collectionId,
					},
				});
				const schemaData = await res.json();
				setSchema(schemaData);
			} catch (error) {
				console.error("Failed to fetch schema:", error);
				toast({
					title: "エラー",
					description: "スキーマの取得に失敗しました。",
					variant: "destructive",
				});
			}
		};

		if (selectedWorkspaceId && collectionId) {
			fetchSchema();
		}
	}, [selectedWorkspaceId, collectionId, toast]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedWorkspaceId || !collectionId) {
			toast({
				title: "エラー",
				description: "ワークスペースまたはコレクションが選択されていません。",
				variant: "destructive",
			});
			return;
		}
		try {
			await createItem(collectionId, formData);
			toast({
				title: "成功",
				description: "アイテムが作成されました。",
			});
			// リダイレクトなどの処理をここに追加
		} catch (error) {
			toast({
				title: "エラー",
				description: "アイテムの作成に失敗しました。",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4 p-4">
				<Card>
					<CardHeader>
						<CardTitle>アイテム作成</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{Object.entries(schema.properties || {}).map(([key, value]) => (
							<div key={key} className="flex items-center space-x-2">
								<Label htmlFor={key}>{key}:</Label>
								<Input
									id={key}
									value={formData[key] || ""}
									onChange={(e) =>
										setFormData({ ...formData, [key]: e.target.value })
									}
									placeholder={`Enter ${key}`}
									required={schema.required?.includes(key)}
								/>
							</div>
						))}
					</CardContent>
					<CardFooter>
						<Button type="submit">アイテムを作成</Button>
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
