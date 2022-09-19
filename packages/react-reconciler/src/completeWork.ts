import { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
import {
	appendInitialChild,
	createInstance,
	createTextInstance,
	Instance
} from './hostConfig';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';

const appendAllChildren = (parent: Instance, workInProgress: FiberNode) => {
	// 遍历workInProgress所有子孙 DOM元素，依次挂载
	let node = workInProgress.child;
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === workInProgress) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === workInProgress) {
				return;
			}
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
};

const bubbleProperties = (completeWork: FiberNode) => {
	let subtreeFlags = NoFlags;
	let child = completeWork.child;
	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = completeWork;
		child = child.sibling;
	}
	completeWork.subtreeFlags |= subtreeFlags;
};

export const completeWork = (workInProgress: FiberNode) => {
	const newProps = workInProgress.pendingProps;

	switch (workInProgress.tag) {
		case HostComponent:
			// 初始化DOM
			const instance = createInstance(workInProgress.type);
			// 挂载DOM
			appendAllChildren(instance, workInProgress);
			workInProgress.stateNode = instance;

			// 初始化元素属性 TODO

			// 冒泡flag
			bubbleProperties(workInProgress);
			return null;
		case HostRoot:
			bubbleProperties(workInProgress);
			return null;
		case HostText:
			// 初始化DOM
			const TextInstance = createTextInstance(newProps.content);
			workInProgress.stateNode = TextInstance;
			// 冒泡flag
			bubbleProperties(workInProgress);
			return null;
		case FunctionComponent:
			bubbleProperties(workInProgress);
			return null;
		default:
			console.error('completeWork未定义的fiber.tag', workInProgress);
			return null;
	}
};
