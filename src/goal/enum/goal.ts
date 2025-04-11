export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TargetAmount {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum Deadline {
  URGENT = 'Urgent',
  SOON = 'Soon',
  NOT_URGENT = 'Not urgent',
}

export const PRIORITY_WEIGHTS = {
  [Priority.LOW]: 1,
  [Priority.MEDIUM]: 3,
  [Priority.HIGH]: 5,
};

export const TARGET_AMOUNT_WEIGHTS = {
  [TargetAmount.LOW]: 1,
  [TargetAmount.MEDIUM]: 3,
  [TargetAmount.HIGH]: 5,
};

export const DEADLINE_WEIGHTS = {
  [Deadline.NOT_URGENT]: 1,
  [Deadline.SOON]: 3,
  [Deadline.URGENT]: 5,
};
