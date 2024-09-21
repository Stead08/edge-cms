import { useAuthStore } from "@/store/useAuthStore";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Form, Link } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const schema = z.object({
	username: z
		.string({ required_error: "必須" })
		.email({ message: "メールアドレスの形式で入力してください" })
		.max(500, { message: "500文字以内で入力してください" }),
	password: z
		.string({ required_error: "必須" })
		.min(8, { message: "8文字以上で入力してください" }),
});

export default function InputForm() {
	const [message, setMessage] = useState<string | null>(null);
	const [form, fields] = useForm({
		onValidate: ({ formData }) => parseWithZod(formData, { schema }),
		constraint: getZodConstraint(schema),
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		onSubmit: async (e) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			const data = Object.fromEntries(formData.entries());
			const res = await useAuthStore.getState().login(formData);
			if (!res) {
				setMessage("ログイン失敗");
			}
		},
	});

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<Form {...getFormProps(form)}>
					<div>
						<Label htmlFor={fields.username.id}>メールアドレス</Label>
						<Input
							placeholder="example@example.com"
							{...getInputProps(fields.username, { type: "email" })}
							key={fields.username.key}
						/>
						<div id={fields.username.errorId} className="text-destructive h-4">
							{fields.username.errors}
						</div>
						<Label htmlFor={fields.password.id}>パスワード</Label>
						<Input
							placeholder="password"
							{...getInputProps(fields.password, { type: "password" })}
							key={fields.password.key}
						/>
						<div id={fields.password.errorId} className="text-destructive h-4">
							{fields.password.errors}
						</div>
						<div className="flex justify-center mt-4">
							<Button type="submit">ログイン</Button>
						</div>
						{message && <div className="text-destructive">{message}</div>}
					</div>
				</Form>
				<Link
					to="/signup"
					className="text-sm text-gray-500 mt-4 block text-center"
				>
					Don't have an account? Sign up
				</Link>
			</div>
		</div>
	);
}
