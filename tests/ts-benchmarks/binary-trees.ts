class TreeNode {
    leftNode: TreeNode | null;
    rightNode: TreeNode | null;

    constructor() {
        this.leftNode = null;
        this.rightNode = null;
    }
}

function createTree(treeDepth: number): TreeNode | null {
    const rootNode = new TreeNode();
    if (treeDepth > 0) {
        rootNode.leftNode = createTree(treeDepth - 1);
        rootNode.rightNode = createTree(treeDepth - 1);
    }
    return rootNode;
}

function deleteTree(root: TreeNode | null): void {
    if (root) {
        if (root.leftNode) deleteTree(root.leftNode);
        if (root.rightNode) deleteTree(root.rightNode);
    }
}

function computeTreeChecksum(rootNode: TreeNode | null): number {
    if (rootNode && rootNode.leftNode && rootNode.rightNode) {
        return (
            computeTreeChecksum(rootNode.leftNode) +
            computeTreeChecksum(rootNode.rightNode) +
            1
        );
    }
    return 1;
}

export function main(): void {
    const minimumTreeDepth = 4;
    const maximumTreeDepth = 18;

    const stretchTree = createTree(maximumTreeDepth + 1);
    console.log(
        'stretch tree of depth ' +
            (maximumTreeDepth + 1).toString() +
            '\t check: ' +
            computeTreeChecksum(stretchTree).toString(),
    );
    deleteTree(stretchTree);

    let longLivedTree: TreeNode | null = null;
    let longLivedTreeChecksum = 0;
    const treeChecksums: number[] = new Array(
        (maximumTreeDepth - minimumTreeDepth + 2) / 2,
    ).fill(0);

    longLivedTree = createTree(maximumTreeDepth);
    longLivedTreeChecksum = computeTreeChecksum(longLivedTree);

    for (
        let treeDepth = minimumTreeDepth;
        treeDepth <= maximumTreeDepth;
        treeDepth += 2
    ) {
        let totalTreesChecksum = 0;
        for (
            let iterations =
                1 << (maximumTreeDepth - treeDepth + minimumTreeDepth);
            iterations > 0;
            iterations--
        ) {
            const tempTree = createTree(treeDepth);
            totalTreesChecksum += computeTreeChecksum(tempTree);
            deleteTree(tempTree);
        }
        treeChecksums[(treeDepth - minimumTreeDepth) / 2] = totalTreesChecksum;
    }

    deleteTree(longLivedTree);

    for (
        let treeDepth = minimumTreeDepth;
        treeDepth <= maximumTreeDepth;
        treeDepth += 2
    ) {
        console.log(
            (
                1 <<
                (maximumTreeDepth - treeDepth + minimumTreeDepth)
            ).toString() +
                '\t trees of depth ' +
                treeDepth.toString() +
                '\t check: ' +
                treeChecksums[(treeDepth - minimumTreeDepth) / 2].toString(),
        );
    }

    console.log(
        'long lived tree of depth ' +
            maximumTreeDepth.toString() +
            '\t check: ' +
            longLivedTreeChecksum.toString(),
    );
}
