interface NodeData {
	capabilities: string;
	children: Array<NodeData>;
	description: string;
	intf: string;
	ip: string;
	name: string;
}

export type { NodeData };
