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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FieldType } from "@repo/core";
import { convertFieldTypeToJsonSchema } from "@repo/core";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SchemaBuilderFormProps {
	onSchemaChange: (schema: Record<string, unknown>) => void;
}

const SchemaBuilderForm: React.FC<SchemaBuilderFormProps> = ({
	onSchemaChange,
}) => {
	const [fields, setFields] = useState<Record<string, unknown>[]>([]);
	const [currentField, setCurrentField] = useState({
		name: "",
		type: FieldType.TEXT,
		required: false,
		validation: {},
	});

	useEffect(() => {
		const schema = generateSchema();
		onSchemaChange(schema);
	}, [fields, onSchemaChange]);

	const addField = (e: React.MouseEvent) => {
		e.preventDefault();
		if (currentField.name) {
			setFields([...fields, currentField]);
			setCurrentField({
				name: "",
				type: FieldType.TEXT,
				required: false,
				validation: {},
			});
		}
	};

	const removeField = (index: number) => {
		const newFields = fields.filter((_, i) => i !== index);
		setFields(newFields);
	};

	const updateValidation = (key: string, value: unknown) => {
		setCurrentField({
			...currentField,
			validation: { ...currentField.validation, [key]: value },
		});
	};

	const generateSchema = () => {
		const schema: Record<string, unknown> = {
			type: "object",
			properties: {},
			required: [],
		};
		for (const field of fields) {
			schema.properties[field.name] = convertFieldTypeToJsonSchema(
				field.type as FieldType,
				field.validation,
			);
			if (field.required) {
				schema.required.push(field.name);
			}
		}
		return schema;
	};

	const renderValidationOptions = () => {
		switch (currentField.type) {
			case FieldType.TEXT:
			case FieldType.EMAIL:
			case FieldType.URL:
				return (
					<>
						<div className="flex items-center space-x-2">
							<Label htmlFor="minLength">最小長:</Label>
							<Input
								id="minLength"
								type="number"
								onChange={(e) =>
									updateValidation("minLength", Number.parseInt(e.target.value))
								}
								placeholder="最小長"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="maxLength">最大長:</Label>
							<Input
								id="maxLength"
								type="number"
								onChange={(e) =>
									updateValidation("maxLength", Number.parseInt(e.target.value))
								}
								placeholder="最大長"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="pattern">正規表現パターン:</Label>
							<Input
								id="pattern"
								onChange={(e) => updateValidation("pattern", e.target.value)}
								placeholder="正規表現パターン"
							/>
						</div>
					</>
				);
			case FieldType.NUMBER:
				return (
					<>
						<div className="flex items-center space-x-2">
							<Label htmlFor="minimum">最小値:</Label>
							<Input
								id="minimum"
								type="number"
								onChange={(e) =>
									updateValidation("minimum", Number.parseFloat(e.target.value))
								}
								placeholder="最小値"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="maximum">最大値:</Label>
							<Input
								id="maximum"
								type="number"
								onChange={(e) =>
									updateValidation("maximum", Number.parseFloat(e.target.value))
								}
								placeholder="最大値"
							/>
						</div>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>新しいフィールドを追加</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<Label htmlFor="fieldName">フィールド名:</Label>
						<Input
							id="fieldName"
							value={currentField.name}
							onChange={(e) =>
								setCurrentField({ ...currentField, name: e.target.value })
							}
							placeholder="フィールド名を入力"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Label htmlFor="fieldType">フィールドタイプ:</Label>
						<Select
							value={currentField.type}
							onValueChange={(value) =>
								setCurrentField({
									...currentField,
									type: value as FieldType,
									validation: {},
								})
							}
						>
							<SelectTrigger id="fieldType">
								<SelectValue placeholder="フィールドタイプを選択" />
							</SelectTrigger>
							<SelectContent>
								{Object.values(FieldType).map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center space-x-2">
						<Label htmlFor="fieldRequired">必須:</Label>
						<Switch
							id="fieldRequired"
							checked={currentField.required}
							onCheckedChange={(checked) =>
								setCurrentField({ ...currentField, required: checked })
							}
						/>
					</div>
					{renderValidationOptions()}
				</CardContent>
				<CardFooter>
					<Button onClick={addField} type="button">
						<PlusCircle className="mr-2 h-4 w-4" /> フィールドを追加
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>現在のスキーマ</CardTitle>
				</CardHeader>
				<CardContent>
					{fields.map((field, index) => (
						<div
							key={field.name}
							className="flex items-center justify-between mb-2"
						>
							<span>
								{field.name} ({field.type}
								{field.required ? ", 必須" : ""}
								{Object.entries(field.validation)
									.map(([key, value]) => `, ${key}: ${value}`)
									.join("")}
								)
							</span>
							<Button
								variant="destructive"
								size="sm"
								onClick={() => removeField(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>生成されたJSONスキーマ</CardTitle>
				</CardHeader>
				<CardContent>
					<pre className="bg-gray-100 p-2 rounded">
						{JSON.stringify(generateSchema(), null, 2)}
					</pre>
				</CardContent>
			</Card>
		</div>
	);
};

export default SchemaBuilderForm;
