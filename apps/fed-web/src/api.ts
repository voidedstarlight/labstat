interface NodeOptions {
	[key: string]: string;
	name: string;
}

type node_list = Record<string, NodeOptions>;

async function getNodes(): Promise<node_list> {
	const request = await fetch("/api/nodes");
	return await request.json() as node_list;
}

export { getNodes, type NodeOptions };
