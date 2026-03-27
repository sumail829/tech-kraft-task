import { AppDataSource } from "../config/data-source";
import { Property } from "../entities/property";

export interface ListingFilters {
  suburb?: string;
  price_min?: number;
  price_max?: number;
  beds?: number;
  baths?: number;
  type?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}
// console.log("app data source",AppDataSource.entityMetadatas);
export const listingsService = {
  async getAll(filters: ListingFilters, isAdmin: boolean) {
    const repo = AppDataSource.getRepository(Property);

    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 10, 50); // max 50 per page
    const skip = (page - 1) * limit;

    const qb = repo
      .createQueryBuilder("property")
      .leftJoinAndSelect("property.agent", "agent");

    // Filters
    if (filters.suburb) {
      qb.andWhere("LOWER(property.suburb) = LOWER(:suburb)", {
        suburb: filters.suburb,
      });
    }

    if (filters.price_min !== undefined) {
      qb.andWhere("property.price >= :price_min", {
        price_min: filters.price_min,
      });
    }

    if (filters.price_max !== undefined) {
      qb.andWhere("property.price <= :price_max", {
        price_max: filters.price_max,
      });
    }

    if (filters.beds !== undefined) {
      qb.andWhere("property.beds >= :beds", { beds: filters.beds });
    }

    if (filters.baths !== undefined) {
      qb.andWhere("property.baths >= :baths", { baths: filters.baths });
    }

    if (filters.type) {
      qb.andWhere("LOWER(property.propertyType) = LOWER(:type)", {
        type: filters.type,
      });
    }

    if (filters.keyword) {
      qb.andWhere(
        "(LOWER(property.title) LIKE LOWER(:kw) OR LOWER(property.description) LIKE LOWER(:kw) OR LOWER(property.suburb) LIKE LOWER(:kw))",
        { kw: `%${filters.keyword}%` }
      );
    }

    // Pagination
    qb.skip(skip).take(limit).orderBy("property.price", "ASC");

    const [data, total] = await qb.getManyAndCount();

    // Strip admin-only fields for non-admins
    const listings = data.map((p) => formatProperty(p, isAdmin));

    return {
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: number, isAdmin: boolean) {
    const repo = AppDataSource.getRepository(Property);

    const property = await repo
      .createQueryBuilder("property")
      .leftJoinAndSelect("property.agent", "agent")
      .where("property.id = :id", { id })
      .getOne();

    if (!property) return null;

    return formatProperty(property, isAdmin);
  },
};

function formatProperty(property: Property, isAdmin: boolean) {
  const result: any = {
    id: property.id,
    title: property.title,
    description: property.description,
    suburb: property.suburb,
    propertyType: property.propertyType,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    agent: property.agent
      ? {
          id: property.agent.id,
          name: property.agent.name,
          email: property.agent.email,
          phone: property.agent.phone,
        }
      : null,
  };

  // Only admins see internal notes
  if (isAdmin) {
    result.internalStatusNotes = property.internalStatusNotes;
  }

  return result;
}