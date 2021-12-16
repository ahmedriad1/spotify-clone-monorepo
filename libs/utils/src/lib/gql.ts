import { DocumentNode, parse, DefinitionNode, Location } from 'graphql';

const docCache = new Map<string, DocumentNode>();
const fragmentSourceMap = new Map<string, Set<string>>();

const experimentalFragmentVariables = false;
const printFragmentWarnings = true;

const normalize = (str: string) => str.replace(/[\s,]+/g, ' ').trim();

const stripLoc = (doc: DocumentNode) => {
  const workSet = new Set<Record<string, any>>(doc.definitions);

  workSet.forEach((node) => {
    if (node.loc) delete node.loc;
    Object.keys(node).forEach((key) => {
      const value = node[key];
      if (value && typeof value === 'object') {
        workSet.add(value);
      }
    });
  });

  const loc = doc.loc as Record<string, any>;
  if (loc) {
    delete loc.startToken;
    delete loc.endToken;
  }

  return doc;
};

const cacheKeyFromLoc = (loc: Location) =>
  normalize(loc.source.body.substring(loc.start, loc.end));

const processFragments = (ast: DocumentNode) => {
  const seenKeys = new Set<string>();
  const definitions: DefinitionNode[] = [];

  ast.definitions.forEach((fragmentDefinition) => {
    if (fragmentDefinition.kind === 'FragmentDefinition') {
      const fragmentName = fragmentDefinition.name.value;
      const sourceKey = cacheKeyFromLoc(fragmentDefinition.loc!);

      // We know something about this fragment
      let sourceKeySet = fragmentSourceMap.get(fragmentName);
      if (sourceKeySet && !sourceKeySet.has(sourceKey)) {
        if (printFragmentWarnings) {
          console.warn(
            'Warning: fragment with name ' +
              fragmentName +
              ' already exists.\n' +
              'graphql-tag enforces all fragment names across your application to be unique; read more about\n' +
              'this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names'
          );
        }
      } else if (!sourceKeySet)
        fragmentSourceMap.set(fragmentName, (sourceKeySet = new Set()));

      sourceKeySet.add(sourceKey);

      if (!seenKeys.has(sourceKey)) {
        seenKeys.add(sourceKey);
        definitions.push(fragmentDefinition);
      }
    } else definitions.push(fragmentDefinition);
  });

  return {
    ...ast,
    definitions,
  };
};

const parseDocument = (source: string) => {
  const cacheKey = normalize(source);
  if (!docCache.has(cacheKey)) {
    const parsed = parse(source, {
      experimentalFragmentVariables,
      allowLegacyFragmentVariables: experimentalFragmentVariables,
    } as any);
    if (!parsed || parsed.kind !== 'Document') {
      throw new Error('Not a valid GraphQL document.');
    }
    docCache.set(
      cacheKey,
      // check that all "new" fragments inside the documents are consistent with
      // existing fragments of the same name
      stripLoc(processFragments(parsed))
    );
  }
  return docCache.get(cacheKey)!;
};

export const gql = (literals: string | readonly string[], ...args: any[]) => {
  if (typeof literals === 'string') literals = [literals];

  let result = literals[0];

  args.forEach((arg, i) => {
    result += arg;

    result += literals[i + 1];
  });

  return result;
};
