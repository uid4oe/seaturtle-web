export enum CommandState{
	Pending,
	Running,
	Completed,
	Canceling,
	Canceled
}

export interface Command {
	id: number,
	operation: string,
	state: CommandState,
	status: string
	timestamp: number,
}