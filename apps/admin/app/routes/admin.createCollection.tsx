import SchemaBuilderForm from "@/components/json-schema-form";
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
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function AdminCreateCollection() {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [schema, setSchema] = useState({});
	const { selectedWorkspaceId, createCollection } = useStore();
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedWorkspaceId) {
			toast({
				title: "エラー",
				description: "ワークスペースが選択されていません。",
				variant: "destructive",
			});
			return;
		}
		try {
			await createCollection(selectedWorkspaceId, name, slug, schema);
			toast({
				title: "成功",
				description: "コレクションが作成されました。",
			});
			navigate("/admin/collections");
		} catch (error) {
			toast({
				title: "エラー",
				description: "コレクションの作成に失敗しました。",
				variant: "destructive",
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>コレクション作成</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<Label htmlFor="name">コレクション名:</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="コレクション名を入力"
							required
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Label htmlFor="slug">スラッグ:</Label>
						<Input
							id="slug"
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							placeholder="スラッグを入力"
							required
						/>
					</div>
				</CardContent>
			</Card>

			<SchemaBuilderForm onSchemaChange={setSchema} />

			<Card>
				<CardFooter>
					<Button type="submit">コレクションを作成</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
