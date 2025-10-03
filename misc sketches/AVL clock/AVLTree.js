class AVLTree {
  constructor() {
    this.root = null;
    this.currentX = 0;
    this.maxDepth = 0;
		this.newestNode = null;
  }
	
  display() {
    if (this.root != null) {
      this.root.display(this.newestNode);
    }
  }
	
	//----------------------------------------------------------

  insert(val, measure, x, y) {
    this.root = this.insertHelper(this.root, val, measure, x, y);
    this.maxDepth = this.getMaxDepth(this.root);  // recalculate max depth
		if (measure == Measure.SEC) this.newestNode = val;
  }

  insertHelper(node, val, measure, x, y) {
    if (node == null) {
			return new Node(val, measure, x, y);
    }
		
    if (val < node.value) {
      node.left = this.insertHelper(node.left, val, measure, x, y);
		} else {
			node.right = this.insertHelper(node.right, val, measure, x, y);
		}

    node.height = 1 + max(this.getHeight(node.left), this.getHeight(node.right));

    // rebalance 
    let balance = this.getBalance(node);
    // left rotation 
    if (balance > 1 && val < node.left.value) {
      return this.rotateRight(node);
    }
    // right rotation 
    if (balance < -1 && val > node.right.value) {
      return this.rotateLeft(node);
    }
    // left-right rotation 
    if (balance > 1 && val > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    // right-left rotation 
    if (balance < -1 && val < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }
	
	// calculate all node position (in-order traversal)
	// node repositioning from chatGPT 
	calcNodePos() {
		let maxDepth = this.getMaxDepth(this.root); 

		let rootX = (width - 2 * borderPadding) / 2 + borderPadding;
		let rootY = borderPadding;

		this.calcNodePosHelper(this.root, rootX, rootY, 1, maxDepth);
	}

	calcNodePosHelper(node, x, y, level, maxDepth) {
		if (node == null) {
			return;
		}

		let availableWidth = width - 2 * borderPadding;
		let horizontalOffset = availableWidth / pow(2, level + 1);

		// left child 
		this.calcNodePosHelper(node.left, x - horizontalOffset, y + (height - 2 * borderPadding) / (maxDepth + 1), level + 1, maxDepth);

		// current node 
		node.targetX = x;
		node.targetY = y;
		node.animProgress = 0;
		newX = x;
		newY = y;

		// right child 
		this.calcNodePosHelper(node.right, x + horizontalOffset, y + (height - 2 * borderPadding) / (maxDepth + 1), level + 1, maxDepth);
	}

  rotateRight(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + max(this.getHeight(x.left), this.getHeight(x.right));

    return x; // new root 
  }

  rotateLeft(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  getHeight(node) {
    if (node == null) {
      return 0;
    }
    return node.height;
  }

  getBalance(node) {
    if (node == null) {
      return 0;
    }
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  getMaxDepth(node) {
    if (node == null) {
      return 0;
    }
    return 1 + max(this.getMaxDepth(node.left), this.getMaxDepth(node.right));
  }
}
