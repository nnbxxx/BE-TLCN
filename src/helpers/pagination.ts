import aqp from 'api-query-params';
import {
    Model,
    PopulateOption,
    PopulateOptions,
    RootFilterQuery,
    SortOrder,
} from 'mongoose';

interface QueryOptions<T> {
    currentPage?: number | string;
    limit?: number | string;
    query?: RootFilterQuery<T>;
    sort?: { [key: string]: SortOrder };
    selectFields?: string[];
    population?: PopulateOptions | PopulateOptions[];
}

interface PaginationMeta {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface PaginatedResult<T> {
    meta: PaginationMeta;
    result: T[];
}

export async function paginate<T>(
    model: Model<T>,
    {
        currentPage = 1,
        limit = 100,
        query,
        sort,
        selectFields,
        population,
    }: QueryOptions<T>,
): Promise<PaginatedResult<T>> {
    const currentPageNumber = +currentPage;
    const limitNumber = +limit;
    const offset = (currentPageNumber - 1) * limitNumber;

    const totalItems = await model.countDocuments(query).exec();
    const totalPages = Math.ceil(totalItems / limitNumber);

    const result = await model
        .find(query)
        .skip(offset)
        .limit(limitNumber)
        .sort(sort)
        .select(selectFields)
        .populate(population)
        .exec();

    return {
        meta: {
            current: currentPageNumber,
            pageSize: limitNumber,
            pages: totalPages,
            total: totalItems,
        },
        result,
    };
}
