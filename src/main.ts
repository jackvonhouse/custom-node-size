import { Plugin } from 'obsidian';
import { ObsidianView } from 'src/types';

export default class CustomNodeSize extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				const leaf = this.getGraphLeaf();
				if (!leaf) return;

				// Without interval changes do not apply.
				setInterval(() => {
					// @ts-ignore
					const view = leaf.view as ObsidianView;
					if (!view?.renderer) return;

					this.updateNodeSizes(view);
				}, 1);
			})
		);
	}

	private getGraphLeaf() {
		const leafs = this.app.workspace.getLeavesOfType('graph');
		return leafs.length === 1 ? leafs.first() : null;
	}

	private updateNodeSizes(view: ObsidianView) {
		const { renderer } = view;
		renderer?.nodes.forEach((node) => {
			const file = this.app.vault.getFileByPath(node.id);
			if (!file) return;

			const fileCache = this.app.metadataCache.getFileCache(file);
			const nodeSize = fileCache?.frontmatter?.node_size;
			if (nodeSize) {
				node.weight = nodeSize;
			}
		});
	}
}
