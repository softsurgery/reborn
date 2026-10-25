type IWhereCondition = Record<string, unknown>;
type IWhereClause = IWhereCondition | IWhereCondition[];

function hasNumericKeys(where: IWhereCondition): boolean {
  return Object.keys(where).some((key) => /^\d+$/.test(key));
}

function extractWhereConditions(where: IWhereClause): IWhereCondition[] {
  if (Array.isArray(where)) {
    return where;
  }

  if (!hasNumericKeys(where)) {
    return [where];
  }

  const keys = Object.keys(where);
  const numericKeys = keys
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b));

  const sharedConditions = keys
    .filter((key) => !/^\d+$/.test(key))
    .reduce<IWhereCondition>((acc, key) => {
      acc[key] = where[key];
      return acc;
    }, {});

  return numericKeys.map((key) => ({
    ...(where[key] as IWhereCondition),
    ...sharedConditions,
  }));
}

export function mergeWhereConditions(
  where: IWhereClause | undefined,
  extra: IWhereCondition,
): IWhereClause {
  if (where === undefined || where === null) {
    return extra;
  }

  const conditions = extractWhereConditions(where);

  if (conditions.length === 0) {
    return extra;
  }

  if (conditions.length === 1) {
    return {
      ...conditions[0],
      ...extra,
    };
  }

  return conditions.map((condition) => ({
    ...condition,
    ...extra,
  }));
}
