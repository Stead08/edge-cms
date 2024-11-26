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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import Form from "@rjsf/core";
import type { RegistryWidgetsType, WidgetProps } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { client } from "~/lib/client";

const CustomTextWidget = (props: WidgetProps) => {
	return <Input onChange={(e) => props.onChange(e.target.value)} />;
};

const widgets: RegistryWidgetsType = {
	TextWidget: CustomTextWidget,
};

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
		console.log("formData", formData);
		if (!selectedWorkspaceId || !collectionId) {
			toast({
				title: "エラー",
				description: "ワークスペースまたはコレクションが選択されていません。",
				variant: "destructive",
			});
			return;
		}

		// スキーマに基づいてformDataを変換
		const formattedData = Object.entries(formData).reduce(
			(acc, [key, value]) => {
				// スキーマの型を確認
				const fieldSchema = schema.properties[key];

				if (fieldSchema) {
					if (
						fieldSchema.type === "number" &&
						typeof value === "string" &&
						!Number.isNaN(Number(value))
					) {
						acc[key] = Number(value); // number型の場合は数値に変換
					} else {
						acc[key] = value; // string型の場合はそのまま使用
					}
				} else {
					acc[key] = value; // スキーマに存在しない場合はそのまま使用
				}
				return acc;
			},
			{} as Record<string, unknown>,
		);

		try {
			console.log("送信するデータ:", formattedData); // デバッグ用
			await createItem(collectionId, formattedData);
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
			<div className="space-y-4 p-4">
				<Card>
					<CardHeader>
						<CardTitle>アイテム作成</CardTitle>
					</CardHeader>
					<CardContent>
						<Form
							schema={schema}
							formData={formData}
							onSubmit={(_data, e) => handleSubmit(e)}
							validator={validator}
							onChange={(e) => setFormData(e.formData)}
							widgets={widgets}
						>
							{Object.entries(schema.properties || {}).map(([key, value]) => (
								<div key={key} className="flex flex-col space-y-2">
									<Label htmlFor={key}>{key}:</Label>
									{value.format === "mdx" ? (
										<MDXEditorComponent
											value={(formData[key] as string) || ""}
											onChange={(newValue) => {
												setFormData((prev) => ({ ...prev, [key]: newValue }));
											}}
										/>
									) : (
										<Input
											id={key}
											value={formData[key] || ""}
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
							<Button type="submit">アイテムを作成</Button>
						</Form>
					</CardContent>
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
			</div>
			<Toaster />
		</>
	);
}
