import { useParams } from "@remix-run/react";
import { Button } from "~/components/custom/button";
import { useStore } from "~/store/useStore";

export default function CollectionSettings() {
	const { collectionId } = useParams();
	const { deleteCollection } = useStore();
	if (!collectionId) {
		return <div>Collection not found</div>;
	}

	return (
		<>
			<div>Collection Settings</div>
			<Button onClick={() => deleteCollection(collectionId)}>
				Delete Collection
			</Button>
		</>
	);
}
