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
		type: "string",
		required: false,
		validation: {},
	});

	useEffect(() => {
		const schema = generateSchema();
		onSchemaChange(JSON.parse(schema));
	}, [onSchemaChange]);

	const addField = (e: React.MouseEvent) => {
		e.preventDefault();
		if (currentField.name) {
			setFields([...fields, currentField]);
			setCurrentField({
				name: "",
				type: "string",
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
		const schema = {
			type: "object",
			properties: {},
			required: [],
		};
		for (const field of fields) {
			schema.properties[field.name] = { type: field.type, ...field.validation };
			if (field.required) {
				schema.required.push(field.name);
			}
		}

		return JSON.stringify(schema, null, 2);
	};

	const renderValidationOptions = () => {
		switch (currentField.type) {
			case "string":
				return (
					<>
						<div className="flex items-center space-x-2">
							<Label htmlFor="minLength">Min Length:</Label>
							<Input
								id="minLength"
								type="number"
								onChange={(e) =>
									updateValidation("minLength", Number.parseInt(e.target.value))
								}
								placeholder="Min length"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="maxLength">Max Length:</Label>
							<Input
								id="maxLength"
								type="number"
								onChange={(e) =>
									updateValidation("maxLength", Number.parseInt(e.target.value))
								}
								placeholder="Max length"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="pattern">Regex Pattern:</Label>
							<Input
								id="pattern"
								onChange={(e) => updateValidation("pattern", e.target.value)}
								placeholder="Regex pattern"
							/>
						</div>
					</>
				);
			case "number":
				return (
					<>
						<div className="flex items-center space-x-2">
							<Label htmlFor="minimum">Minimum:</Label>
							<Input
								id="minimum"
								type="number"
								onChange={(e) =>
									updateValidation("minimum", Number.parseFloat(e.target.value))
								}
								placeholder="Minimum value"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Label htmlFor="maximum">Maximum:</Label>
							<Input
								id="maximum"
								type="number"
								onChange={(e) =>
									updateValidation("maximum", Number.parseFloat(e.target.value))
								}
								placeholder="Maximum value"
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
					<CardTitle>Add New Field</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-2">
						<Label htmlFor="fieldName">Field Name:</Label>
						<Input
							id="fieldName"
							value={currentField.name}
							onChange={(e) =>
								setCurrentField({ ...currentField, name: e.target.value })
							}
							placeholder="Enter field name"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Label htmlFor="fieldType">Field Type:</Label>
						<Select
							value={currentField.type}
							onValueChange={(value) =>
								setCurrentField({
									...currentField,
									type: value,
									validation: {},
								})
							}
						>
							<SelectTrigger id="fieldType">
								<SelectValue placeholder="Select field type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="string">String</SelectItem>
								<SelectItem value="number">Number</SelectItem>
								<SelectItem value="boolean">Boolean</SelectItem>
								<SelectItem value="object">Object</SelectItem>
								<SelectItem value="array">Array</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center space-x-2">
						<Label htmlFor="fieldRequired">Required:</Label>
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
						<PlusCircle className="mr-2 h-4 w-4" /> Add Field
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Current Schema</CardTitle>
				</CardHeader>
				<CardContent>
					{fields.map((field, index) => (
						<div
							key={field.name}
							className="flex items-center justify-between mb-2"
						>
							<span>
								{field.name} ({field.type}
								{field.required ? ", required" : ""}
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
					<CardTitle>Generated JSON Schema</CardTitle>
				</CardHeader>
				<CardContent>
					<pre className="bg-gray-100 p-2 rounded">{generateSchema()}</pre>
				</CardContent>
			</Card>
		</div>
	);
};

export default SchemaBuilderForm;
