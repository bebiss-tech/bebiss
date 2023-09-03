import { connect } from "@planetscale/database";

export const pscale_config = {
  url: process.env.DATABASE_URL || "mysql://:pass@host",
};

export const conn = process.env.DATABASE_URL ? connect(pscale_config) : null;
