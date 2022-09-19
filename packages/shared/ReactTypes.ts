export type Ref = any;
export type ElementType = any;
export type Key = string | null;
export type Props = {
	[key: string]: any;
	children?: ReactElement;
};

export interface ReactElement {
	$$typeof: symbol | number;
	type: ElementType;
	key: Key;
	props: Props;
	ref: Ref;
	__mark: 'Seven';
}

export type Action<State> = State | ((prevState: State) => State);
