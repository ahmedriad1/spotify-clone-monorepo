import { Option } from './data';

export const createPaginatedLoader = <T>(
  searchFn: (q: string, page: number) => T,
  options: {
    total: keyof Awaited<T>;
    all: keyof Awaited<T>;
    mapOptions?: (entity: unknown) => Option;
  }
) => {
  return async (q: string, _: unknown, { page }: { page: number }) => {
    const all: any = await searchFn(q, page);

    return {
      options: all[options.all as string].map(
        options.mapOptions
          ? options.mapOptions
          : (entity: any) => ({
              label: entity.name,
              value: entity.id,
            })
      ),
      hasMore: all[options.total as string] / 10 - page > 0,
      additional: {
        page: page + 1,
      },
    };
  };
};
