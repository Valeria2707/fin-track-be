import {
  DEADLINE_SOON_MAX,
  DEADLINE_URGENT_MAX,
  DEFAULT_MAX_ITER,
  DEFAULT_RI_VALUE,
  DEFAULT_TOLERANCE,
  RI,
  TARGET_AMOUNT_LOW_MAX,
  TARGET_AMOUNT_MEDIUM_MAX,
} from '../constants/goal';
import { Deadline, TargetAmount } from '../enum/goal';

export function getTargetAmountLabel(amount: number): TargetAmount {
  switch (true) {
    case amount < TARGET_AMOUNT_LOW_MAX:
      return TargetAmount.LOW;
    case amount <= TARGET_AMOUNT_MEDIUM_MAX:
      return TargetAmount.MEDIUM;
    default:
      return TargetAmount.HIGH;
  }
}

export function getDeadlineLabel(deadline: Date): Deadline {
  const now = new Date();
  const monthsLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);

  switch (true) {
    case monthsLeft < DEADLINE_URGENT_MAX:
      return Deadline.URGENT;
    case monthsLeft <= DEADLINE_SOON_MAX:
      return Deadline.SOON;
    default:
      return Deadline.NOT_URGENT;
  }
}

export function buildComparisonMatrix<K extends PropertyKey>(items: K[], weights: Record<K, number>): number[][] {
  return items.map(itemA => items.map(itemB => weights[itemA] / weights[itemB]));
}

export function calculateGeometricMeanWeights(matrix: number[][]): number[] {
  const weights = matrix.map(row =>
    Math.pow(
      row.reduce((prod, val) => prod * val, 1),
      1 / row.length,
    ),
  );

  const sum = weights.reduce((acc, val) => acc + val, 0);
  return weights.map(w => w / sum);
}

export function normalizeVector(vec: number[]): number[] {
  const norm = Math.hypot(...vec);
  return vec.map(val => val / norm);
}

export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export function multiplyMatrixVector(A: number[][], x: number[]): number[] {
  return A.map(row => row.reduce((sum, val, j) => sum + val * x[j], 0));
}

export function computeMaxEigenvalue(matrix: number[][], maxIter = DEFAULT_MAX_ITER, tol = DEFAULT_TOLERANCE): number {
  const n = matrix.length;

  let x = normalizeVector(Array.from({ length: n }, () => Math.random()));

  for (let i = 0; i < maxIter; i++) {
    const Ax = multiplyMatrixVector(matrix, x);
    const xNew = normalizeVector(Ax);

    const diff = Math.sqrt(xNew.reduce((sum, val, idx) => sum + (val - x[idx]) ** 2, 0));
    if (diff < tol) break;

    x = xNew;
  }

  const Ax = multiplyMatrixVector(matrix, x);
  return dotProduct(x, Ax);
}

export function computeAHPMetrics(matrix: number[][]) {
  const n = matrix.length;
  const lambdaMax = computeMaxEigenvalue(matrix);
  const CI = (lambdaMax - n) / (n - 1);

  const RIvalue = RI[n - 1] ?? DEFAULT_RI_VALUE;
  const CR = RIvalue === 0 ? 0 : CI / RIvalue;
  const weights = calculateGeometricMeanWeights(matrix);

  return { lambdaMax, CI, CR, weights };
}
